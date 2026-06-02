import express from "express";
import type { Application } from "express";
import { webhookRoutes } from "./modules/webhooks/github.routes.js";

export function createApp(): Application {
  const app = express();

  /**
   * Custom body parser that saves rawBody before json parsing
   * Why:HMAC is computed over the exact bytes Github sent
   *      if we only have req.body (parse JS object ), re-stringifying
   *      it may changes whitespace or key order - breaking the signature
   */

  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf; // original request bytes or buffer
      },
    }),
  );

  app.get("/health", (_req, res) => {
    try {
      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error,
      });
    }
  });

  app.use("/api", webhookRoutes());

  return app;
}
