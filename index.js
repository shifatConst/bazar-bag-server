const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5sag.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("bazar-bag").collection("products");
    const orderCollection = client.db("bazar-bag").collection("order");
    console.log('database connected successfully');

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new event: ', newProduct);

        productCollection.insertOne(newProduct)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    })

    app.post('/checkout', (req, res) => {
        const newBooking = req.body;
        orderCollection.insertOne(newBooking)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        console.log('new booking: ', newBooking);
    })

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, items) => {
            console.log(err);
            res.send(items);
            console.log('form database', items);
        })
    })

    app.get('/products/:id', (req, res) => {
        productCollection.find({_id: ObjectId (req.params.id)})
        .toArray((err, items) => {
            console.log(err);
            res.send(items[0]);
        })
    })

    app.get('/order', (req, res) => {
        orderCollection.find({email: req.query.email})
        .toArray((err, products) => {
            res.send(products);
            console.log(err);
        })
    })

    // client.close();
});


app.get('/', (req, res) => {
    res.send('Working on bazar-bag')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})