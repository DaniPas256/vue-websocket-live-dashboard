const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL ?? '';

export const apiBaseUrl = API_BASE || '';
export const wsBaseUrl = WS_BASE || '';

