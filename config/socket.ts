// src/socket.ts
import { api_url } from '@/config';
import { io } from 'socket.io-client';

const socket = io(api_url, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true,
});

export default socket;
