/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function getPlugins() {
  const plugins = [react(), tsconfigPaths()];
  return plugins;
}

export default defineConfig({
  base: './', // ✅ 添加这一行，关键！
  plugins: getPlugins(),
  server: {
    host: true,
    port: 3000,
    headers: {
      'ngrok-skip-browser-warning': 'true'
    },
    allowedHosts: [
      'unbewitchingly-untouching-kaylin.ngrok-free.dev'
    ]
  }
});
