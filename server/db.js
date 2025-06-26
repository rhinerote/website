// server/db.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

module.exports = async () => {
  await client.connect();
  // якщо в URI уже вказана БД ─ цей рядок просто поверне її
  const db = client.db('techsolutions');
  return db.collection('messages');
};
