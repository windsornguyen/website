// Copyright (c) 2026 Windsor Nguyen. MIT License.

import {
  eq,
  needsOutput,
  secret,
  stepOutput,
  type GitHubWorkflowJob,
} from "@dedalus-labs/hollywood";
import { describe, expect, it } from "vitest";

import { release } from "../ci/release";

describe("website release workflow", () => {
  it("deploys only after release-please creates a release", () => {
    expect(release).toMatchObject({
      name: "Release",
      on: { push: { branches: ["main"] } },
      concurrency: {
        group: "${{ format('{0}-{1}', github.workflow, github.ref) }}",
        "cancel-in-progress": false,
      },
      permissions: { contents: "read" },
      jobs: {
        verify: { name: "Release / Verify" },
        release: {
          name: "Release / Reconcile",
          needs: ["verify"],
          permissions: {
            contents: "write",
            issues: "write",
            "pull-requests": "write",
          },
          outputs: {
            release_created: stepOutput("release", "release_created"),
            release_sha: stepOutput("release", "sha"),
            tag_name: stepOutput("release", "tag_name"),
          },
        },
        deploy: {
          name: "Deploy / Production",
          needs: ["release"],
          if: eq(needsOutput("release", "release_created"), "true"),
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
    expect(release.on).not.toHaveProperty("pull_request");

    const jobs = release.jobs as Readonly<Record<string, GitHubWorkflowJob>>;
    const verifyJob = jobs.verify;
    const releaseJob = jobs.release;
    const deployJob = jobs.deploy;
    if (verifyJob === undefined || !("steps" in verifyJob)) {
      throw new Error("verify must be a step-based job");
    }
    if (releaseJob === undefined || !("steps" in releaseJob)) {
      throw new Error("release must be a step-based job");
    }
    if (deployJob === undefined || !("steps" in deployJob)) {
      throw new Error("deploy must be a step-based job");
    }

    expect(verifyJob.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ run: "pnpm check" }),
        expect.objectContaining({ run: "pnpm test" }),
        expect.objectContaining({ run: "pnpm infra:check" }),
        expect.objectContaining({ run: "pnpm test:smoke" }),
        expect.objectContaining({ run: "pnpm check:cloudflare" }),
      ]),
    );
    expect(releaseJob.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "release",
          uses: "googleapis/release-please-action@5c625bfb5d1ff62eadeeb3772007f7f66fdcf071",
        }),
      ]),
    );
    expect(deployJob.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uses: "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5",
          with: {
            "persist-credentials": false,
            ref: needsOutput("release", "release_sha"),
          },
        }),
        expect.objectContaining({ run: "pnpm test:smoke" }),
        expect.objectContaining({ run: "pnpm check:cloudflare" }),
        expect.objectContaining({
          env: {
            RELEASE_SHA: needsOutput("release", "release_sha"),
            RELEASE_TAG: needsOutput("release", "tag_name"),
          },
          run: 'pnpm exec wrangler deploy --strict --tag "$RELEASE_TAG" --message "$RELEASE_TAG ($RELEASE_SHA)"',
        }),
        expect.objectContaining({
          run: "SITE_URL=https://windsornguyen.com node --test tests/site-live.smoke.mjs",
        }),
      ]),
    );
  });
});
