import {Lap} from "../types/Session";

export function addIsAllTimeBestLaptimeToLaps(laps: Lap[], best_lap_time: number): Lap[] {
    return laps.map((lap) => {
        lap.IsAllTimeBest = lap.Time === best_lap_time;
        return lap;
    });
}