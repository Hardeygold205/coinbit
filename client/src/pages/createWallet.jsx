import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function CreateWallet() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [walletType, setWalletType] = useState("ETH");

  const createWallet = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const endpoint =
        walletType === "TON"
          ? "/create-ton-wallet"
          : "/create-eth-wallet";

      const response = await axios.post(`${apiUrl}${endpoint}`);

      setTimeout(() => {
        if (response.data.success) {
          navigate("/new-wallet", { state: response.data.wallet });
        } else {
          setErrorMessage(response.data.message || "Error creating wallet");
          setLoading(false);
        }
      }, 3500);
    } catch (error) {
      setTimeout(() => {
        setErrorMessage("Server error: " + error.message);
        setLoading(false);
      }, 3500);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <h1 className="mt-4">Please wait...</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-5">
          <div className="mb-14 mr-64">
            <Link to="/">
              <FontAwesomeIcon icon={faLeftLong} />
              <p className="p-0 text-[0.4rem]">BACK</p>
            </Link>
          </div>
          <div className="w-full max-w-xs space-y-3 p-3">
            <div className="w-full max-w-xs">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Select Wallet Type
              </label>
              <select
                className="mt-2 select select-info w-full max-w-xs"
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}>
                <option value="ETH">EVM-Compatible Wallets</option>
                <option value="TON">TON Wallet</option>
              </select>
            </div>
            <button
              className="btn py-2 rounded-full w-full max-w-xs text-center bg-white hover:bg-white/50"
              onClick={createWallet}>
              {loading ? "Creating Wallet" : "Create New Wallet"}
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
}
