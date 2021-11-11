const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
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


        // Post Api
        app.post('/lotions', async (req, res) => {
            const lotion = req.body;
            console.log('everything is ok', lotion);
            const result = await lotionsCollection.insertOne(lotion)
            res.send(result)
        })

        // Get Api 
        app.get('/lotions', async (req, res) => {
            const cursor = lotionsCollection.find({});
            const lotions = await cursor.toArray();
            res.send(lotions);
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
    console.log(`app listening ${port}`)
})