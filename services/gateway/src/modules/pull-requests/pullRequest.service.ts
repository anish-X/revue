import type { ParsedPRData } from "../webhooks/github.types.js";

export async function analyzePullRequest(pr: ParsedPRData): Promise<void> {
  console.log(`[pr] analyzing PR #${pr.number} "${pr.title}"`);
  console.log(`[pr] ${pr.sourceBranch} → ${pr.targetBranch}`);
  console.log(
    `[pr] +${pr.additions} -${pr.deletions} across ${pr.changedFiles} files`,
  );
}
