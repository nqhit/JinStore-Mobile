// src/socket.ts
import { API_URL_V } from '@/constants/env';
import { io } from 'socket.io-client';

const socket = io(API_URL_V, {
  transports: ['polling', 'websocket'],
  withCredentials: true,
  secure: true,
  reconnection: true,
  timeout: 10000,
});

export default socket;
