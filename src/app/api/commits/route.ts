import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export const runtime = "nodejs";

type CommitItem = {
  sha: string;
  message: string;
  repo: string;
  url: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "rkhatta1";
  const repo = "Cravemate";

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    });

    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: username,
        repo: repo,
        per_page: 30,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const commits = (data as Array<any>)
      .filter((commit) => commit?.sha && commit?.commit?.message)
      .slice(0, 3)
      .map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        repo: repo,
        url: commit.html_url ?? `https://github.com/${username}/${repo}/commit/${commit.sha}`,
      })) satisfies CommitItem[];

    return NextResponse.json({ commits });
  } catch {
    return NextResponse.json({ commits: [] });
  }
}
