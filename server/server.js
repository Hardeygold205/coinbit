const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ debug: true });
const fs = require("fs");
const path = require("path");

const mongourl = process.env.MONGODB_URL;
const app = express();
const PORT = process.env.PORT || 5002;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

console.log("Connecting to MongoDB...");

mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const DataSchema = new mongoose.Schema({
  inputValue: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Data = mongoose.model("Data", DataSchema);

const dataFolderPath = path.join(__dirname, "data");
const dataFilePath = path.join(dataFolderPath, "data.json");

if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath);
}

app.post("/input", async (req, res) => {
  try {
    console.log("Received input:", req.body);
    const { inputValue } = req.body;

    if (!inputValue) {
      return res.status(400).send("Input value is required");
    }

    const timestamp = new Date();
    const newData = new Data({ inputValue, timestamp });
    await newData.save();

    const logData = {
      inputValue,
      timestamp: timestamp.toISOString(),
    };

    fs.appendFileSync(dataFilePath, JSON.stringify(logData) + "\n");

    res.status(200).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
