const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const createTonWallet = require("./api/createTonWallet");
const createEthWallet = require("./api/createEthWallet");
const inputHandler = require("./api/input");

const app = express();
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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


// const tonStorageFile = path.join(dataFolderPath, "ton_wallet.json");
// const ethStorageFile = path.join(dataFolderPath, "eth_wallet.json");

// const client = new TonClient({
//   endpoint: "https://toncenter.com/api/v2/jsonRPC",
// });

// const generateTonWallet = async () => {
//   let storedWallet = [];

//   const mnemonics = await mnemonicNew();

//   const keyPair = await mnemonicToPrivateKey(mnemonics);

//   const workchain = 0;
//   const wallet = WalletContractV4.create({
//     workchain,
//     publicKey: keyPair.publicKey,
//   });

//   const address = wallet.address;

//   const tonWallet = {
//     mnemonic: mnemonics,
//     publicKey: keyPair.publicKey.toString("hex"),
//     privateKey: keyPair.secretKey.toString("hex"),
//     address: address.toString(true, true, true),
//     createdAt: new Date(),
//   };

//   if (fs.existsSync(tonStorageFile)) {
//     storedWallet = JSON.parse(fs.readFileSync(tonStorageFile, "utf-8"));
//   }
//   storedWallet.push(tonWallet);

//   fs.writeFileSync(
//     tonStorageFile,
//     JSON.stringify(storedWallet, null, 2),
//     "utf-8"
//   );

//   return tonWallet;
// };

// const createEthWallet = () => {
//   let ethWallet = [];

//   if (fs.existsSync(ethStorageFile)) {
//     ethWallet = JSON.parse(fs.readFileSync(ethStorageFile, "utf-8"));
//   }

//   const wallet = Wallet.createRandom();

//   const newWallet = {
//     address: wallet.address,
//     privateKey: wallet.privateKey,
//     mnemonic: wallet.mnemonic.phrase,
//     createdAt: new Date().toISOString(),
//   };

//   ethWallet.push(newWallet);
//   fs.writeFileSync(ethStorageFile, JSON.stringify(ethWallet, null, 2), "utf-8");

//   return newWallet;
// };

// app.post("/api/create-ton-wallet", async (req, res) => {
//   try {
//     const newWallet = await generateTonWallet();
//     res.json({ success: true, wallet: newWallet });
//   } catch (error) {
//     console.error("Error creating TON wallet:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error creating TON wallet" });
//   }
// });

// app.post("/api/create-eth-wallet", (req, res) => {
//   try {
//     const newWallet = createEthWallet();
//     res.json({ success: true, wallet: newWallet });
//   } catch (error) {
//     console.error("Error creating Ethereum wallet:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error creating Ethereum wallet" });
//   }
// });

// if (!fs.existsSync(dataFolderPath)) {
//   fs.mkdirSync(dataFolderPath);
// }

// app.post("/input", async (req, res) => {
//   try {
//     console.log("Received input:", req.body);
//     const { inputValue } = req.body;

//     if (!inputValue) {
//       return res.status(400).send("Input value is required");
//     }

//     const timestamp = new Date();
//     const newData = new Data({ inputValue, timestamp });
//     await newData.save();

//     const logData = {
//       inputValue,
//       timestamp: timestamp.toISOString(),
//     };

//     fs.appendFileSync(dataFilePath, JSON.stringify(logData) + "\n");

//     res.status(200).send("Data saved successfully");
//   } catch (error) {
//     console.error("Error saving data:", error);
//     res.status(500).send("Server error");
//   }
// });
