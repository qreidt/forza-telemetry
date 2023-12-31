import {PersistedSession} from "../types/Session";

export const API_BASE_URL = 'http://127.0.0.1:3333';

export async function getAllPreviousSessions(): Promise<PersistedSession[]> {
    return (await fetch(`${API_BASE_URL}/sessions`)).json();
}