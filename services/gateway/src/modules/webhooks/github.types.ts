export interface GithubPRPayload {
  action: string; // e.g., "opened", "closed", "reopened"
  number: number; // PR number
  pull_request: {
    id: number;
    number: number;
    title: string;
    body: string | null;
    state: string; // state of pr
    html_url: string;
    head: {
      ref: string; // source branch
      sha: string;
    };
    base: {
      ref: string; // target branch
    };
    user: {
      login: string; //user
    };
    additions: number;
    deletions: number;
    changes_files: number;
  };

  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface ParsedPRData {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  author: string;
  sourceBranch: string;
  targetBranch: string;
  headSha: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  repoFullName: string;
  htmlUrl: string;
}
