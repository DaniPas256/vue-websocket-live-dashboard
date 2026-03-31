import { MatchUpdate } from '../types/match';
export type MatchUpdateListener = (update: MatchUpdate) => void;
declare class MatchSimulator {
    private intervalHandle;
    private listeners;
    start(): void;
    stop(): void;
    onUpdate(listener: MatchUpdateListener): () => boolean;
    private generateRandomUpdate;
}
export declare const matchSimulator: MatchSimulator;
export {};
//# sourceMappingURL=matchSimulator.d.ts.map