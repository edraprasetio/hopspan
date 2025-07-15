const { MongoClient } = require('mongodb');

const uri = 'mongodb://mongo:27017';
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  if (!db) {
    await client.connect();
    db = client.db('hopspan'); // Database name
    console.log('Connected to MongoDB');
  }
  return db;
}

module.exports = {connectToDB}