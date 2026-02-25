const mongoose = require('mongoose');
const colors = require('colors'); // make sure you have installed this: npm install colors

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bgBlack.bold);
  } catch (error) {
    console.error(`MongoDB Database Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
