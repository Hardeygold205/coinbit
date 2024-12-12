const fs = require("fs");
const path = require("path");
const { mnemonicNew, mnemonicToPrivateKey } = require("ton-crypto");
const { TonClient, WalletContractV4 } = require("ton");

const tonStorageFile = path.join(__dirname, "../data/ton_wallet.json");

const generateTonWallet = async () => {
  const mnemonics = await mnemonicNew();
  const keyPair = await mnemonicToPrivateKey(mnemonics);

  const wallet = WalletContractV4.create({
    workchain: 0,
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

  let storedWallet = [];
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

module.exports = async (req, res) => {
  try {
    const newWallet = await generateTonWallet();
    res.json({ success: true, wallet: newWallet });
  } catch (error) {
    console.error("Error creating TON wallet:", error);
    res.status(500).json({ success: false, message: "Error creating TON wallet" });
  }
};
