import React from "react";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { isConnected } = useAccount();

  return (
    <div className="navbar bg-base-100 p-3">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          {" "}
          <img
            src="/free-coinbase-9420774-7651204.webp"
            alt=""
            className="w-7 h-7"
          />
          CoinbaseExtension
        </a>
      </div>
      <div className="flex-none">
        <div>
          {isConnected ? <appkit-account-button /> : <appkit-connect-button />}
        </div>
      </div>
    </div>
  );
}
