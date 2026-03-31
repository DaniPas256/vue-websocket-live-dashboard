export interface Match {
    id: string;
    name: string;
    score: string;
    time: number;
    odds: number;
    lastUpdatedAt: number;
}
export type MatchUpdate = Partial<Omit<Match, 'lastUpdatedAt'>> & {
    id: string;
};
//# sourceMappingURL=match.d.ts.map