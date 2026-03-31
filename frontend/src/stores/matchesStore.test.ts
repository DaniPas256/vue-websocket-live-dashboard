import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useMatchesStore } from './matchesStore';
import type { Match } from '../types/match';

describe('matchesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('normalizes initial matches and sorts by time desc by default', () => {
    const store = useMatchesStore();
    const now = Date.now();
    const matches: Match[] = [
      { id: 'a', name: 'A vs B', score: '0:0', time: 10, odds: 1.5, lastUpdatedAt: now },
      { id: 'b', name: 'C vs D', score: '1:0', time: 70, odds: 2.1, lastUpdatedAt: now },
    ];
    (store as any).entities = {
      a: matches[0],
      b: matches[1],
    };
    (store as any).ids = ['a', 'b'];

    const ordered = store.allMatches;
    expect(ordered[0].id).toBe('b');
  });

  it('applyUpdate patches only changed fields and tracks highlights', () => {
    const store = useMatchesStore();
    const now = Date.now();
    const base: Match = {
      id: 'a',
      name: 'A vs B',
      score: '0:0',
      time: 10,
      odds: 1.5,
      lastUpdatedAt: now,
    };
    (store as any).entities = { a: base };
    (store as any).ids = ['a'];

    store.applyUpdate({ id: 'a', score: '1:0' });
    const updated = store.entities.a;
    expect(updated.score).toBe('1:0');
    expect(store.recentlyUpdatedIds.has('a')).toBe(true);
  });
});

