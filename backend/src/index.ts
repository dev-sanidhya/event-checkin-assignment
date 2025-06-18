import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { typeDefs } from './types/schema';
import { resolvers } from './resolvers';
import { createContext } from './utils/context';

dotenv.config();

async function startServer() {
  const app = express();
  
  // Enable CORS for all routes
  app.use(cors({
    origin: '*',
    credentials: true
  }));

  const httpServer = createServer(app);
  
  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-event', (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`User ${socket.id} joined event ${eventId}`);
    });

    socket.on('leave-event', (eventId) => {
      socket.leave(`event-${eventId}`);
      console.log(`User ${socket.id} left event ${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext,
  });

  await server.start();
  server.applyMiddleware({ app: app as any, cors: false });

  const PORT = parseInt(process.env.PORT || '4000');

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
    console.log(`🔌 Socket.IO server ready at http://0.0.0.0:${PORT}`);
  });

  // Export io for use in resolvers if needed
  (global as any).io = io;
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});

