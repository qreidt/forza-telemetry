import {reactive} from 'vue';
import { io } from 'socket.io-client';
import type {ActiveSession, SessionState} from "./types/Session";
//import sessionData from './data/mock-session-data.json'

export const state: SessionState = reactive({
    connected: false,
    activeSession: reactive(null)
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production"
    ? undefined
    : "ws://127.0.0.1:3333";

export const socket = io(URL);
// export const socket = {};

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});

socket.on('active-session', (data: ActiveSession) => {
    state.activeSession = data;
});