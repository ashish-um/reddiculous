import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: true,
  //   port: 5173, // Optional, specify if you want a different port
  // },
  base: "/reddiculous/",
  plugins: [react()],
});
