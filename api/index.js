// Vercel Serverless Function — Catch-all API handler
// Wraps the Express app from server/index.js

import app from "../server/index.js";

export default function handler(req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error("API handler error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
