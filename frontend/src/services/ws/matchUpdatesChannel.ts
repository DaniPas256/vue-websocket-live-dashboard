import { useWebSocket } from './useWebSocket';
import type { MatchUpdate } from '../../types/match';
import { useMatchesStore } from '../../stores/matchesStore';
import { useConnectionStore } from '../../stores/connectionStore';

interface MatchUpdateEnvelope {
  type: string;
  payload: MatchUpdate;
}

export function useMatchUpdatesChannel() {
  const matchesStore = useMatchesStore();
  const connectionStore = useConnectionStore();

  const ws = useWebSocket('ws/matches', {
    reconnectIntervalMs: 2000,
    maxReconnectAttempts: 50,
  });

  ws.onMessage((message) => {
    const envelope = message as MatchUpdateEnvelope;
    if (envelope?.type === 'match-update' && envelope.payload) {
      matchesStore.applyUpdate(envelope.payload);
    }
  });

  const connect = () => {
    connectionStore.setStatus('connecting');
    ws.connect();
  };

  const disconnect = () => {
    ws.disconnect();
    connectionStore.setStatus('disconnected');
  };

  return {
    ...ws,
    connect,
    disconnect,
  };
}

