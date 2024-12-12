const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Data = require("../models/Data");

const dataFilePath = path.join(__dirname, "../data/data.json");

module.exports = async (req, res) => {
  try {
    const { inputValue } = req.body;
    if (!inputValue) {
      return res.status(400).send("Input value is required");
    }

    const timestamp = new Date();
    const newData = new Data({ inputValue, timestamp });
    await newData.save();

    const logData = { inputValue, timestamp: timestamp.toISOString() };
    fs.appendFileSync(dataFilePath, JSON.stringify(logData) + "\n");

    res.status(200).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Server error");
  }
};
