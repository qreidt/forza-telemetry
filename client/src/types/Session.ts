export type SessionState = {
    connected: boolean
    activeSession: ActiveSession|null
};

export type ActiveSession = {
    lastSession: number,
    currentSessionTime: number,
    localSessionStartTime: number,
    currentTrackOrdinal: string,
    currentCarOrdinal: string,
    currentLap: number,
    currentLapTime: number,
    lastLapTime: number,
    bestLapTime: number,
    avgLapTime: number,
    lapStartingDistance: number,
    lapCurrentDistance: number,
    lapStartingFuel: number,
    currentFuel: number,
    avgFuelUsage: number,
    lapStartingWearFL: number,
    lapStartingWearFR: number,
    lapStartingWearRL: number,
    lapStartingWearRR: number,
    currentWearFL: number,
    currentWearFR: number,
    currentWearRL: number,
    currentWearRR: number,
    avgTireWear: number,
    lapMaxSpeed: number,
    lapMinSpeed: number,
    lapStartingPosition: number,
    laps: Lap[],
};

export type Session = {
    lap_count: number,
    car_ordinal: number,
    track_ordinal: number,

    avg_lap_time: number,
    median_lap_time: number,
    best_lap_time: number,

    fuel_usage_per_lap: number,
    tire_degradation_per_lap: number,

    laps: Lap[]
};

export type Lap = {
    Number: number,
    Time: number,
    IsBestAtTime: boolean,
    IsAllTimeBest?: boolean,

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
    PositionChanges: number
};