import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import mdx from "@mdx-js/rollup";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
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
  },
  fmt: {
    printWidth: 100,
    useTabs: false,
    trailingComma: "all",
    endOfLine: "lf",
    experimentalTailwindcss: {},
    ignorePatterns: ["src/routeTree.gen.ts"],
  },
  plugins: [
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [[remarkCodeHike, codeHikeConfig]],
        recmaPlugins: [[recmaCodeHike, codeHikeConfig]],
      }),
    },
    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        crawlLinks: true,
        failOnError: true,
      },
    }),
    viteReact(),
    babel({
      exclude: [/\.mdx?$/],
      presets: [reactCompilerPreset()],
    }),
  ],
});
