import React, { useState } from "react";
import { ethers } from "ethers";

function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask or a compatible wallet!");
      return;
    }

    try {
      console.log("Connecting to wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("Accounts:", accounts);

      // Get network details
      const network = await provider.getNetwork();
      console.log("Network:", network);

      // Update state
      setWalletAddress(accounts[0]);
      setNetwork(network.name);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div>
      {walletAddress ? (
        <p>
          Connected: {walletAddress} on {network}
        </p>
      ) : (
        <button
          className="btn px-5 py-3 bg-white outline-dashed"
          onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWalletButton;
