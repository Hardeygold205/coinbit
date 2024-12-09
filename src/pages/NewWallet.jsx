import React, { useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function NewWallet() {
  const { state: wallet } = useLocation();
  const walletRef = useRef(null);
  const [copied, setCopied] = useState(null);

  const handleCopy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const mnemonicArray = Array.isArray(wallet.mnemonic)
    ? wallet.mnemonic
    : wallet.mnemonic.split(" ");

  return (
    <div
      ref={walletRef}
      className="p-8 flex flex-col mt-12 items-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div>
        <div className="mb-4">
          <Link to="/">
            <FontAwesomeIcon icon={faLeftLong} />
            <p className="p-0 text-[0.4rem]">BACK</p>
          </Link>
        </div>
        {wallet && (
          <div className="w-full space-y-5 max-w-md">
            <div className="text-start font-bold">
              <p>Your wallet has been successfully created.</p>
            </div>
            <div className="space-y-3 border p-5 rounded-lg h-full">
              <h2 className="uppercase font-bold text-2xl">Wallet Details:</h2>
              <div>
                <p>
                  <strong>Address:</strong>
                  <div className="flex break-words">
                    <h3 className="break-all">{wallet.address}</h3>
                    <button
                      onClick={() => handleCopy(wallet.address, "address")}
                      className="btn btn-sm ml-2">
                      {copied === "address" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </p>
              </div>
              <div>
                <p>
                  <strong>Private Key:</strong>
                  <div className="flex break-words">
                    <h3 className="break-all">{wallet.privateKey}</h3>
                    <button
                      onClick={() =>
                        handleCopy(wallet.privateKey, "privateKey")
                      }
                      className="btn btn-sm ml-2">
                      {copied === "privateKey" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </p>
              </div>
              <div>
                <strong>Mnemonic:</strong>
                <div className="flex flex-col">
                  <ol
                    className="list-decimal grid grid-cols-3 md:grid-cols-4 gap-4 text-start p-4"
                    style={{ gridAutoRows: "min-content" }}>
                    {mnemonicArray.map((word, index) => (
                      <li key={index}>{word}</li>
                    ))}
                  </ol>
                  <button
                    onClick={() =>
                      handleCopy(mnemonicArray.join(" "), "mnemonic")
                    }
                    className="btn btn-sm mt-2">
                    {copied === "mnemonic" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
