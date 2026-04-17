require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectToDB = require('./src/config/db');
const { setupSocketHandlers } = require('./src/socket/socketHandler');
const PORT = process.env.PORT || 5000;

console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

connectToDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

setupSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});