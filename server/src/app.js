const express = require('express');
const logger = require('./middleware/logger');

const app = express();

app.use(express.json());
app.use(logger);


// Routes
const userRoutes = require('./modules/user/user.routes');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
