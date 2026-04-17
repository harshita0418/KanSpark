require('dotenv').config();
const http = require("http");
const app = require('./src/app');

const { setupSocketServer } = require("./src/realtime/socket");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = setupSocketServer(server, app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});