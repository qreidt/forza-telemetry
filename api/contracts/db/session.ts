import { DataPacket } from "App/Services/DataPacketService";

export type Session = {
  ID: number,

  LapCount: number,
  CarOrdinal: string,
  TrackOrdinal: string,

  AvgLapTime: number|null,
  MedianLapTime: number|null,
  BestLapTime: number|null,

  FuelUsagePerLap: number|null,
  TireWearPerLap: number|null,

  Laps: Lap[]
};

export type Lap = {
  _id?: string,
  SessionId: number,

  Number: number,
  Time: number,
  IsBestAtTime: boolean,

  // Distance
  DeltaDistance: number,

  // Fuel
  DeltaFuel: number,

  MaxSpeed: number,
  MinSpeed: number,

  // Wear
  DeltaWearFL: number,
  DeltaWearFR: number,
  DeltaWearRL: number,
  DeltaWearRR: number,
  AvgWear: number,

  // Position
  PositionChanges: number,

  Data: SessionPacket[]
};

export type SessionPacket = DataPacket & {
  LapStartingDistance: number,
  CurrentLapDistance: number
};
