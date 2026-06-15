// Copyright (c) 2026 Windsor Nguyen. MIT License.

import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  presets: [vercelPreset()],
  ssr: true,
} satisfies Config;
