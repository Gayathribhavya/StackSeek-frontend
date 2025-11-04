import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// Absolute paths for allowed directories
const clientDir = path.resolve(__dirname, "client");
const sharedDir = path.resolve(__dirname, "shared");
const projectRoot = path.resolve(__dirname); // optional, for the root

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        clientDir,
        sharedDir,
        projectRoot // add this line if needed for index.html or similar
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": clientDir,
      "@shared": sharedDir,
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();

      server.middlewares.use(app);

      // SPA Fallback for client-side routing
      server.middlewares.use("*", (req, res, next) => {
        if (
          req.method === "GET" &&
          !req.url?.startsWith("/api") &&
          !req.url?.includes(".") &&
          req.url !== "/"
        ) {
          req.url = "/";
        }
        next();
      });
    },
  };
}
