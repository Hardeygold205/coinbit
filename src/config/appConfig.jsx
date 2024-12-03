import { createAppKit } from "@reown/appkit/react";
import { QueryClient } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  arbitrum,
  mainnet,
  base,
  scroll,
  polygon,
  solana
} from "@reown/appkit/networks";

export const queryClient = new QueryClient();

export const projectId = "8369c6afeef4cfaeafaacd4c2343b0b6";

if (!projectId) {
  throw new Error("No project ID specified");
} else {
  console.log("Using project ID:", projectId);
}

export const metadata = {
  name: "CoinbaseExtension",
  description: "Wallet Connect",
  url: "http://localhost:5173",
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

export const networks = [mainnet, arbitrum, base, scroll, polygon, solana ];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ["google", "github", "discord"],
    emailShowWallets: true,
  },
  themeMode: "dark",
});
