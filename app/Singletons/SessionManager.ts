import {DataPacket} from "App/Services/DataPacketService";
import Logger from "@ioc:Adonis/Core/Logger";


class SessionManager {

  //private timeoutId: number;
  // @ts-ignore
  private worker: Promise<void>;
  private queue: DataPacket[] = [];

  public last_packet: DataPacket;

  constructor() {
    // @ts-ignore
    // this.timeoutId = setInterval(() => {
    //   const next = this.queue.pop();
    //   if (! next) {
    //     return;
    //   }
    //
    //   this.updateSession(next);
    // }, 100);

    this.worker = new Promise(async () => {
      while (true) {
        const next = this.queue.shift();
        if (! next) {
          await new Promise((r) => setTimeout(r, 1000))
          continue;
        }

        this.updateSession(next);
      }
    });

    Logger.info('Session Ingest Worket Setup.');
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
  //private sessionPackets: SessionPacket[] = [];
  public laps: Lap[] = [];

  // Session Time
  private currentSessionTime = 0;
  private localSessionStartTime: number|null = null;

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

  /** Atualizar dados da sessão com cada novo pacote */
  private updateSession(data: DataPacket): void {
    //console.log('called updateSession()');

    if (data.DistanceTraveled <= 0) {
      return;
    }

    this.checkSessionChanged(data);
    this.currentSessionTime = data.SessionTimeMS;

    this.setLocalSessionStartTime(data);

    this.updateLap(data);
    this.updateWear(data);

    this.last_packet = data;

    // this.sessionPackets.push({
    //   ...data,
    //   LapStartingDistance: this.lapStartingDistance,
    //   CurrentLapDistance: this.lapCurrentDistance
    // });
  }

  /** Verificar se foi iniciada uma nova sessão */
  private checkSessionChanged(data: DataPacket): void {
    //console.log('called checkSessionChanged()');
    if (
      data.SessionTimeMS < this.currentSessionTime
      || data.CarOrdinal !== this.currentCarOrdinal
      || data.TrackOrdinal !== this.currentTrackOrdinal
      || data.LapNumber < this.currentLap
    ) {
      return this.resetSession(data);
    }
  }

  /** Atualizar timestamp de início da sessão */
  private setLocalSessionStartTime(data: DataPacket): void {
    //console.log('called setLocalSessionStartTime()');
    if (! this.localSessionStartTime) {
      this.localSessionStartTime = data.SessionTimeMS;
    }
  }

  /** Resetar dados para uma nova sessão e compilar dados da sessão antiga */
  private resetSession(data: DataPacket): void {
    //console.log('called resetSession()');
    this.localSessionStartTime = null;
    this.currentLap = 0;
    this.currentTrackOrdinal = data.TrackOrdinal;
    this.currentCarOrdinal = data.CarOrdinal;
    this.currentLapTime = 0;
    this.lastLapTime = 0;
    this.lapStartingDistance = 0;
    this.lapCurrentDistance = 0;
    this.lapStartingFuel = 0;
    this.lapStartingWearFL = 0;
    this.lapStartingWearFR = 0;
    this.lapStartingWearRL = 0;
    this.lapStartingWearRR = 0;
    this.currentWearFL = 0;
    this.currentWearFR = 0;
    this.currentWearRL = 0;
    this.currentWearRR = 0;
    //
  }

  /** Atualizar dados relacionas a volta */
  private updateLap(data: DataPacket): void {
    //console.log('called updateLap()');
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
    //console.log('called wrapupLap()');
    console.log({
      SessionTimeMS: data.SessionTimeMS,
      LapNumber: data.LapNumber,
      CurrentLap: data.CurrentLap,
    });

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
  private updateWear(data: DataPacket): void
  {
    this.currentWearFL = data.TireWearFrontLeft;
    this.currentWearFR = data.TireWearFrontRight;
    this.currentWearRL = data.TireWearRearLeft;
    this.currentWearRR = data.TireWearRearRight;
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
