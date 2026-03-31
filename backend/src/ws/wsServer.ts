import type { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../config';
import { MatchUpdate } from '../types/match';
import { matchSimulator } from '../services/matchSimulator';

export function createWsServer(httpServer: HttpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: config.wsPath });

  wss.on('connection', (socket: WebSocket) => {
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

  const broadcastUpdate = (update: MatchUpdate) => {
    const payload = JSON.stringify({ type: 'match-update', payload: update });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  matchSimulator.onUpdate(broadcastUpdate);
  matchSimulator.start();

  return wss;
}

