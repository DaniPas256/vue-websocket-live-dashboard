"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchSimulator_1 = require("./matchSimulator");
const matchStore_1 = require("../data/matchStore");
describe('matchSimulator', () => {
    it('updates matches over time', () => {
        const initial = (0, matchStore_1.createInitialMatches)(5);
        expect(initial.length).toBeGreaterThan(0);
        matchSimulator_1.matchSimulator.start();
        matchSimulator_1.matchSimulator.stop();
        const snapshot = matchStore_1.matchStore.getSnapshot();
        expect(snapshot.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=matchSimulator.test.js.map