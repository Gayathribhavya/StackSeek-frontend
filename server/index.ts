import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { getRepositories, connectRepository } from "./routes/repositories";
import { analyzeError } from "./routes/analyze-error";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // API endpoints
  app.get("/api/repositories", getRepositories);
  app.post("/api/repositories", connectRepository);
  app.post("/api/analyze-error", analyzeError);

  // Note: OAuth is handled by the .NET backend at wm3s5emyme.ap-south-1.awsapprunner.com

  // SPA fallback - handle client-side routing
  app.get("*", (_req, res, next) => {
    // Skip API routes - let them pass through
    if (_req.path.startsWith("/api")) {
      return next();
    }
    
    // In development with Vite, we need to let Vite's dev server handle static files
    // but still provide fallback for SPA routes
    if (process.env.NODE_ENV !== "production") {
      // For development, we'll let this pass through to Vite
      return next();
    }
    
    // In production, serve the built index.html for all SPA routes
    res.sendFile(path.join(__dirname, "../dist/spa/index.html"));
  });

  return app;
}
