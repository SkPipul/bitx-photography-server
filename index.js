const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors ())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zgj4c3m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const photographyCollection = client.db('bitx').collection('photography');

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = photographyCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })


        app.get('/allServices', async(req, res) => {
            const query = {};
            const cursor = photographyCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/allServices', async(req, res) => {
            const service = req.body;
            const result = await photographyCollection.insertOne(service);
            res.send(result);
        })

        app.get('/allServices/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await photographyCollection.findOne(query);
            res.send(service)
        })

    }
    finally{

    }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Bitx photography server is running')
})

app.listen(port, () => {
    console.log(`Bitx server is running on ${port}`);
})