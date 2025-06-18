import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000', {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const joinEventRoom = (eventId: string) => {
  socket.emit('join-event', eventId);
};

export const leaveEventRoom = (eventId: string) => {
  socket.emit('leave-event', eventId);
};

