import { createHmac, timingSafeEqual } from "node:crypto";
import type { GithubPRPayload, ParsedPRData } from "./github.types.js";
import { analyzePullRequest } from "../pull-requests/pullRequest.service.js";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_TOKEN!;

if (!WEBHOOK_SECRET) {
  throw new Error("GITHUB_WEBHOOK_TOKEN is not set in environment variables");
}

export function verifySignature(
  rawBody: Buffer,
  signatureHeader: string,
): boolean {
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const received = Buffer.from(signatureHeader.slice(7), "hex");
  const expected = Buffer.from(
    createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex"),
    "hex",
  ); // create hex buffer with rawbody of github with secret key provided

  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected); // always compare full buffer so there is no timing attack
}

export async function handleGithubEvent(
  eventType: string,
  payload: any,
  deliveryId: string,
): Promise<{ status: string }> {
  console.log(`[webhook] event=${eventType} delivery=${deliveryId}`);

  switch (eventType) {
    case "ping":
      return { status: "pong" };
    case "pull_request":
      // handle github pull request service
      return { status: "processed" };
    default:
      return { status: "ignored" };
  }
}

export async function handlePullRequestEvent(
  payload: GithubPRPayload,
): Promise<{ status: string }> {
  const { action, pull_request: pr, repository } = payload;

  const actionsToAnalyze = ["opened", "synchronize", "reopened"];

  if (!actionsToAnalyze.includes(action)) {
    return { status: "skipped" };
  }

  const prData: ParsedPRData = {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    body: pr.body ?? "",
    state: pr.state,
    author: pr.user.login,
    sourceBranch: pr.head.ref,
    targetBranch: pr.base.ref,
    headSha: pr.head.sha,
    additions: pr.additions,
    deletions: pr.deletions,
    changedFiles: pr.changes_files,
    repoFullName: repository.full_name,
    htmlUrl: pr.html_url,
  };

  // analyze the PR data
  await analyzePullRequest(prData);

  return { status: "processed" };
}
