const config = require('config');
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
  store: MongoStore.create({
    mongoUrl: config.mongoUrl,
    collectionName: config.dbSessionCollectionName,
    ttl: 60 * 60,
  }),
  secret: config.session_key,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, 
  },
});
