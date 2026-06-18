import { format, github, job, workflow } from "@dedalus-labs/hollywood";

const checkoutV4 = "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5";
const releasePleaseV4 = "googleapis/release-please-action@5c625bfb5d1ff62eadeeb3772007f7f66fdcf071";

export const release = workflow({
  name: "Release",
  on: {
    push: {
      branches: ["main"],
    },
  },
  concurrency: {
    group: format("{0}-{1}", github.workflow, github.ref),
    "cancel-in-progress": true,
  },
  permissions: {
    contents: "write",
    issues: "write",
    "pull-requests": "write",
  },
  jobs: {
    release: job({
      name: "Create release PR",
      "runs-on": "ubuntu-24.04",
      steps: [
        {
          uses: checkoutV4,
        },
        {
          name: "Run release-please",
          uses: releasePleaseV4,
          with: {
            "config-file": "release-please-config.json",
            "manifest-file": ".release-please-manifest.json",
          },
        },
      ],
    }),
  },
});
