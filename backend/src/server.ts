import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from './config';
import { matchRouter } from './http/matchRouter';
import { createWsServer } from './ws/wsServer';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', matchRouter);

const httpServer = http.createServer(app);

createWsServer(httpServer);

httpServer.listen(config.httpPort, () => {
  // eslint-disable-next-line no-console
  console.log(`HTTP server listening on port ${config.httpPort}`);
});

