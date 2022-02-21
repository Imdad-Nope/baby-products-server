const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;


// middle ware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5vc4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("babysLotions");
        const lotionsCollection = database.collection("lotions")


        const database2 = client.db("orderdLotions")
        const purchasedProducts = database2.collection("purchasing")


        // Post Api
        app.post('/lotions', async (req, res) => {
            const lotion = req.body;
            console.log('everything is ok', lotion);
            const result = await lotionsCollection.insertOne(lotion)
            res.json(result)
        })

        // Get Api 
        app.get('/lotions', async (req, res) => {
            const cursor = lotionsCollection.find({});
            const lotions = await cursor.toArray();
            res.send(lotions);
        })

        // Post Api Purchasing

        app.post('/purchasing', async (req, res) => {
            const bid = req.body;
            const result = await purchasedProducts.insertOne(bid)
            res.send(result);
        })

        // Get purchaing

        app.get('/purchasingProducts/:id', async (req, res) => {
            console.log(req.params.id)
            const result = await lotionsCollection.find({ _id: ObjectId(req.params.id) }).toArray();
            res.send(result[0]);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`app is listening here ${port}`)
})