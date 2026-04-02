const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(logger);


// Routes
const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const boardRoutes = require('./modules/board/board.routes');
const memberRoutes = require('./modules/member/member.routes');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/members', memberRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler);

module.exports = app;
