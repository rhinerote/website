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

app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
