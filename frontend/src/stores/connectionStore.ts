import { defineStore } from 'pinia';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    status: 'idle' as ConnectionStatus,
  }),
  actions: {
    setStatus(status: ConnectionStatus) {
      this.status = status;
    },
  },
});

