import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [/^next\//, /^@prisma\//, 'jose', /^bcrypt/],
    },
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/admin": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
    watch: {
      // Ignore binary images that may be locked by external programs on Windows
      ignored: ["**/src/Images/**"],
    },
  },
});
