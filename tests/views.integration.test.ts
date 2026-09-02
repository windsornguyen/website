// Copyright (c) 2026 Windsor Nguyen. MIT License.

/**
 * Exercises the real SQL contract against local Supabase: the upsert RPC,
 * the seeded counts, and the RLS policy. The unit tests mock the client, so
 * this is the only place the schema itself is under test.
 */

import { createClient } from "@supabase/supabase-js";
import { describe, expect, inject, it } from "vitest";

import { assertBlogSlug } from "../content/schema";
import { createSupabaseAdmin } from "../src/lib/supabase-admin";
import { getViewCountWithClient, incrementViewCountWithClient } from "../src/lib/views-server";

const fixture = inject("supabase");
const admin = createSupabaseAdmin({ url: fixture.url, secretKey: fixture.secretKey });
const anon = createClient(fixture.url, fixture.anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

describe("page_views", () => {
  it("reads the seeded count", async () => {
    expect(await getViewCountWithClient(admin, assertBlogSlug("first-post"))).toBe(438);
  });

  it("increments atomically via the RPC", async () => {
    const slug = assertBlogSlug("first-post");
    expect(await incrementViewCountWithClient(admin, slug)).toBe(439);
    expect(await getViewCountWithClient(admin, slug)).toBe(439);
  });

  it("upserts a first row for an unseen slug", async () => {
    const slug = assertBlogSlug("reflecting-on-2024");
    expect(await getViewCountWithClient(admin, assertBlogSlug("unseen-post"))).toBe(0);
    expect(await incrementViewCountWithClient(admin, assertBlogSlug("unseen-post"))).toBe(1);
    expect(await getViewCountWithClient(admin, slug)).toBe(1_247);
  });

  it("lets anon read but not write", async () => {
    const read = await anon.from("page_views").select("count").eq("slug", "first-post").single();
    expect(read.error).toBeNull();

    // RLS filters unauthorized rows rather than erroring: the update matches
    // nothing and the row is untouched.
    const write = await anon
      .from("page_views")
      .update({ count: 0 })
      .eq("slug", "first-post")
      .select();
    expect(write.error).toBeNull();
    expect(write.data).toEqual([]);
    expect(await getViewCountWithClient(admin, assertBlogSlug("first-post"))).toBe(439);
  });
});
