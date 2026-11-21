// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const codeHikeConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "github-dark",
  },
};

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/**/*.integration.test.ts"],
  },
  fmt: {
    printWidth: 100,
    useTabs: false,
    trailingComma: "all",
    endOfLine: "lf",
    experimentalTailwindcss: {},
    ignorePatterns: ["README", "CHANGELOG.md", "content/blog/*.mdx", "public/blog/*.md"],
  },
  plugins: [
    (() => {
      const mdxPlugin = mdx({
        remarkPlugins: [[remarkCodeHike, codeHikeConfig]],
        recmaPlugins: [[recmaCodeHike, codeHikeConfig]],
      });
      const transform = mdxPlugin.transform;

      return {
        ...mdxPlugin,
        enforce: "pre",
        transform(code, id) {
          if (id.includes("?raw")) {
            return;
          }

          if (typeof transform !== "function") {
            return;
          }

          return transform.call(this, code, id);
        },
      };
    })(),
    tailwindcss(),
    reactRouter(),
    babel({
      exclude: [/\.mdx?$/],
      presets: [reactCompilerPreset()],
    }),
  ],
});
