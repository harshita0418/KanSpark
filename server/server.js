require('dotenv').config();
const http = require("http");
const app = require('./src/app');
const connectToDB = require('./src/config/db');
const { setupSocketServer } = require("./src/realtime/socket");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

connectToDB()
setupSocketServer(server, app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.set('io', io);

setupSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});