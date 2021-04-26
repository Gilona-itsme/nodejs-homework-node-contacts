const mongoose = require('mongoose');
require('dotenv').config();

const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose  error: ${err.message}`);
});

mongoose.connection.on('disconnected', err => {
  console.log(`Mongoose  disconnected: ${err.message}`);
});

process.on('SIGINT', async err => {
  mongoose.connection.close(() => {
    client.close();
    console.log(`Connection to DB closed and app terminated ${err.message}`);
    process.exit(1);
  });
});

module.exports = db;
