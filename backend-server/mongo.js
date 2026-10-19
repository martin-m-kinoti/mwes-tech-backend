const mongoose = require('mongoose');

// Vercel reuses the same process across warm invocations, so the connection is
// cached globally; handlers await it instead of connecting at import time.
let cached = global.__mwestechMongo || { conn: null, promise: null };
global.__mwestechMongo = cached;

async function connectToMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then((conn) => {
        cached.conn = conn;
        console.log('Connected to MongoDB (chat)');
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  return cached.promise;
}

module.exports = { mongoose, connectToMongo };
