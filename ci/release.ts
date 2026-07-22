import {
  eq,
  format,
  github,
  job,
  needsOutput,
  secret,
  stepOutput,
  workflow,
  type GitHubRunStep,
  type GitHubWorkflowStep,
} from "@dedalus-labs/hollywood";

const checkoutV4 = "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5";
const releasePleaseV4 = "googleapis/release-please-action@5c625bfb5d1ff62eadeeb3772007f7f66fdcf071";
const setupTerraformV4 = "hashicorp/setup-terraform@dfe3c3f87815947d99a8997f908cb6525fc44e9e";
const pnpmSetupV4 = "pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1";
const setupNodeV4 = "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020";

const checkout = (): GitHubWorkflowStep => ({
  uses: checkoutV4,
  with: {
    "persist-credentials": false,
  },
});

const setupTerraform = (): GitHubWorkflowStep => ({
  uses: setupTerraformV4,
  with: {
    terraform_wrapper: false,
  },
});

const setupPnpm = (): GitHubWorkflowStep => ({ uses: pnpmSetupV4 });

const setupNode = (): GitHubWorkflowStep => ({
  uses: setupNodeV4,
  with: {
    "node-version-file": ".node-version",
    cache: "pnpm",
  },
});

const install = (): GitHubRunStep => ({ run: "pnpm install --frozen-lockfile" });

const setup = (): readonly GitHubWorkflowStep[] => [
  checkout(),
  setupPnpm(),
  setupNode(),
  install(),
];

export const release = workflow({
  name: "Release",
  on: {
    push: {
      branches: ["main"],
    },
  },
  concurrency: {
    group: format("{0}-{1}", github.workflow, github.ref),
    "cancel-in-progress": false,
  },
  permissions: { contents: "read" },
  jobs: {
    verify: job({
      name: "Release / Verify",
      "runs-on": "ubuntu-24.04",
      steps: [
        ...setup(),
        setupTerraform(),
        { name: "Repository checks", run: "pnpm check" },
        { name: "Unit tests", run: "pnpm test" },
        { name: "Infrastructure checks", run: "pnpm infra:check" },
        { name: "Smoke built site", run: "pnpm test:smoke" },
        { name: "Cloudflare bundle dry run", run: "pnpm check:cloudflare" },
      ],
    }),
    release: job({
      name: "Release / Reconcile",
      "runs-on": "ubuntu-24.04",
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
      steps: [
        checkout(),
        {
          id: "release",
          name: "Run release-please",
          uses: releasePleaseV4,
          with: {
            "config-file": "release-please-config.json",
            "manifest-file": ".release-please-manifest.json",
          },
        },
      ],
    }),
    deploy: job({
      name: "Deploy / Production",
      "runs-on": "ubuntu-24.04",
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
      steps: [
        {
          uses: checkoutV4,
          with: {
            "persist-credentials": false,
            ref: needsOutput("release", "release_sha"),
          },
        },
        setupPnpm(),
        setupNode(),
        install(),
        {
          name: "Require tagged release checkout",
          env: {
            RELEASE_SHA: needsOutput("release", "release_sha"),
            RELEASE_TAG: needsOutput("release", "tag_name"),
          },
          run: 'test -n "$RELEASE_TAG" && test "$(git rev-parse HEAD)" = "$RELEASE_SHA"',
        },
        {
          name: "Smoke built site",
          run: "pnpm test:smoke",
        },
        {
          name: "Cloudflare bundle dry run",
          run: "pnpm check:cloudflare",
        },
        {
          name: "Deploy Worker",
          env: {
            RELEASE_SHA: needsOutput("release", "release_sha"),
            RELEASE_TAG: needsOutput("release", "tag_name"),
          },
          run: 'pnpm exec wrangler deploy --strict --tag "$RELEASE_TAG" --message "$RELEASE_TAG ($RELEASE_SHA)"',
        },
        {
          name: "Smoke live deployment",
          run: "SITE_URL=https://windsornguyen.com node --test tests/site-live.smoke.mjs",
        },
      ],
    }),
  },
});
