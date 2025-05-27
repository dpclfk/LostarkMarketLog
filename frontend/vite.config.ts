import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3701,
    open: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3700",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
