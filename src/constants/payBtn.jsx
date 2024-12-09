import React from "react";
import { ethers } from "ethers";

function PayButton({ walletAddress, network }) {
  const handlePayment = async () => {
    if (!walletAddress || !network) {
      alert("Please connect your wallet first!");
      return;
    }

    const amount = "0.01"; 
    const recipient = RECEIVER_WALLETS[network];

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
      });

      console.log("Transaction Hash:", tx.hash);

      // Verify the payment with the backend
      await fetch("http://localhost:5002/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network, transactionHash: tx.hash, amount }),
      });

      alert("Payment successful!");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handlePayment}>Pay</button>;
}

export default PayButton;
