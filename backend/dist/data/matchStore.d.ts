import { Match, MatchUpdate } from '../types/match';
declare class MatchStore {
    private matches;
    constructor(initialMatches: Match[]);
    getAll(): Match[];
    applyUpdate(update: MatchUpdate): Match | undefined;
    getSnapshot(): Match[];
}
export declare function createInitialMatches(count?: number): Match[];
export declare const matchStore: MatchStore;
export {};
//# sourceMappingURL=matchStore.d.ts.map