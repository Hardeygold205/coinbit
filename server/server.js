const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const createTonWallet = require("./api/createTonWallet");
const createEthWallet = require("./api/createEthWallet");
const inputHandler = require("./api/input");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

const mongourl = process.env.MONGODB_URL;
console.log("Connecting to MongoDB...");

mongoose
  .connect(mongourl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


app.post("/api/create-ton-wallet", createTonWallet);
app.post("/api/create-eth-wallet", createEthWallet);
app.post("/api/input", inputHandler);


app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API!");
});

app.get("*", (req, res) => {
  res.status(404).send("Route Not Found");
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

module.exports = app;