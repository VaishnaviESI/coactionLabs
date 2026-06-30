import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // Never silently drift to 8081 — that origin's /login/callback isn't a
    // registered Okta redirect URI and would fail with a 400. Fail loudly if
    // 8080 is busy instead (free it with: lsof -ti:8080 | xargs kill -9).
    strictPort: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
