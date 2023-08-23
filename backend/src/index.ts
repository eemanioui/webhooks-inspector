import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { seedDB } from './db/mongo/seed';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.set('io', io);

server.listen(config.PORT, () => {
  console.log(`WebhookInspector backend running on ${config.PORT}`);

  mongoose
    .connect(config.MONGO_URL || '')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .then(() => seedDB())
    .catch(error => {
      console.error('Error connecting to MongoDB:', error);
    });
});
