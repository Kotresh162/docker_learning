const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");
const cors = require("cors");
app.use(cors());

const PORT = 5050;
// const MONGO_URL = "mongodb://admin:ans123@localhost:27017";
const MONGO_URL = "mongodb://admin:ans123@mongo:27017";
const client = new MongoClient(MONGO_URL);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let db;

// Connect once at startup
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("-dapnacollegeb");

    // Routes
    app.get("/getUsers", async (req, res) => {
      try {
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
      } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ success: false, message: "Error fetching users" });
      }
    });

    app.post("/addUser", async (req, res) => {
      const userObj = req.body;
      console.log("Received user:", userObj);

      try {
        const result = await db.collection("users").insertOne(userObj);
        console.log("User inserted");
        res.status(201).json({
          success: true,
          message: "User added successfully",
          insertedId: result.insertedId,
        });
      } catch (err) {
        console.error("Error inserting user:", err);
        res.status(500).json({ success: false, message: "Error adding user" });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to DB:", err);
  }
}

startServer();
