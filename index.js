const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://touristSpots:bcQojUvna31j1hdf@cluster0.qfdpmw3.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotsCollection = client.db("newSpots").collection("spotsCollection");
    const activityCollection = client
      .db("newSpots")
      .collection("activityCollection");

    app.post("/touristspots", async (req, res) => {
      const newSpots = req.body;
      const result = await spotsCollection.insertOne(newSpots);
      res.send(result);
    });

    app.get("/touristspots/id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotsCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.get("/touristspots/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = spotsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/touristspots/id/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await spotsCollection.deleteOne(filter);
      console.log(result);
      res.send(result);
    });

    app.put("/touristspots/id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const newSpot = req.body;
      const updatedSpot = {
        $set: {
          country: newSpot.country,
          spotName: newSpot.spotName,
          totalVisitors: newSpot.totalVisitors,
          location: newSpot.location,
          description: newSpot.description,
          cost: newSpot.cost,
          seasonality: newSpot.seasonality,
          travelTime: newSpot.travelTime,
          name: newSpot.name,
          email: newSpot.email,
          photo: newSpot.photo,
        },
      };
      const result = await spotsCollection.updateOne(query, updatedSpot);
      console.log(result);
      res.send(result);
    });

    app.get("/touristspots", async (req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //activity related stuff
    app.post("/activity", async (req, res) => {
      const activity = req.body;
      const result = await activityCollection.insertOne(activity);
      res.send(result);
    });

    app.get("/activity", async (req, res) => {
      const cursor = activityCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Yeaaah budyyy");
});

app.listen(port);
