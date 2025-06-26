const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;

// Middleware for parsing JSON and form data
app.use(express.json()); // <-- ADD THIS for JSON body parsing
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// MongoDB connection
const MONGO_URL = "mongodb://admin:ans123@localhost:27017";
const client = new MongoClient(MONGO_URL);

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db("apnacollege-db");
        const data = await db.collection("users").find({}).toArray();

        res.send(data);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        client.close();
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    console.log("Request body:", userObj);

    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db("apnacollege-db");
        const data = await db.collection("users").insertOne(userObj);

        console.log("data inserted in DB");

        res.status(201).json({
            success: true,
            message: "User added successfully",
            insertedId: data.insertedId
        });
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    } finally {
        client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
