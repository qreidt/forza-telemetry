import {DataPacket} from "App/Services/DataPacketService";
import Logger from "@ioc:Adonis/Core/Logger";
import Websocket from "App/Sockets/Websocket";


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
      Websocket.io.emit('active-session', {
        currentTrackOrdinal: this.currentTrackOrdinal,
        currentCarOrdinal: this.currentCarOrdinal,
        currentLap: this.currentLap + 1,
        currentLapTime: this.currentLapTime,
        lastLapTime: this.lastLapTime,
        lapStartingDistance: this.lapStartingDistance,
        lapCurrentDistance: this.lapCurrentDistance,
        lapStartingFuel: this.lapStartingFuel,
        lapStartingWearFL: this.lapStartingWearFL,
        lapStartingWearFR: this.lapStartingWearFR,
        lapStartingWearRL: this.lapStartingWearRL,
        lapStartingWearRR: this.lapStartingWearRR,
        currentWearFL: this.currentWearFL,
        currentWearFR: this.currentWearFR,
        currentWearRL: this.currentWearRL,
        currentWearRR: this.currentWearRR,
        laps: this.laps
      });
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
  private sessionData: SessionPacket[] = [];
  public laps: Lap[] = [];

  // Session Time
  public currentSessionTime = 0;
  public localSessionStartTime: number|null = null;

  // Ordinals
  public currentTrackOrdinal: number|null = 0;
  public currentCarOrdinal: number|null = 0;

  // Lap Number and Times
  public currentLap: number = 0;
  public currentLapTime: number = 0;
  public lastLapTime: number;

  // Distance
  public lapStartingDistance: number = 0;
  public lapCurrentDistance: number = 0;

  // Fuel
  public lapStartingFuel: number = 0;

  // Wear
  public lapStartingWearFL: number = 0;
  public lapStartingWearFR: number = 0;
  public lapStartingWearRL: number = 0;
  public lapStartingWearRR: number = 0;
  public currentWearFL: number = 0;
  public currentWearFR: number = 0;
  public currentWearRL: number = 0;
  public currentWearRR: number = 0;

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
    this.updateWear(data);

    this.last_packet = data;

    this.sessionData.push({
      ...data,
      LapStartingDistance: this.lapStartingDistance,
      CurrentLapDistance: this.lapCurrentDistance
    });
  }

  /** Verificar se foi iniciada uma nova sessão */
  private checkSessionChanged(data: DataPacket): boolean {
    if (
      data.SessionTimeMS < this.currentSessionTime
      || data.CarOrdinal !== this.currentCarOrdinal
      || data.TrackOrdinal !== this.currentTrackOrdinal
      || data.LapNumber < this.currentLap
      || data.DistanceTraveled < this.lapStartingDistance
    ) {
      this.resetSession(data);
      return true;
    }

    return false;
  }

  /** Resetar dados para uma nova sessão e compilar dados da sessão antiga */
  private resetSession(data: DataPacket): void {
    this.localSessionStartTime = null;
    this.currentLap = 0;
    this.currentTrackOrdinal = data.TrackOrdinal;
    this.currentCarOrdinal = data.CarOrdinal;
    this.currentLapTime = 0;
    this.lastLapTime = 0;
    this.lapStartingDistance = 0;
    this.lapCurrentDistance = 0;
    this.lapStartingFuel = data.Fuel;
    this.lapStartingWearFL = 0;
    this.lapStartingWearFR = 0;
    this.lapStartingWearRL = 0;
    this.lapStartingWearRR = 0;
    this.currentWearFL = 0;
    this.currentWearFR = 0;
    this.currentWearRL = 0;
    this.currentWearRR = 0;
    this.laps = [];
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
  }

  /** Compilar dados da ultima volta e preparar dados para nova volta iniciada */
  private wrapupLap(data: DataPacket): void {

    this.laps.push({
      Number: this.currentLap + 1,
      Time: data.LastLap,
      IsBestAtTime: data.LastLap === data.BestLap,
      DeltaDistance: data.DistanceTraveled - this.lapStartingDistance,
      DeltaFuel: data.Fuel - this.lapStartingFuel,
      DeltaWearFL: this.lapStartingWearFL - data.TireWearFrontLeft,
      DeltaWearFR: this.lapStartingWearFR - data.TireWearFrontRight,
      DeltaWearRL: this.lapStartingWearRL - data.TireWearRearLeft,
      DeltaWearRR: this.lapStartingWearRR - data.TireWearRearRight
    });

    this.currentLap = data.LapNumber;
    this.lastLapTime = data.LastLap;
    this.lapStartingDistance = data.DistanceTraveled;
    this.lapStartingFuel = data.Fuel;
    this.lapStartingWearFL = data.TireWearFrontLeft;
    this.lapStartingWearFR = data.TireWearFrontRight;
    this.lapStartingWearRL = data.TireWearRearLeft;
    this.lapStartingWearRR = data.TireWearFrontRight;
  }

  /** Atualizar estado de degradação dos pneus */
  private updateWear(data: DataPacket): void {
    this.currentWearFL = data.TireWearFrontLeft;
    this.currentWearFR = data.TireWearFrontRight;
    this.currentWearRL = data.TireWearRearLeft;
    this.currentWearRR = data.TireWearRearRight;
  }

  /** Facilitador para publicação de dados */
  public export(): any|object {
    return {
      lastSession: this.lastSession,
      currentSessionTime: this.currentSessionTime,
      localSessionStartTime: this.localSessionStartTime,
      currentTrackOrdinal: this.currentTrackOrdinal,
      currentCarOrdinal: this.currentCarOrdinal,
      currentLap: this.currentLap,
      currentLapTime: this.currentLapTime,
      lastLapTime: this.lastLapTime,
      lapStartingDistance: this.lapStartingDistance,
      lapCurrentDistance: this.lapCurrentDistance,
      lapStartingFuel: this.lapStartingFuel,
      lapStartingWearFL: this.lapStartingWearFL,
      lapStartingWearFR: this.lapStartingWearFR,
      lapStartingWearRL: this.lapStartingWearRL,
      lapStartingWearRR: this.lapStartingWearRR,
      currentWearFL: this.currentWearFL,
      currentWearFR: this.currentWearFR,
      currentWearRL: this.currentWearRL,
      currentWearRR: this.currentWearRR,
      laps: this.laps,
      last_packet: this.last_packet,
    };
  }
}

type Session = {
  lap_count: number,
  car_ordinal: number,
  track_ordinal: number,

  avg_lap_time: number,
  mean_lap_time: number,
  best_lap_time: number,

  laps: Lap[]
};

// @ts-ignore
type SessionPacket = DataPacket & {
  LapStartingDistance: number,
  CurrentLapDistance: number
};

type Lap = {
  Number: number,
  Time: number,
  IsBestAtTime: boolean,

  // Distance
  DeltaDistance: number,

  // Fuel
  DeltaFuel: number,

  // Wear
  DeltaWearFL: number,
  DeltaWearFR: number,
  DeltaWearRL: number,
  DeltaWearRR: number,
};

export default new SessionManager();
