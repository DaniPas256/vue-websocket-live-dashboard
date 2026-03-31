import { Match, MatchUpdate } from '../types/match';

class MatchStore {
  private matches: Map<string, Match> = new Map();

  constructor(initialMatches: Match[]) {
    const now = Date.now();
    initialMatches.forEach((m) => {
      this.matches.set(m.id, { ...m, lastUpdatedAt: m.lastUpdatedAt ?? now });
    });
  }

  getAll(): Match[] {
    return Array.from(this.matches.values());
  }

  applyUpdate(update: MatchUpdate): Match | undefined {
    const current = this.matches.get(update.id);
    if (!current) return undefined;
    const updated: Match = {
      ...current,
      ...update,
      lastUpdatedAt: Date.now(),
    };
    this.matches.set(updated.id, updated);
    return updated;
  }

  getSnapshot(): Match[] {
    return this.getAll();
  }
}

export function createInitialMatches(count = 20): Match[] {
  const matches: Match[] = [];
  const now = Date.now();
  for (let i = 1; i <= count; i++) {
    matches.push({
      id: `match-${i}`,
      name: `Team ${String.fromCharCode(64 + i)} vs Team ${String.fromCharCode(
        64 + i + 1,
      )}`,
      score: '0:0',
      time: Math.floor(Math.random() * 90),
      odds: Number((1 + Math.random() * 3).toFixed(2)),
      lastUpdatedAt: now,
    });
  }
  return matches;
}

export const matchStore = new MatchStore(createInitialMatches());

