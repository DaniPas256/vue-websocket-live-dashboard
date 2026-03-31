import { MatchUpdate } from '../types/match';
import { matchStore } from '../data/matchStore';
import { config } from '../config';

export type MatchUpdateListener = (update: MatchUpdate) => void;

class MatchSimulator {
  private intervalHandle: NodeJS.Timeout | null = null;
  private listeners: Set<MatchUpdateListener> = new Set();

  start() {
    if (this.intervalHandle) return;
    this.intervalHandle = setInterval(() => {
      const update = this.generateRandomUpdate();
      if (!update) return;
      matchStore.applyUpdate(update);
      this.listeners.forEach((listener) => listener(update));
    }, config.updateIntervalMs);
  }

  stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  onUpdate(listener: MatchUpdateListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private generateRandomUpdate(): MatchUpdate | null {
    const all = matchStore.getSnapshot();
    if (all.length === 0) return null;
    const match = all[Math.floor(Math.random() * all.length)];
    if (!match) return null;

    const update: MatchUpdate = { id: match.id };

    // Always advance time a bit
    update.time = Math.min(90, match.time + Math.floor(Math.random() * 3));

    // Occasionally change score
    if (Math.random() < 0.2) {
      const [home, away] = match.score
        .split(':')
        .map((n) => Number.parseInt(n, 10) || 0) as [number, number];
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

export const matchSimulator = new MatchSimulator();

