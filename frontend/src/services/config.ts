const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL ?? '';

export const apiBaseUrl = API_BASE || 'https://live-dashboard-hgpe.onrender.com';
export const wsBaseUrl = WS_BASE || 'wss://live-dashboard-hgpe.onrender.com';

