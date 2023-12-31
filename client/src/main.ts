import { createApp } from 'vue';
import './assets/tailwind.css';
import {createRouter, createWebHistory} from 'vue-router';
import App from './App.vue';
import DashboardPage from "./pages/Dashboard/DashboardPage.vue";
import PreviousSessionsPage from "./pages/PreviousSessions/PreviousSessionsPage.vue";
import SessionPage from "./pages/PreviousSessions/Session/SessionPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Live
        { path: '/', name: 'Live', component: DashboardPage },

        // Previous Sessions
        { path: '/sessions', name: 'PreviousSessions', component: PreviousSessionsPage },

        // Session
        { path: '/sessions/:session_id', name: 'Session', component: SessionPage }
    ],
});

createApp(App)
    .use(router)
    .mount('#app');
