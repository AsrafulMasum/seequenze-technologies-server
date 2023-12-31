require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://funny-peony-9c3420.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nonsgpu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// mongodb connection
const dbConnect = async () => {
  try {
    client.connect();
    console.log("DB Connected Successfully✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const database = client.db("SeequenzeTechnologiesDB");
const cardsCollections = database.collection("cardsDB");

app.get("/", (req, res) => {
  res.send("server is running data will appear soon...");
});

// cards api method
app.post("/cards", async (req, res) => {
  try {
    const playerInfo = req.body;
    const result = await cardsCollections.insertOne(playerInfo);
    res.send(result);
  } catch (error) {
    console.error("Error posting cards:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/cards", async (req, res) => {
  try {
    const cursor = cardsCollections.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/cards/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cardsCollections.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).send("Internal server error");
  }
});

app.put("/cards/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatePlayer = {
      $set: {
        author: req.body.author,
        title: req.body.title,
        description: req.body.description,
        image_url: req.body.image_url,
      },
    };
    const result = await cardsCollections.updateOne(
      filter,
      updatePlayer,
      options
    );
    res.send(result);
  } catch (error) {
    console.error("Error updating cards:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/cards/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cardsCollections.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting cards:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
