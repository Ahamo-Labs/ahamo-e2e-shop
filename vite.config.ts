import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 8080 },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
