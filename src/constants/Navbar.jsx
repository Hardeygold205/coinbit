import React from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isConnected } = useAccount();

  return (
    <div className="absolute left-0 right-0 top-0">
      <div className="p-3 mx-auto max-w-7xl border-b-[0.2px] navbar bg-opacity-10">
        <div className="flex-1">
          <Link to="/" className="text-xl flex gap-x-2 font-bold">
            <img
              src="/free-coinbase-9420774-7651204.webp"
              alt="Coinbase Logo"
              className="w-7 h-7"
            />
            CoinBit
          </Link>
        </div>
        <div className="flex-none">
          <div>
            {isConnected ? (
              <appkit-account-button />
            ) : (
              <appkit-connect-button />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
