"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWsServer = createWsServer;
const ws_1 = require("ws");
const config_1 = require("../config");
const matchSimulator_1 = require("../services/matchSimulator");
function createWsServer(httpServer) {
    const wss = new ws_1.WebSocketServer({ server: httpServer, path: config_1.config.wsPath });
    wss.on('connection', (socket) => {
        // eslint-disable-next-line no-console
        console.log('Client connected to WebSocket');
        socket.on('close', () => {
            // eslint-disable-next-line no-console
            console.log('Client disconnected from WebSocket');
        });
        socket.on('error', (err) => {
            // eslint-disable-next-line no-console
            console.error('WebSocket error', err);
        });
    });
    const broadcastUpdate = (update) => {
        const payload = JSON.stringify({ type: 'match-update', payload: update });
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
            }
        });
    };
    matchSimulator_1.matchSimulator.onUpdate(broadcastUpdate);
    matchSimulator_1.matchSimulator.start();
    return wss;
}
//# sourceMappingURL=wsServer.js.map