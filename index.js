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
        const reviewCollection = client.db('bitx').collection('review')

        // getting limited data 
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = photographyCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        // all services api
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

        // get the specific data by id from allServices
        app.get('/allServices/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await photographyCollection.findOne(query);
            res.send(service)
        })

        // getting all of the reviews
        app.get('/allReviews', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('allReviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const update = await reviewCollection.findOne(query)
            res.send(update);
        })

        // get the details review
        app.get('/reviewsById', async(req, res) => {
            const id = req.query.id;
            const query = {serviceId : id};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // delete method
        app.delete('/allReviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
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