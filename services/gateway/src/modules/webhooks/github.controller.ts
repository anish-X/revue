import type { Request, Response } from "express";
import { handleGithubEvent, verifySignature } from "./github.service.js";

export async function githubWebhookHandler(req: Request, res: Response) {
  // I need the signature, event type, delivery id from headers

  const signature = req.headers["x-hub-signature-256"] as string;
  const eventType = req.headers["x-github-event"] as string;
  const deliveryId = req.headers["x-github-delivery"] as string;

  // need raw body for HMAC verification
  const rawBody = (req as any).rawBody as Buffer;

  //verifies the signature
  if (!signature || !eventType || !rawBody) {
    // bad request
    res.status(400).json({ errro: "Missing required headers or body" });
  }

  if (!verifySignature(rawBody, signature)) {
    console.warn(`[Webhook] invalid signature - delivery=${deliveryId}`);
    // unauthorizedz
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  try {
    const result = await handleGithubEvent(eventType, rawBody, deliveryId);
    res.status(200).json(result);
  } catch (error) {
    console.error(`[Webhook] error handling event:`, error);
    //something broke on the server
    res.status(500).json({ error: "Internal server error" });
  }

  res.status(200).json({ status: "ok" });
}
