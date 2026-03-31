"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRouter = void 0;
const express_1 = require("express");
const matchStore_1 = require("../data/matchStore");
exports.matchRouter = (0, express_1.Router)();
exports.matchRouter.get('/matches', (_req, res) => {
    try {
        const matches = matchStore_1.matchStore.getAll();
        res.json({ data: matches });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to get matches', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=matchRouter.js.map