const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { ethers } = require("ethers");
const { Wallet } = require("ethers");

require("buffer");
const { TonClient, WalletContractV4 } = require("ton");
const { mnemonicNew, mnemonicToPrivateKey } = require("ton-crypto");

const mongourl = process.env.MONGODB_URL;
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

console.log("Connecting to MongoDB...");

mongoose
  .connect(mongourl)
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

const dataFolderPath = path.join(__dirname, "../data");

const dataFilePath = path.join(dataFolderPath, "../data/data.json");
const tonStorageFile = path.join(dataFolderPath, "../data/ton_wallet.json");
const ethStorageFile = path.join(dataFolderPath, "../data/eth_wallet.json");

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

const generateTonWallet = async () => {
  let storedWallet = [];

  const mnemonics = await mnemonicNew();

  const keyPair = await mnemonicToPrivateKey(mnemonics);

  const workchain = 0;
  const wallet = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  });

  const address = wallet.address;

  const tonWallet = {
    mnemonic: mnemonics,
    publicKey: keyPair.publicKey.toString("hex"),
    privateKey: keyPair.secretKey.toString("hex"),
    address: address.toString(true, true, true),
    createdAt: new Date(),
  };

  if (fs.existsSync(tonStorageFile)) {
    storedWallet = JSON.parse(fs.readFileSync(tonStorageFile, "utf-8"));
  }
  storedWallet.push(tonWallet);

  fs.writeFileSync(
    tonStorageFile,
    JSON.stringify(storedWallet, null, 2),
    "utf-8"
  );

  return tonWallet;
};

const createEthWallet = () => {
  let ethWallet = [];

  if (fs.existsSync(ethStorageFile)) {
    ethWallet = JSON.parse(fs.readFileSync(ethStorageFile, "utf-8"));
  }

  const wallet = Wallet.createRandom();

  const newWallet = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    createdAt: new Date().toISOString(),
  };

  ethWallet.push(newWallet);
  fs.writeFileSync(ethStorageFile, JSON.stringify(ethWallet, null, 2), "utf-8");

  return newWallet;
};

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Blockchain Wallet API" });
});

app.post("/api/create-ton-wallet", async (req, res) => {
  try {
    const newWallet = await generateTonWallet();
    res.json({ success: true, wallet: newWallet });
  } catch (error) {
    console.error("Error creating TON wallet:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating TON wallet" });
  }
});

app.post("/api/create-eth-wallet", (req, res) => {
  try {
    const newWallet = createEthWallet();
    res.json({ success: true, wallet: newWallet });
  } catch (error) {
    console.error("Error creating Ethereum wallet:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating Ethereum wallet" });
  }
});

if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath);
}

app.post("/api/input", async (req, res) => {
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

module.exports = app;