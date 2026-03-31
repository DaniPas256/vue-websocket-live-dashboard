import { defineStore } from 'pinia';
import type { Match, MatchUpdate, SortKey } from '../types/match';
import { fetchMatches } from '../services/api/matchesApi';

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface Filters {
  search: string;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
}

interface State {
  entities: Record<string, Match>;
  ids: string[];
  filters: Filters;
  status: Status;
  errorMessage: string | null;
  recentlyUpdatedIds: Set<string>;
}

export const useMatchesStore = defineStore('matches', {
  state: (): State => ({
    entities: {},
    ids: [],
    filters: {
      search: '',
      sortKey: 'time',
      sortDir: 'desc',
    },
    status: 'idle',
    errorMessage: null,
    recentlyUpdatedIds: new Set<string>(),
  }),
  getters: {
    allMatches(state): Match[] {
      const items = state.ids.map((id) => state.entities[id]).filter(Boolean) as Match[];
      const search = state.filters.search.trim().toLowerCase();
      const filtered = search
        ? items.filter((m) => m.name.toLowerCase().includes(search))
        : items;

      const sorted = [...filtered].sort((a, b) => {
        const { sortKey, sortDir } = state.filters;
        let aVal: number | string = a[sortKey];
        let bVal: number | string = b[sortKey];

        if (sortKey === 'score') {
          const [ah, aa] = a.score.split(':').map((x) => Number.parseInt(x, 10) || 0);
          const [bh, ba] = b.score.split(':').map((x) => Number.parseInt(x, 10) || 0);
          aVal = ah + aa;
          bVal = bh + ba;
        }

        const dir = sortDir === 'asc' ? 1 : -1;
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });

      return sorted;
    },
  },
  actions: {
    async loadInitial() {
      if (this.status === 'loading') return;
      this.status = 'loading';
      this.errorMessage = null;
      try {
        const matches = await fetchMatches();
        const entities: Record<string, Match> = {};
        const ids: string[] = [];
        matches.forEach((m) => {
          entities[m.id] = m;
          ids.push(m.id);
        });
        this.entities = entities;
        this.ids = ids;
        this.status = 'ready';
      } catch (err) {
        this.status = 'error';
        this.errorMessage = 'Failed to load matches.';
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    applyUpdate(update: MatchUpdate) {
      const current = this.entities[update.id];
      if (!current) return;
      const updated: Match = {
        ...current,
        ...update,
        lastUpdatedAt: Date.now(),
      };
      this.entities[update.id] = updated;
      this.recentlyUpdatedIds.add(update.id);
      window.setTimeout(() => {
        this.recentlyUpdatedIds.delete(update.id);
      }, 500);
    },
    setSearch(search: string) {
      this.filters.search = search;
    },
    setSortKey(sortKey: SortKey) {
      this.filters.sortKey = sortKey;
    },
    setSortDir(dir: 'asc' | 'desc') {
      this.filters.sortDir = dir;
    },
  },
});

