import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ipfs": {
        target: "https://cloudflare-ipfs.com", // or any other gateway
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ipfs/, ""),
      },
    },
  },
});
