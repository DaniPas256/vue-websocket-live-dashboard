"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSimulator = void 0;
const matchStore_1 = require("../data/matchStore");
const config_1 = require("../config");
class MatchSimulator {
    constructor() {
        this.intervalHandle = null;
        this.listeners = new Set();
    }
    start() {
        if (this.intervalHandle)
            return;
        this.intervalHandle = setInterval(() => {
            const update = this.generateRandomUpdate();
            if (!update)
                return;
            matchStore_1.matchStore.applyUpdate(update);
            this.listeners.forEach((listener) => listener(update));
        }, config_1.config.updateIntervalMs);
    }
    stop() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
    }
    onUpdate(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    generateRandomUpdate() {
        const all = matchStore_1.matchStore.getSnapshot();
        if (all.length === 0)
            return null;
        const match = all[Math.floor(Math.random() * all.length)];
        if (!match)
            return null;
        const update = { id: match.id };
        // Always advance time a bit
        update.time = Math.min(90, match.time + Math.floor(Math.random() * 3));
        // Occasionally change score
        if (Math.random() < 0.2) {
            const [home, away] = match.score
                .split(':')
                .map((n) => Number.parseInt(n, 10) || 0);
            const homeScored = Math.random() < 0.5;
            const newHome = homeScored ? home + 1 : home;
            const newAway = homeScored ? away : away + 1;
            update.score = `${newHome}:${newAway}`;
        }
        // Random odds fluctuation
        if (Math.random() < 0.8) {
            const delta = (Math.random() - 0.5) * 0.2;
            const raw = (match.odds ?? 1.5) + delta;
            update.odds = Number(Math.max(1.01, raw).toFixed(2));
        }
        return update;
    }
}
exports.matchSimulator = new MatchSimulator();
//# sourceMappingURL=matchSimulator.js.map