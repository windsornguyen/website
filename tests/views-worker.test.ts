// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertBlogSlug } from "../content/schema";

const { createSupabaseAdmin, getViewCountWithClient, incrementViewCountWithClient, supabase } =
  vi.hoisted(() => {
    const supabase = { client: "supabase-admin" };

    return {
      supabase,
      createSupabaseAdmin: vi.fn(() => supabase),
      getViewCountWithClient: vi.fn(),
      incrementViewCountWithClient: vi.fn(),
    };
  });

vi.mock("../src/lib/supabase-admin", () => ({
  createSupabaseAdmin,
}));

vi.mock("../src/lib/views-server", () => ({
  getViewCountWithClient,
  incrementViewCountWithClient,
}));

import worker from "../worker/index";

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SECRET_KEY: "secret",
};

function fetchWorker(pathname: string, init?: RequestInit) {
  return worker.fetch(new Request(`https://windsornguyen.com${pathname}`, init), env);
}

beforeEach(() => {
  createSupabaseAdmin.mockClear();
  getViewCountWithClient.mockReset();
  incrementViewCountWithClient.mockReset();
});

describe("views worker", () => {
  it("reads a published post view count", async () => {
    getViewCountWithClient.mockResolvedValueOnce(12);

    const response = await fetchWorker("/api/views/first-post");

    await expect(response.json()).resolves.toEqual({ slug: "first-post", views: 12 });
    expect(createSupabaseAdmin).toHaveBeenCalledWith({
      url: env.SUPABASE_URL,
      secretKey: env.SUPABASE_SECRET_KEY,
    });
    expect(getViewCountWithClient).toHaveBeenCalledWith(supabase, assertBlogSlug("first-post"));
    expect(incrementViewCountWithClient).not.toHaveBeenCalled();
  });

  it("increments a published post view count", async () => {
    incrementViewCountWithClient.mockResolvedValueOnce(13);

    const response = await fetchWorker("/api/views/first-post", { method: "POST" });

    await expect(response.json()).resolves.toEqual({ slug: "first-post", views: 13 });
    expect(incrementViewCountWithClient).toHaveBeenCalledWith(
      supabase,
      assertBlogSlug("first-post"),
    );
    expect(getViewCountWithClient).not.toHaveBeenCalled();
  });

  it("rejects unknown slugs before opening Supabase", async () => {
    const response = await fetchWorker("/api/views/not-a-post");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Unknown blog post" });
    expect(createSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("rejects unsupported methods before opening Supabase", async () => {
    const response = await fetchWorker("/api/views/first-post", { method: "PUT" });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, POST");
    await expect(response.json()).resolves.toEqual({ error: "Method not allowed" });
    expect(createSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("returns a JSON 500 when the view store fails", async () => {
    getViewCountWithClient.mockRejectedValueOnce(new Error("storage down"));

    const response = await fetchWorker("/api/views/first-post");

    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ error: "storage down" });
  });
});
