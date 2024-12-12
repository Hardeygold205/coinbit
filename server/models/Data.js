const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  inputValue: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Data || mongoose.model("Data", DataSchema);
