"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    httpPort: Number(process.env.PORT) || 4000,
    wsPath: '/ws/matches',
    updateIntervalMs: 1000,
};
//# sourceMappingURL=config.js.map