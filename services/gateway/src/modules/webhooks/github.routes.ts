import { Router } from "express";
import { githubWebhookHandler } from "./github.controller.js";

export function webhookRoutes(): Router {
  const router = Router();

  router.post("/webhooks/github", githubWebhookHandler);

  return router;
}
