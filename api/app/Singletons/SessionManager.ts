import {DataPacket} from "App/Services/DataPacketService";
import Logger from "@ioc:Adonis/Core/Logger";
import Websocket from "App/Sockets/Websocket";
import MathHelper from "App/Helpers/MathHelper";
import type {Session, Lap, SessionPacket} from 'Contracts/db/session';
import SessionModel from 'App/Models/Session';
import SessionService from 'App/Services/SessionService';

class SessionManager {

  // @ts-ignore
  private queueWorker: Promise<void>;
  // @ts-ignore
  private poolingInterval: unknown;

  private queue: DataPacket[] = [];

  constructor() {

    this.queueWorker = new Promise(async () => {
      // noinspection InfiniteLoopJS
      while (true) {
        const next = this.queue.shift();
        if (! next) {
          await new Promise((r) => setTimeout(r, 1000))
          continue;
        }

        this.updateSession(next);
      }
    });

    this.poolingInterval = setInterval(() => {
      Websocket.io.emit('active-session', this.export());
    }, 1000);

    Logger.info('Session Ingest Worker Setup.');
    Logger.info('Session Pooling Worker Setup.');
  }

  public queueData(data: DataPacket): void {
    if (! data.IsRaceOn) {
      return;
    }

    if (data.SessionTimeMS <= this.currentSessionTime) {
      return;
    }

    this.queue.push(data);
  }

  public lastSession: Session;
  public laps: Lap[] = [];

  // ID
  public sessionId = 0;

  // Session Time
  public currentSessionTime = 0;
  public localSessionStartTime: number|null = null;

  // Ordinals
  public currentTrackOrdinal: string = '';
  public currentCarOrdinal: string = '';

  // Lap Number and Times
  public currentLap: number = 0;
  public currentLapTime: number = 0;
  public lastLapTime: number = 0;
  public bestLapTime: number = 0;
  public avgLapTime: number = 0;
  public medianLapTime: number = 0;

  // Distance
  public lapStartingDistance: number = 0;
  public lapCurrentDistance: number = 0;

  // Fuel
  public lapStartingFuel: number = 0;
  public currentFuel: number = 0;
  public avgFuelUsage: number = 0;

  // Wear
  public lapStartingWearFL: number = 0;
  public lapStartingWearFR: number = 0;
  public lapStartingWearRL: number = 0;
  public lapStartingWearRR: number = 0;
  public currentWearFL: number = 0;
  public currentWearFR: number = 0;
  public currentWearRL: number = 0;
  public currentWearRR: number = 0;
  public avgTireWear: number = 0;

  // Speed
  public lapMaxSpeed: number = 0;
  public lapMinSpeed: number = 0;

  // Position
  public lapStartingPosition: number = 0;

  // Raw data
  private lapData: SessionPacket[] = [];

  // debug
  public last_packet: DataPacket;

  /** Atualizar dados da sessão com cada novo pacote */
  private updateSession(data: DataPacket): void {
    this.currentSessionTime = data.SessionTimeMS;

    // Ignore if lap didn't start yet
    if (this.lapStartingDistance === 0 && data.DistanceTraveled <= 0) {
      return;
    }

    if (this.checkSessionChanged(data)) {
      return;
    }

    this.setLocalSessionStartTime(data);

    this.updateLap(data);
    this.updateCurrentState(data);

    this.last_packet = data;
  }

  /** Verificar se foi iniciada uma nova sessão */
  private checkSessionChanged(data: DataPacket): boolean {
    if (
      data.SessionTimeMS < this.currentSessionTime
      || data.CarOrdinal.toString() !== this.currentCarOrdinal
      || data.TrackOrdinal.toString() !== this.currentTrackOrdinal
      || data.LapNumber < this.currentLap
      || data.DistanceTraveled < this.lapStartingDistance
    ) {
      this.wrapupSession();
      this.resetSession(data);
      return true;
    }

    return false;
  }

  /** Resetar dados para uma nova sessão e compilar dados da sessão antiga */
  private resetSession(data: DataPacket): void {
    this.sessionId = 0;

    this.localSessionStartTime = null;
    this.currentLap = 0;

    // Ordinals
    this.currentTrackOrdinal = data.TrackOrdinal.toString();
    this.currentCarOrdinal = data.CarOrdinal.toString();

    // Lap Times
    this.currentLapTime = 0;
    this.lastLapTime = 0;
    this.bestLapTime = 0;
    this.avgLapTime = 0;

    // Distances
    this.lapStartingDistance = 0;
    this.lapCurrentDistance = 0;

    // Fuel
    this.lapStartingFuel = data.Fuel;
    this.currentFuel = data.Fuel;
    this.avgFuelUsage = 0;

    // Wear
    this.lapStartingWearFL = 0;
    this.lapStartingWearFR = 0;
    this.lapStartingWearRL = 0;
    this.lapStartingWearRR = 0;
    this.currentWearFL = 0;
    this.currentWearFR = 0;
    this.currentWearRL = 0;
    this.currentWearRR = 0;
    this.avgTireWear = 0;

    // Speed
    this.lapMaxSpeed = data.Speed;
    this.lapMinSpeed = data.Speed;

    // Position
    this.lapStartingPosition = data.RacePosition;
    this.laps = [];
  }

  /** Compilar dados da sessão */
  private wrapupSession(): void {
    if (this.laps.length === 0) {
      return;
    }

    this.lastSession = this.currentSession;
    //SessionService.persistSession(this.lastSession);
  }

  /** Atualizar timestamp de início da sessão */
  private setLocalSessionStartTime(data: DataPacket): void {
    if (! this.localSessionStartTime) {
      this.localSessionStartTime = data.SessionTimeMS;
    }
  }

  /** Atualizar dados relacionas a volta */
  private updateLap(data: DataPacket): void {
    this.currentLapTime = data.CurrentLap;

    if (data.LapNumber > this.currentLap) {
      this.wrapupLap(data);
    }

    this.currentLap = data.LapNumber;
    this.currentLapTime = data.CurrentLap;
    this.lastLapTime = data.LastLap;

    this.lapCurrentDistance = data.DistanceTraveled - this.lapStartingDistance;

    this.lapData.push({
      ...data,
      LapStartingDistance: this.lapStartingDistance,
      CurrentLapDistance: this.lapCurrentDistance
    });
  }

  /** Compilar dados da ultima volta e preparar dados para nova volta iniciada */
  private async wrapupLap(data: DataPacket): Promise<void> {
    if (this.laps.length === 0) {
      const { id } = await SessionModel.create({
        trackOrdinal: this.currentTrackOrdinal,
        carOrdinal: this.currentCarOrdinal,
      });

      this.sessionId = id;
    }

    const lap: Lap = {
      SessionId: this.sessionId,
      Number: this.currentLap,
      Time: data.LastLap,
      IsBestAtTime: data.LastLap === data.BestLap,
      DeltaDistance: data.DistanceTraveled - this.lapStartingDistance,
      DeltaFuel: data.Fuel - this.lapStartingFuel,
      MaxSpeed: this.lapMaxSpeed,
      MinSpeed: this.lapMinSpeed,
      PositionChanges: this.lapStartingPosition - data.RacePosition,
      DeltaWearFL: this.lapStartingWearFL - data.TireWearFrontLeft,
      DeltaWearFR: this.lapStartingWearFR - data.TireWearFrontRight,
      DeltaWearRL: this.lapStartingWearRL - data.TireWearRearLeft,
      DeltaWearRR: this.lapStartingWearRR - data.TireWearRearRight,
      AvgWear: MathHelper.getAverage([
        this.lapStartingWearFL - data.TireWearFrontLeft,
        this.lapStartingWearFR - data.TireWearFrontRight,
        this.lapStartingWearRL - data.TireWearRearLeft,
        this.lapStartingWearRR - data.TireWearRearRight,
      ]),
      Data: this.lapData
    };

    this.laps.push(lap);

    this.currentLap = data.LapNumber;
    this.lastLapTime = data.LastLap;
    this.lapStartingDistance = data.DistanceTraveled;
    this.lapStartingFuel = data.Fuel;
    this.lapStartingWearFL = data.TireWearFrontLeft;
    this.lapStartingWearFR = data.TireWearFrontRight;
    this.lapStartingWearRL = data.TireWearRearLeft;
    this.lapStartingWearRR = data.TireWearFrontRight;
    this.lapMaxSpeed = data.Speed;
    this.lapMinSpeed = data.Speed;
    this.bestLapTime = data.BestLap;
    this.lapStartingPosition = data.RacePosition;
    this.lapData = [];

    // Update Averages
    this.avgLapTime = MathHelper.getAverage(this.laps.map((lap) => lap.Time));
    this.medianLapTime = MathHelper.getMedian(this.laps.map((lap) => lap.Time));
    this.avgFuelUsage = MathHelper.getAverage(this.laps.map((lap) => lap.DeltaFuel));
    this.avgTireWear = MathHelper.getAverage(this.laps.map((lap) => lap.AvgWear));

    // Persist
    SessionService.persistLap(this.currentSession, lap);
  }

  /** Atualizar estado de degradação dos pneus */
  private updateCurrentState(data: DataPacket): void {
    this.currentFuel = data.Fuel;
    this.currentWearFL = data.TireWearFrontLeft;
    this.currentWearFR = data.TireWearFrontRight;
    this.currentWearRL = data.TireWearRearLeft;
    this.currentWearRR = data.TireWearRearRight;

    if (data.Speed > this.lapMaxSpeed) {
      this.lapMaxSpeed = data.Speed;
    } else if (data.Speed < this.lapMinSpeed) {
      this.lapMinSpeed = data.Speed;
    }

  }

  /** Facilitador para publicação de dados */
  public export(): any|object {
    return {

      sessionId: this.sessionId > 0 ? `S${this.sessionId.toString().padStart(5, '0')}` : null,

      currentLap: this.currentLap + 1,
      currentSessionTime: this.currentSessionTime,
      localSessionStartTime: this.localSessionStartTime,

      // Ordinals
      currentTrackOrdinal: this.currentTrackOrdinal,
      currentCarOrdinal: this.currentCarOrdinal,

      // Lap Times
      currentLapTime: this.currentLapTime,
      lastLapTime: this.lastLapTime,
      bestLapTime: this.bestLapTime,
      avgLapTime: this.avgLapTime,

      // Distances
      lapStartingDistance: this.lapStartingDistance,
      lapCurrentDistance: this.lapCurrentDistance,

      // Fuel
      lapStartingFuel: this.lapStartingFuel,
      currentFuel: this.currentFuel,
      avgFuelUsage: this.avgFuelUsage,

      // Wear
      lapStartingWearFL: this.lapStartingWearFL,
      lapStartingWearFR: this.lapStartingWearFR,
      lapStartingWearRL: this.lapStartingWearRL,
      lapStartingWearRR: this.lapStartingWearRR,
      currentWearFL: this.currentWearFL,
      currentWearFR: this.currentWearFR,
      currentWearRL: this.currentWearRL,
      currentWearRR: this.currentWearRR,
      avgTireWear: this.avgTireWear,

      // Speeed
      lapMaxSpeed: this.lapMaxSpeed,
      lapMinSpeed: this.lapMinSpeed,

      // Position
      lapStartingPosition: this.lapStartingPosition,

      // Extras
      laps: this.laps,
      lastSession: this.lastSession,
      last_packet: this.last_packet,
    };
  }

  get currentSession(): Session {
    return {
      ID: this.sessionId,
      LapCount: this.laps.length,
      CarOrdinal: this.currentCarOrdinal,
      TrackOrdinal: this.currentTrackOrdinal,
      AvgLapTime: this.avgLapTime,
      MedianLapTime: this.medianLapTime,
      BestLapTime: this.bestLapTime,
      FuelUsagePerLap: this.avgFuelUsage,
      TireWearPerLap: this.avgTireWear,
      Laps: this.laps
    };
  }
}

export default new SessionManager();
