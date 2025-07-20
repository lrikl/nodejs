const { MongoClient } = require("mongodb");
const config = require('config');

const client = new MongoClient(config.mongoUrl);

async function connectDB() {
  try {
    await client.connect();
    const db = client.db(config.dbName);
    console.log('MongoDB connected');
    
    return {
      usersCollection: db.collection('users'),
      articlesCollection: db.collection('articles'),
    };
  } catch (err) {
    console.error("Error connected MongoDB", err);
    process.exit(1);
  }
}

module.exports = { 
  connectDB, 
  "mongoUrl": config.mongoUrl
};