const IS_LOCAL_ENV = true; // set false for production or use environment detection

export const BASE_URL = IS_LOCAL_ENV
  ? "http://localhost:5294"
  : "https://your-production-backend-url.com";
