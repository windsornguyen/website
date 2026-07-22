// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { eq, github } from "@dedalus-labs/hollywood";
import { describe, expect, it } from "vitest";

import { quality } from "../ci/quality";

describe("website CI/CD workflow", () => {
  it("keeps quality checks unprivileged and unable to deploy", () => {
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
      },
    });
    expect(quality.on.pull_request).toEqual({});
    expect(quality.jobs).not.toHaveProperty("deploy");
    expect(JSON.stringify(quality.jobs)).not.toContain("CLOUDFLARE_API_TOKEN");
  });
});
