// server/db.js
const { MongoClient } = require('mongodb');

// бере URI з змінної середовища, а локально — з файла .env
const uri = process.env.MONGODB_URI;         

const client = new MongoClient(uri, { serverApi: { version: '1', strict: true } });

module.exports = async () => {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db().collection('messages'); // ← techsolutions з URI
};
