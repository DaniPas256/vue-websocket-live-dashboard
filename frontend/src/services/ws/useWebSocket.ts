import { ref, onUnmounted } from 'vue';
import { wsBaseUrl } from '../config';

interface UseWebSocketOptions {
  reconnectIntervalMs?: number;
  maxReconnectAttempts?: number;
}

type MessageHandler = (data: unknown) => void;

export function useWebSocket(url: string, options?: UseWebSocketOptions) {
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const lastError = ref<string | null>(null);
  const reconnectAttempts = ref(0);

  let socket: WebSocket | null = null;
  let messageHandler: MessageHandler | null = null;
  let reconnectTimeout: number | null = null;

  const reconnectIntervalMs = options?.reconnectIntervalMs ?? 2000;
  const maxReconnectAttempts = options?.maxReconnectAttempts ?? 10;

  const cleanup = () => {
    if (socket) {
      socket.onopen = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.onmessage = null;
      socket = null;
    }
    if (reconnectTimeout !== null) {
      window.clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

  const connect = () => {
    if (socket || isConnecting.value) return;

    isConnecting.value = true;
    lastError.value = null;

    const wsUrl =
      url.startsWith('ws://') || url.startsWith('wss://')
        ? url
        : wsBaseUrl
          ? `${wsBaseUrl}${url}`
          : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${url}`;

    console.log("Connecting to WebSocket at", wsUrl);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      isConnecting.value = false;
      isConnected.value = true;
      reconnectAttempts.value = 0;
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      
      isConnected.value = false;
      isConnecting.value = false;

      if (reconnectAttempts.value < maxReconnectAttempts) {
        reconnectAttempts.value += 1;
        reconnectTimeout = window.setTimeout(connect, reconnectIntervalMs);
      }
    };

    socket.onerror = (event) => {
      // eslint-disable-next-line no-console
      console.error('WebSocket error', event);
      lastError.value = 'WebSocket error';
    };

    socket.onmessage = (event) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        parsed = event.data;
      }
      if (messageHandler) {
        messageHandler(parsed);
      }
    };
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
    cleanup();
  };

  const send = (payload: unknown) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    socket.send(data);
  };

  const onMessage = (handler: MessageHandler) => {
    messageHandler = handler;
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    isConnecting,
    lastError,
    reconnectAttempts,
    connect,
    disconnect,
    send,
    onMessage,
  };
}

