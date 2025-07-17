// src/socket.ts
import { API_URL } from '@/constants/env';
import { io } from 'socket.io-client';

const socket = io(API_URL, {
  transports: ['websocket'],
  secure: true,
  reconnection: true,
  timeout: 10000,
});

export default socket;
