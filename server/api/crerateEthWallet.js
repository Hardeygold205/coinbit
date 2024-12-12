const fs = require("fs");
const path = require("path");
const { Wallet } = require("ethers");

const ethStorageFile = path.join(__dirname, "../data/eth_wallet.json");

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

module.exports = (req, res) => {
  try {
    const newWallet = createEthWallet();
    res.json({ success: true, wallet: newWallet });
  } catch (error) {
    console.error("Error creating Ethereum wallet:", error);
    res.status(500).json({ success: false, message: "Error creating Ethereum wallet" });
  }
};
