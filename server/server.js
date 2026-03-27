require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
