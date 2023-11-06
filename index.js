const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors())
app.use(express.json())

// pass: 2owku6biN0H5htv0
// user: 

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nc6s3b6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        await client.connect();
        const featureFoodsCollections = client.db("foodSharingDB").collection("featureFoods")
        const availableFoodCollections = client.db("foodSharingDB").collection("availableFoods")
        const requestedFoodCollections = client.db("foodSharingDB").collection("requestedFood")

        // featured foods get api
        app.get('/api/v1/featureFood', async (req, res) => {
            const query = {}
            console.log(query);
            const result = await featureFoodsCollections.find(query).toArray()
            res.send(result)
        })

        // available foods get api
        app.get('/api/v1/availableFoods', async (req, res) => {
            const page = parseInt(req.query.page)
            console.log(page);
            const size = parseInt(req.query.size)
            const query = {}
            console.log(query);
            const result = await availableFoodCollections.find(query)
                .skip(page * size)
                .limit(size)
                .toArray()
            res.send(result)
        })

        // requested food get api
        app.get('/api/v1/requestedFoodDisplayed', async (req, res) => {
            const query = {}
            console.log(query);
            const result = await requestedFoodCollections.find(query).toArray()
            res.send(result)
        })
        // available food by id
        app.get('/api/v1/availableFoods/:id', async (req, res) => {
            const id = req.params.id
            const food = { _id: new ObjectId(id) }
            const result = await availableFoodCollections.findOne(food)
            res.send(result)
        })
        // available food count
        app.get('/api/v1/availableFoodsCount', async (req, res) => {
            const count = await availableFoodCollections.estimatedDocumentCount()
            res.send({ count })
        })

        // foods post api
        app.post('/api/v1/availableFoodsAdd', async (req, res) => {
            const foods = req.body
            const result = await availableFoodCollections.insertOne(foods)
            console.log(result);
            res.send(result)
        })
        app.post('/api/v1/requestedFood', async (req, res) => {
            const foods = req.body
            const result = await requestedFoodCollections.insertOne(foods)
            console.log(result);
            res.send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})