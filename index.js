const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const  ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// user : carsDB
// pass: U7GlURVw15Fq6yJg

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cjag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try{
    await client.connect();
    const database = client.db("cars_shop");
    const carsCollection = database.collection("cars");
    const ordersCollection = database.collection("orders");

    // all cars
    app.get('/cars', async(req, res) => {
      const cursor = carsCollection.find({});
      const result = await cursor.toArray();
      // console.log(result)
      res.send(result);
    })

    // single car
    app.get('/singleCar/:id', async(req, res) => {
      const id = req.params.id;
      const Object = {_id: ObjectId(id)};
      const result = await carsCollection.find(Object).toArray();
      res.send(result);
    })

      // add orders to the database
      app.post('/addOrders', async(req, res) => {
        const orders = req.body;
        const result = await ordersCollection.insertOne(orders)
        console.log(result);
        res.send(result)
      })

  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello cars world!");
});

app.listen(port, () => {
  console.log(`Port listening at ${port}`);
});
