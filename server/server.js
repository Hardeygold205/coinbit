const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { ethers } = require("ethers");
const { Wallet } = require("ethers");

const { Pool } = require("pg");

require("buffer");
const { TonClient, WalletContractV4 } = require("ton");
const { mnemonicNew, mnemonicToPrivateKey } = require("ton-crypto");

const mongourl = process.env.MONGODB_URL;
const neonUrl = process.env.DATABASE_URL;
const app = express();
const PORT = process.env.PORT || 3000;

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

console.log("Connecting to Neon...");
const pool = new Pool({
  connectionString: neonUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const tonWalletSchema = `
  CREATE TABLE IF NOT EXISTS ton_wallets (
    id SERIAL PRIMARY KEY,
    mnemonic TEXT[],
    public_key TEXT,
    private_key TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const ethWalletSchema = `
  CREATE TABLE IF NOT EXISTS eth_wallets (
    id SERIAL PRIMARY KEY,
    address TEXT,
    private_key TEXT,
    mnemonic TEXT,
    created_at TEXT
  )
`;

const dataSchema = `
  CREATE TABLE IF NOT EXISTS data (
    id SERIAL PRIMARY KEY,
    input_value TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

pool.query(tonWalletSchema).catch(console.error);
pool.query(ethWalletSchema).catch(console.error);
pool.query(dataSchema).catch(console.error);

const DataSchema = new mongoose.Schema({
  inputValue: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const TonWalletSchema = new mongoose.Schema({
  mnemonic: [String],
  publicKey: String,
  privateKey: String,
  address: String,
  createdAt: Date,
});

const EthWalletSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
  mnemonic: String,
  createdAt: Date,
});

const Data = mongoose.model("Data", DataSchema);
const TonWallet = mongoose.model("TonWallet", TonWalletSchema);
const EthWallet = mongoose.model("EthWallet", EthWalletSchema);

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

const generateTonWallet = async () => {
  const mnemonics = await mnemonicNew();
  const keyPair = await mnemonicToPrivateKey(mnemonics);

  const workchain = 0;
  const wallet = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  });

  const address = wallet.address;

  const tonWallet = new TonWallet({
    mnemonic: mnemonics,
    publicKey: keyPair.publicKey.toString("hex"),
    privateKey: keyPair.secretKey.toString("hex"),
    address: address.toString(true, true, true),
    createdAt: new Date(),
  });

  await pool.query(
    "INSERT INTO ton_wallets(mnemonic, public_key, private_key, address, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [
      tonWallet.mnemonic,
      tonWallet.publicKey,
      tonWallet.privateKey,
      tonWallet.address,
      tonWallet.createdAt,
    ]
  );

  return tonWallet;
};

const createEthWallet = async () => {
  const wallet = Wallet.createRandom();
  const newWallet = new EthWallet({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    createdAt: new Date().toISOString(),
  });
  await pool.query(
    "INSERT INTO eth_wallets(address, private_key, mnemonic, created_at) VALUES($1, $2, $3, $4) RETURNING *",
    [
      newWallet.address,
      newWallet.privateKey,
      newWallet.mnemonic,
      newWallet.createdAt,
    ]
  );

  return newWallet;
};

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Blockchain Wallet API" });
});

app.post("/create-ton-wallet", async (req, res) => {
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

app.post("/create-eth-wallet", async (req, res) => {
  try {
    const newWallet = await createEthWallet();
    res.json({ success: true, wallet: newWallet });
  } catch (error) {
    console.error("Error creating Ethereum wallet:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating Ethereum wallet" });
  }
});

app.post("/input", async (req, res) => {
  try {
    const { inputValue } = req.body;

    if (!inputValue) {
      return res.status(400).send("Input value is required");
    }

    const timestamp = new Date();
    await pool.query(
      "INSERT INTO data(input_value, timestamp) VALUES($1, $2)",
      [inputValue, timestamp]
    );

    res.status(200).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
