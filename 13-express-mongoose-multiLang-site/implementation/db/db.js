const mongoose = require('mongoose');
const config = require('config');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('MongoDB connected');
  } catch (err) {
    console.error("Error connected MongoDB", err);
    process.exit(1);
  }
}

module.exports = { connectDB };