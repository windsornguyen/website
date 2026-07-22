// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { and, eq, github, secret, type GitHubWorkflowJob } from "@dedalus-labs/hollywood";
import { describe, expect, it } from "vitest";

import { quality } from "../ci/quality";

describe("website CI/CD workflow", () => {
  it("keeps pull requests unprivileged and deploys verified main builds", () => {
    expect(quality).toMatchObject({
      name: "Website: CI/CD",
      on: {
        push: { branches: ["main"] },
        pull_request: {},
      },
      concurrency: {
        group: "${{ format('{0}-{1}', github.workflow, github.ref) }}",
        "cancel-in-progress": eq(github.eventName, "pull_request"),
      },
      permissions: { contents: "read" },
      jobs: {
        lint: { name: "Quality / Lint & Format" },
        typecheck: { name: "Quality / Type Check" },
        terraform: { name: "Infrastructure / Terraform" },
        test: { name: "Test / Unit" },
        build: { name: "Build / Smoke & Bundle" },
        links: { name: "Quality / Links" },
        deploy: {
          name: "Deploy / Production",
          if: and(eq(github.eventName, "push"), eq(github.ref, "refs/heads/main")),
          needs: ["lint", "typecheck", "terraform", "test"],
          environment: {
            name: "Production",
            url: "https://windsornguyen.com",
          },
          env: {
            CLOUDFLARE_ACCOUNT_ID: secret("CLOUDFLARE_ACCOUNT_ID"),
            CLOUDFLARE_API_TOKEN: secret("CLOUDFLARE_API_TOKEN"),
          },
        },
      },
    });
    expect(quality.on.pull_request).toEqual({});

    const jobs = quality.jobs as Readonly<Record<string, GitHubWorkflowJob>>;
    const deploy = jobs.deploy;
    if (deploy === undefined || !("steps" in deploy)) {
      throw new Error("deploy must be a step-based job");
    }

    expect(deploy.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ run: "pnpm test:smoke" }),
        expect.objectContaining({ run: "pnpm check:cloudflare" }),
        expect.objectContaining({
          run: 'pnpm exec wrangler deploy --strict --tag "$GITHUB_SHA" --message "$GITHUB_SHA"',
        }),
        expect.objectContaining({
          run: "SITE_URL=https://windsornguyen.com node --test tests/site-live.smoke.mjs",
        }),
      ]),
    );

    for (const [jobId, jobDefinition] of Object.entries(jobs)) {
      if (jobId !== "deploy") {
        expect(JSON.stringify(jobDefinition)).not.toContain("CLOUDFLARE_API_TOKEN");
      }
    }
  });
});
