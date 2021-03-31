const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
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

    // client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})