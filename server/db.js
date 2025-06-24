const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  const db = client.db('techsolutions');
  const collection = db.collection('messages');
  return collection;
}

module.exports = connect;
