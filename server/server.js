require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/db');
const PORT = process.env.PORT || 5000;

console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

connectToDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
