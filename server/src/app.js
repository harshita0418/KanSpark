const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const connectToDB = require('../src/config/db');
connectToDB();
const app = express();

app.use(cors({
  origin: ['https://kanspark-ruddy.vercel.app', 'http://localhost:3000', 'http://c104tf3zqc3vhhm6j5uajocc.82.25.108.191.sslip.io'],
  credentials: true,
}));
app.use(express.json());
app.use(logger);

// Make io available to routes
app.set('io', null);

// Routes
const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const boardRoutes = require('./modules/board/board.routes');
const memberRoutes = require('./modules/member/member.routes');
const listRoutes = require('./modules/list/list.routes');
const cardRoutes = require('./modules/card/card.routes');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler);

module.exports = app;
