import {
  eq,
  github,
  job,
  workflow,
  type GitHubRunStep,
  type GitHubWorkflowStep,
} from "@dedalus-labs/hollywood";

const ubuntu = "ubuntu-24.04";
const checkoutV4 = "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5";
const pnpmSetupV4 = "pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1";
const setupNodeV4 = "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020";
const lycheeV2 = "lycheeverse/lychee-action@8646ba30535128ac92d33dfc9133794bfdd9b411";

const checkout = (): GitHubWorkflowStep => ({ uses: checkoutV4 });

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

export const quality = workflow({
  name: "Quality",
  on: {
    push: {
      branches: ["main"],
    },
    pull_request: {
      branches: ["main"],
    },
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
      name: "Lint & Format",
      "runs-on": ubuntu,
      steps: [
        ...setup(),
        {
          name: "Hollywood workflow drift",
          run: "pnpm check:workflows",
        },
        {
          name: "oxlint",
          run: "pnpm exec oxlint --deny-warnings",
        },
        {
          name: "markdownlint",
          run: "pnpm exec markdownlint-cli2 '**/*.{md,mdx}' '#node_modules' '#build' '#dist' '#CHANGELOG.md'",
        },
        {
          name: "Format check (oxfmt)",
          run: "pnpm check-format",
        },
      ],
    }),
    typecheck: job({
      name: "Type Check",
      "runs-on": ubuntu,
      steps: [
        ...setup(),
        {
          name: "TypeScript",
          run: "pnpm typecheck",
        },
      ],
    }),
    build: job({
      name: "Build & Cloudflare Bundle",
      "runs-on": ubuntu,
      needs: ["lint", "typecheck"],
      steps: [
        ...setup(),
        {
          name: "Build",
          run: "pnpm build",
        },
        {
          name: "Cloudflare bundle dry run",
          run: "pnpm check:cloudflare",
        },
      ],
    }),
    links: job({
      name: "Link Check",
      "runs-on": ubuntu,
      if: eq(github.eventName, "pull_request"),
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
