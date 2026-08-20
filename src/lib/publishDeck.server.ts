/**
 * Server-only helper that commits the deck's content overrides to GitHub
 * through the Lovable connector gateway.
 *
 * Never imported by client code — `publishDeck.functions.ts` pulls it in
 * dynamically from inside the server handler.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/github";

export type PublishResult = {
  commitUrl: string;
  actionsUrl: string;
  commitSha: string;
};

function gatewayHeaders() {
  const lovableApiKey = process.env["LOVABLE_API_KEY"];
  const githubApiKey = process.env["GITHUB_API_KEY"];

  if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured on the server.");
  if (!githubApiKey) {
    throw new Error("GITHUB_API_KEY is not configured — reconnect the GitHub connector.");
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${lovableApiKey}`,
    "X-Connection-Api-Key": githubApiKey,
  };
}

async function readError(response: Response, action: string): Promise<never> {
  const body = await response.text();
  console.error(`GitHub gateway ${action} failed [${response.status}]: ${body}`);

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      `GitHub rejected the request (${response.status}). The connection may need reconnecting with repository write access.`,
    );
  }
  if (response.status === 404) {
    throw new Error(
      `GitHub could not find the repository or file (404). Check the owner and repo name in deck.config.ts.`,
    );
  }
  if (response.status === 409) {
    throw new Error(
      `The file changed on GitHub since this editor loaded (409). Reload the editor and apply your change again.`,
    );
  }
  throw new Error(`GitHub ${action} failed [${response.status}]: ${body.slice(0, 400)}`);
}

/** Base64-encode a UTF-8 string without relying on `btoa` byte semantics. */
function toBase64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

export async function commitOverrides(options: {
  owner: string;
  repo: string;
  overrides: Record<string, string>;
  message: string;
}): Promise<PublishResult> {
  const { owner, repo, overrides, message } = options;
  const filePath = "src/content/deck.overrides.json";
  const headers = gatewayHeaders();
  const contentsUrl = `${GATEWAY_URL}/repos/${owner}/${repo}/contents/${filePath}`;

  // 1. Read the current file so we can supply its blob SHA on update.
  const currentResponse = await fetch(`${contentsUrl}?ref=main`, { method: "GET", headers });

  let sha: string | undefined;
  if (currentResponse.ok) {
    const current = (await currentResponse.json()) as { sha?: string };
    sha = current.sha;
  } else if (currentResponse.status !== 404) {
    await readError(currentResponse, "read");
  }

  // 2. Write the new content back as a commit on main.
  const nextContent = `${JSON.stringify(overrides, null, 2)}\n`;
  const putResponse = await fetch(contentsUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: toBase64(nextContent),
      branch: "main",
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putResponse.ok) await readError(putResponse, "commit");

  const result = (await putResponse.json()) as {
    commit?: { sha?: string; html_url?: string };
  };

  return {
    commitSha: result.commit?.sha ?? "",
    commitUrl:
      result.commit?.html_url ?? `https://github.com/${owner}/${repo}/commits/main`,
    actionsUrl: `https://github.com/${owner}/${repo}/actions`,
  };
}
