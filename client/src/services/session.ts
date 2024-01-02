import {Lap, PersistedSession} from "../types/Session";

export const API_BASE_URL = 'http://127.0.0.1:3333';
const DEFAULT_PROJECTION = [
    'Speed', 'CurrentLapDistance',
    'Accel', 'Brake', 'Steer',
];

export async function getAllPreviousSessions(): Promise<PersistedSession[]> {
    return (await fetch(`${API_BASE_URL}/sessions`)).json();
}

export async function getSession(session_id: number): Promise<PersistedSession> {
    const url = new URL(`${API_BASE_URL}/sessions/${session_id}`);
    return (await fetch(url.toString())).json();
}

export async function loadLapTelemetry(session_id: number, lap_ids: string[]): Promise<Lap[]> {
    const url = new URL(`${API_BASE_URL}/sessions/${session_id}/telemetry`);

    for (let lap_id of lap_ids) {
        url.searchParams.append('load[]', lap_id);
    }

    for (let projection of DEFAULT_PROJECTION) {
        url.searchParams.append(`projection[]`, projection);
    }

    return (await fetch(url.toString())).json()
}