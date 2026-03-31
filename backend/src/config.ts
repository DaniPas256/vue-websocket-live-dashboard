export const config = {
  httpPort: Number(process.env.PORT) || 4000,
  wsPath: '/ws/matches',
  updateIntervalMs: 1000,
};

