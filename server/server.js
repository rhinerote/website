const express = require('express');
const cors = require('cors');
const connect = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// CREATE
app.post('/api/messages', async (req, res) => {
  const data = req.body;
  const collection = await connect();
  const result = await collection.insertOne(data);
  res.status(201).json(result);
});

// READ
app.get('/api/messages', async (req, res) => {
  const collection = await connect();
  const messages = await collection.find().toArray();
  res.json(messages);
});

// UPDATE
app.put('/api/messages/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const id = new ObjectId(req.params.id);
  const collection = await connect();
  await collection.updateOne({ _id: id }, { $set: req.body });
  res.sendStatus(200);
});

// DELETE
app.delete('/api/messages/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const id = new ObjectId(req.params.id);
  const collection = await connect();
  await collection.deleteOne({ _id: id });
  res.sendStatus(204);
});

// CREATE demo request
app.post('/api/demo', async (req, res) => {
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    const collection = client.db('techsolutions').collection('demo_requests');
    const result = await collection.insertOne({ ...req.body, createdAt: new Date() });
    res.status(201).json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error('Demo request error:', err);
    res.status(500).json({ ok: false, error: 'Could not save request' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
