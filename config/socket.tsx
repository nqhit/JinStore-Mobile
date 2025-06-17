// src/socket.ts
import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('http://192.168.1.8:8888', {
  transports: ['websocket'],
  autoConnect: false,
});
