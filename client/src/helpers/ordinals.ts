import cars from "../data/cars.json";
import tracks from "../data/tracks.json";
import type {Car, Track} from "../types/Ordinals";

export function getCarFromOrdinal(ordinal: string|null): Car {
    if (! ordinal || ordinal === '') {
        return {
            Ordinal: '',
            Year: '',
            Make: '',
            Model: '',
        };
    }

    return cars.find((track) => track.Ordinal === ordinal)
        ?? {
            Ordinal: '',
            Year: '',
            Make: '',
            Model: '',
        };
}

export function getTrackFromOrdinal(ordinal: string|null): Track {
    if (! ordinal || ordinal === '') {
        return {
            Circuit: '',
            IOCCode: '',
            Length: '',
            Location: '',
            Track: '',
            Ordinal: ''
        };
    }

    return tracks.find((track) => track.Ordinal === ordinal)
        ?? {
            Circuit: '',
            IOCCode: '',
            Length: '',
            Location: '',
            Track: '',
            Ordinal: ''
        };
}

export function getFullTrackNameFromOrdinal(ordinal: string|null): string {
    const track = getTrackFromOrdinal(ordinal);

    if (track.Circuit === '') {
        return '-';
    }

    return `${track.Circuit} - ${track.Track}`;
}

export function getFullCarNameFromOrdinal(ordinal: string|null): string {
    const car = getCarFromOrdinal(ordinal);

    if (car.Model === '') {
        return '-';
    }

    return `${car.Year} ${car.Make} ${car.Model}`;
}