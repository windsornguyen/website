// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc, maybeSingle } = vi.hoisted(() => ({
  rpc: vi.fn(),
  maybeSingle: vi.fn(),
}));

// Replace the supabase admin client before views-server imports it,
// so the env-var validation in supabase.ts never runs in tests.
vi.mock("../src/lib/supabase", () => ({
  getSupabase: () => ({
    rpc,
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle }),
      }),
    }),
  }),
}));

import { getViewCount, incrementViewCount } from "../src/lib/views-server";

beforeEach(() => {
  rpc.mockReset();
  maybeSingle.mockReset();
});

describe("views-server.incrementViewCount", () => {
  it("throws when the RPC errors (no silent fallback to mock data)", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    await expect(incrementViewCount("first-post")).rejects.toThrow(/Failed to increment/);
  });

  it("throws when the RPC returns null data with no error", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: null });
    await expect(incrementViewCount("first-post")).rejects.toThrow(/no data returned/);
  });

  it("returns the new count on success", async () => {
    rpc.mockResolvedValueOnce({ data: 42, error: null });
    expect(await incrementViewCount("first-post")).toBe(42);
  });
});

describe("views-server.getViewCount", () => {
  it("throws on supabase read error (no silent fallback to mock)", async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: { message: "schema gone" } });
    await expect(getViewCount("first-post")).rejects.toThrow(/Failed to read/);
  });

  it("returns 0 when the slug has no row yet", async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    expect(await getViewCount("brand-new-slug")).toBe(0);
  });

  it("returns the row's count when present", async () => {
    maybeSingle.mockResolvedValueOnce({ data: { count: 1247 }, error: null });
    expect(await getViewCount("reflecting-on-2024")).toBe(1247);
  });
});
