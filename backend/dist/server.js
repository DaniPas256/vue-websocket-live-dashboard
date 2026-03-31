"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const matchRouter_1 = require("./http/matchRouter");
const wsServer_1 = require("./ws/wsServer");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', matchRouter_1.matchRouter);
const httpServer = http_1.default.createServer(app);
(0, wsServer_1.createWsServer)(httpServer);
httpServer.listen(config_1.config.httpPort, () => {
    // eslint-disable-next-line no-console
    console.log(`HTTP server listening on port ${config_1.config.httpPort}`);
});
//# sourceMappingURL=server.js.map