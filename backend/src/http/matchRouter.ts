import { Router } from 'express';
import { matchStore } from '../data/matchStore';

export const matchRouter = Router();

matchRouter.get('/matches', (_req, res) => {
  try {
    const matches = matchStore.getAll();
    res.json({ data: matches });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to get matches', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

