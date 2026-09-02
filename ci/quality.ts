import {
  command,
  eq,
  format,
  github,
  job,
  workflow,
  type GitHubRunStep,
  type GitHubWorkflowStep,
  type WorkflowCommand,
} from "@dedalus-labs/hollywood";

const ubuntu = "ubuntu-24.04";
const checkoutV4 = "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5";
const setupTerraformV4 = "hashicorp/setup-terraform@dfe3c3f87815947d99a8997f908cb6525fc44e9e";
const pnpmSetupV4 = "pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1";
const setupNodeV4 = "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020";
const lycheeV2 = "lycheeverse/lychee-action@8646ba30535128ac92d33dfc9133794bfdd9b411";
const supabaseSetupV3 = "supabase/setup-cli@46f7f98c7f948ad727d22c1e67fab04c223a0520";

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

const pnpm = (...args: readonly string[]): WorkflowCommand => command({ file: "pnpm", args });

const install = (): GitHubRunStep => ({ run: pnpm("install", "--frozen-lockfile") });

const setupSupabase = (): GitHubWorkflowStep => ({
  uses: supabaseSetupV3,
  with: {
    version: "2.108.0",
  },
});

const setup = (): readonly GitHubWorkflowStep[] => [
  checkout(),
  setupPnpm(),
  setupNode(),
  install(),
];

const isPullRequest = eq(github.eventName, "pull_request");

export const quality = workflow({
  name: "Website: CI/CD",
  on: {
    push: {
      branches: ["main"],
    },
    pull_request: {},
  },
  concurrency: {
    group: format("{0}-{1}", github.workflow, github.ref),
    "cancel-in-progress": isPullRequest,
  },
  permissions: {
    contents: "read",
  },
  env: {
    FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true,
    WRANGLER_SEND_METRICS: false,
  },
  jobs: {
    lint: job({
      name: "Quality / Lint & Format",
      "runs-on": ubuntu,
      steps: [
        ...setup(),
        {
          name: "Hollywood workflow drift",
          run: pnpm("check:workflows"),
        },
        {
          name: "oxlint",
          run: pnpm("exec", "oxlint", "--deny-warnings"),
        },
        {
          name: "markdownlint",
          run: pnpm(
            "exec",
            "markdownlint-cli2",
            "**/*.{md,mdx}",
            "#node_modules",
            "#build",
            "#dist",
            "#CHANGELOG.md",
          ),
        },
        {
          name: "Format check (oxfmt)",
          run: pnpm("check-format"),
        },
      ],
    }),
    typecheck: job({
      name: "Quality / Type Check",
      "runs-on": ubuntu,
      steps: [
        ...setup(),
        {
          name: "TypeScript",
          run: pnpm("typecheck"),
        },
      ],
    }),
    terraform: job({
      name: "Infrastructure / Terraform",
      "runs-on": ubuntu,
      steps: [
        checkout(),
        setupTerraform(),
        {
          name: "Terraform fmt",
          run: command({
            file: "terraform",
            args: ["-chdir=infra/cloudflare", "fmt", "-check", "-recursive"],
          }),
        },
        {
          name: "Terraform init",
          run: command({
            file: "terraform",
            args: ["-chdir=infra/cloudflare", "init", "-backend=false"],
          }),
        },
        {
          name: "Terraform validate",
          run: command({ file: "terraform", args: ["-chdir=infra/cloudflare", "validate"] }),
        },
      ],
    }),
    test: job({
      name: "Test / Unit",
      "runs-on": ubuntu,
      steps: [
        ...setup(),
        {
          name: "Vitest",
          run: pnpm("test"),
        },
      ],
    }),
    build: job({
      name: "Build / Smoke & Bundle",
      "runs-on": ubuntu,
      if: isPullRequest,
      needs: ["lint", "typecheck", "test"],
      steps: [
        ...setup(),
        {
          name: "Smoke built site",
          run: pnpm("test:smoke"),
        },
        {
          name: "Cloudflare bundle dry run",
          run: pnpm("check:cloudflare"),
        },
      ],
    }),
    database: job({
      name: "Database / Schema drift",
      "runs-on": ubuntu,
      if: isPullRequest,
      steps: [
        ...setup(),
        setupSupabase(),
        {
          name: "pg-delta drift gate",
          run: pnpm("db", "verify"),
        },
      ],
    }),
    links: job({
      name: "Quality / Links",
      "runs-on": ubuntu,
      if: isPullRequest,
      steps: [
        checkout(),
        {
          name: "Lychee link check",
          uses: lycheeV2,
          with: {
            args: "--config lychee.toml content/ README",
            fail: true,
          },
        },
      ],
    }),
  },
});
