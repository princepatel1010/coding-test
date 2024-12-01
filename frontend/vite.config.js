import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@shadcn/ui": "/node_modules/@shadcn/ui",
    },
  },
  plugins: [react()],
});
