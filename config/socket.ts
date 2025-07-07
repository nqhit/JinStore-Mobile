// src/socket.ts
import { API_URL } from '@/constants/env';
import { io } from 'socket.io-client';

const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true,
});

export default socket;
