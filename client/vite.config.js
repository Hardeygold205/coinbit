import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["eventemitter3"],
    exclude: ["ccip-AUVA6B3H"],
  },
  build: {
    outDir: "dist",
  },
});
