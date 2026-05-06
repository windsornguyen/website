#!/usr/bin/env -S tsx
// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { cac } from "cac";

import { parseBlogSlug } from "../content/schema";
import { error, heading, pc, success, table } from "./lib/fmt";
import {
  readPostEntries,
  renderTimestampLabel,
  slugifyTitle,
  validatePostEntries,
  writePostFile,
} from "./lib/posts";

const cli = cac("site");

cli
  .command("post <subcommand>", "Manage blog posts")
  .option("--json", "Print machine-readable JSON")
  .option("--title <title>", "Post title")
  .option("--slug <slug>", "Slug to use. Defaults to a slugified title.")
  .option("--description <description>", 'Description to store in "postMetadata".', {
    default: "TODO.",
  })
  .option("--published-at <publishedAt>", "ISO timestamp. Defaults to the current time.", {
    default: new Date().toISOString(),
  })
  .option("--force", "Overwrite an existing file if it already exists.")
  .action(
    async (
      subcommand: string,
      options: {
        description: string;
        force?: boolean;
        json?: boolean;
        publishedAt: string;
        slug?: string;
        title?: string;
      },
    ) => {
      if (subcommand === "list") {
        const posts = await readPostEntries();

        if (options.json) {
          console.log(JSON.stringify(posts, null, 2));
          return;
        }

        heading(`Posts (${posts.length})`);
        table(
          posts.map((post) => [
            pc.bold(post.title),
            pc.dim(post.slug),
            pc.yellow(renderTimestampLabel(post.publishedAt)),
            pc.dim(post.status),
          ]),
          ["Title", "Slug", "Published", "Status"],
        );
        console.log();
        return;
      }

      if (subcommand === "verify") {
        const posts = await readPostEntries();
        const errors = validatePostEntries(posts);

        if (options.json) {
          console.log(
            JSON.stringify({ ok: errors.length === 0, postCount: posts.length, errors }, null, 2),
          );
          return;
        }

        if (errors.length === 0) {
          success(`Verified ${posts.length} post(s). No issues found.`);
          return;
        }

        heading("Verification Errors");
        for (const err of errors) {
          error(err);
        }
        console.log();

        process.exitCode = 1;
        return;
      }

      if (subcommand !== "create") {
        throw new Error(`Unknown post subcommand: ${subcommand}`);
      }

      if (!options.title) {
        throw new Error("--title is required");
      }

      const slugCandidate = options.slug ?? slugifyTitle(options.title);
      const slug = parseBlogSlug(slugCandidate);

      if (!slug) {
        throw new Error("Could not derive a lowercase kebab-case slug from the provided title.");
      }

      const postPath = await writePostFile(
        {
          slug,
          title: options.title,
          description: options.description,
          publishedAt: options.publishedAt,
          status: "draft",
        },
        options.force,
      );

      success(`Created ${pc.underline(postPath)}`);
    },
  );

cli.help();
cli.parse();
