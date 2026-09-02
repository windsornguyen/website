// Copyright (c) 2026 Windsor Nguyen. MIT License.

// Integration tests need the local Supabase stack, so they run as a separate
// invocation instead of alongside the unit suite.

import base from "./vite.config";

export default {
  ...base,
  test: {
    ...base.test,
    include: ["tests/**/*.integration.test.ts"],
    exclude: [],
    globalSetup: ["tests/fixtures/supabase.ts"],
  },
};
