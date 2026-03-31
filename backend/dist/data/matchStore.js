"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchStore = void 0;
exports.createInitialMatches = createInitialMatches;
class MatchStore {
    constructor(initialMatches) {
        this.matches = new Map();
        const now = Date.now();
        initialMatches.forEach((m) => {
            this.matches.set(m.id, { ...m, lastUpdatedAt: m.lastUpdatedAt ?? now });
        });
    }
    getAll() {
        return Array.from(this.matches.values());
    }
    applyUpdate(update) {
        const current = this.matches.get(update.id);
        if (!current)
            return undefined;
        const updated = {
            ...current,
            ...update,
            lastUpdatedAt: Date.now(),
        };
        this.matches.set(updated.id, updated);
        return updated;
    }
    getSnapshot() {
        return this.getAll();
    }
}
function createInitialMatches(count = 20) {
    const matches = [];
    const now = Date.now();
    for (let i = 1; i <= count; i++) {
        matches.push({
            id: `match-${i}`,
            name: `Team ${String.fromCharCode(64 + i)} vs Team ${String.fromCharCode(64 + i + 1)}`,
            score: '0:0',
            time: Math.floor(Math.random() * 90),
            odds: Number((1 + Math.random() * 3).toFixed(2)),
            lastUpdatedAt: now,
        });
    }
    return matches;
}
exports.matchStore = new MatchStore(createInitialMatches());
//# sourceMappingURL=matchStore.js.map