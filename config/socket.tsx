// src/socket.ts
import { API_BASE_URL } from '@/config/config';
import { io } from 'socket.io-client';

const socket = io(API_BASE_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true,
});

export default socket;
