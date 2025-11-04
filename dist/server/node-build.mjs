import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
const getRepositories = async (req, res) => {
  res.status(501).json({
    success: false,
    repositories: [],
    error: "Repository fetching is handled by the .NET backend at wm3s5emyme.ap-south-1.awsapprunner.com/api/repository/user"
  });
};
const connectRepository = async (req, res) => {
  res.status(501).json({
    success: false,
    repository: {},
    message: "Repository connections are handled by the .NET backend at wm3s5emyme.ap-south-1.awsapprunner.com/api/repository/connect"
  });
};
const analyzeError = async (req, res) => {
  try {
    const { repositoryId, errorMessage, codeSnippet } = req.body;
    if (!repositoryId || !errorMessage) {
      return res.status(400).json({
        success: false,
        error: "Repository ID and error message are required"
      });
    }
    res.status(501).json({
      success: false,
      error: "Error analysis service is not yet implemented. Please connect your repository and configure the AI analysis backend."
    });
  } catch (error) {
    console.error("Error analyzing error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during analysis"
    });
  }
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/repositories", getRepositories);
  app2.post("/api/repositories", connectRepository);
  app2.post("/api/analyze-error", analyzeError);
  app2.get("*", (_req, res, next) => {
    if (_req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(__dirname, "../dist/spa/index.html"));
  });
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname$1 = import.meta.dirname;
const distPath = path.join(__dirname$1, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
