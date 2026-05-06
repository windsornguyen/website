# Changelog

## [0.1.0](https://github.com/windsornguyen/website/compare/website-v0.0.1...website-v0.1.0) (2026-05-06)


### Features

* **blog:** add parallel agentic engineering post ([7dd378b](https://github.com/windsornguyen/website/commit/7dd378b75ba3460f6caa4033a284b933e3b2c2cb))
* **cli:** add cac-based site cli and route tree generation ([6e73afd](https://github.com/windsornguyen/website/commit/6e73afd6d9cf44d1bbc254e3067a690cbad63c3a))
* **content:** add one year at Dedalus post ([b2bfd97](https://github.com/windsornguyen/website/commit/b2bfd97a66e46977b36f89ef2f313d992d950eab))
* **content:** expand one year at Dedalus draft ([b486c18](https://github.com/windsornguyen/website/commit/b486c18782b01a660e8ed84c0d76c4efa2a6ed85))
* dark mode, typed blog schema, CSS split ([205e66a](https://github.com/windsornguyen/website/commit/205e66a1d9c92ff4c54895fce662df40a3d09936))
* directional tab content transitions ([e740621](https://github.com/windsornguyen/website/commit/e7406219d3def667730f0507d17dc8dc217fc260))
* llms.txt generation, MIT license, UI polish ([c8b04af](https://github.com/windsornguyen/website/commit/c8b04af6f98b0a32f6f86eb564c2080b145f201c))
* machine mode toggle for LLM-readable markdown view ([c30762e](https://github.com/windsornguyen/website/commit/c30762e303f6f9028095294fe336c603db004877))
* **mdx:** integrate codehike compiler and simplify blog route ([b74c404](https://github.com/windsornguyen/website/commit/b74c40460313bf7bb8dd915f1f937e58c872f2e5))
* **site:** render Bio and Research tabs from MDX content ([da687d0](https://github.com/windsornguyen/website/commit/da687d081ab76473eefc27f742229e24dff89273))
* **ui:** add cmd+k command palette with cmdk ([6554087](https://github.com/windsornguyen/website/commit/6554087f0a4dbadfc8865de5c8826165ddd32549))
* **views:** persist counts in Supabase via service-role admin client ([eaf3799](https://github.com/windsornguyen/website/commit/eaf37999a11381c2d39d345dac7e4dc2f4cae035))


### Bug Fixes

* **analytics:** rename gaID env var to GA_ID for shell consistency ([ebeb036](https://github.com/windsornguyen/website/commit/ebeb03643ae257dd4d625cf2225311b55f2d51f7))
* **ci:** use project format check in quality workflow ([3159a13](https://github.com/windsornguyen/website/commit/3159a13adc988b73023b0a2d1be48396e1131207))
* **content:** lazy-load blog mdx modules ([55343ab](https://github.com/windsornguyen/website/commit/55343ab9b2e18954a803ad8a59c9bf57271e8520))
* font size tokens, view count API, design token cleanup ([981258b](https://github.com/windsornguyen/website/commit/981258b0a0447b73426aa1e6a27e9cf7bdcec518))
* **lint:** satisfy CI oxlint rules ([416b874](https://github.com/windsornguyen/website/commit/416b8743550640fee1d18de26ad0ee7ec71b6200))
* rewrite machine mode to render actual markdown, not CSS hacks ([cf9e99a](https://github.com/windsornguyen/website/commit/cf9e99a7012e5317b6f552c2dba6b2ec328e6e6c))
* **site-cli:** default new posts to draft, drop bogus canonical field ([ddeb84a](https://github.com/windsornguyen/website/commit/ddeb84a2c50c7b4e315ff7f9500439e70014f3a0))
* **supabase:** defer env check to first use, not module load ([dd2abc6](https://github.com/windsornguyen/website/commit/dd2abc6de596354466c05ed704d621d24c39642b))
* VT100 machine mode, TDD markdown builders, design token rule ([6cee08d](https://github.com/windsornguyen/website/commit/6cee08d3ce35103061f5cef829176b2b0733d44b))


### Refactors

* **content:** split contentManifest into src/lib/{site,content} ([3262b76](https://github.com/windsornguyen/website/commit/3262b7647f67123fa6e975b29764ad9b03db96de))
* **mdx:** pure-markdown body convention with styled small caption ([06df882](https://github.com/windsornguyen/website/commit/06df882b54656af18f88b7cd7331248bba4fe016))
* migrate site to TanStack Start and Vite Plus ([1bb272c](https://github.com/windsornguyen/website/commit/1bb272c8024ac5d879d42ceac97fb0cf92ea086d))
* semantic color tokens, eliminate dark: prefix whack-a-mole ([47fbc69](https://github.com/windsornguyen/website/commit/47fbc69ac98506ca6877bd6aed5ccac26da94999))
* **ts:** tighten content contracts and script execution ([1d35ae4](https://github.com/windsornguyen/website/commit/1d35ae4e733de0eab06a616400e5b5a5846d1760))
* **ui:** persistent site chrome, redesign cmdk, prune dead code ([cffbd69](https://github.com/windsornguyen/website/commit/cffbd69abb1faf6c07d65405c6c5d7b15fa28897))
* **ui:** redesign homepage with nav, tabs, and linear-style typography ([11da97f](https://github.com/windsornguyen/website/commit/11da97fda3f3d0e66bbe3fbab318bc2797619b5b))
* **ui:** remove custom cursor ([041daee](https://github.com/windsornguyen/website/commit/041daee3035e71cff1b4452d6632c927c11f7bf0))
* **ui:** remove separator and move post descriptions below title ([278f898](https://github.com/windsornguyen/website/commit/278f898313f5338da48b86fb580572d0768d1462))


### Documentation

* add environment files etiquette to AGENTS.md ([3085bb5](https://github.com/windsornguyen/website/commit/3085bb5476ade6310f65d3cd2ecd7c790dbb82f5))
* **readme:** tighten for open-source readers ([5719059](https://github.com/windsornguyen/website/commit/5719059fb55ebd4c617d568777ed252857294cd1))
* rewrite README in plain rst, drop deploy details ([97ca6bb](https://github.com/windsornguyen/website/commit/97ca6bbabfdd237e7c23e208eba897892e301e86))
* update local development commands ([2113fd8](https://github.com/windsornguyen/website/commit/2113fd8cf1f240ce40db3d45ef865e42c9c03dfe))


### Chores

* 2026 site update ([#1](https://github.com/windsornguyen/website/issues/1)) ([acd45ba](https://github.com/windsornguyen/website/commit/acd45bab947e7bf7aed13d39c9c324cd003fee89))
* remove legacy PWA assets ([fad9843](https://github.com/windsornguyen/website/commit/fad9843f4ab3adcda70a15b2c4d83607ce7ee59a))
* **scripts:** pretty-print site CLI output ([5d12af8](https://github.com/windsornguyen/website/commit/5d12af890f01f26e8c74ace1ce558e866a2860ff))
* **tooling:** add agent shipping workflow ([ab72123](https://github.com/windsornguyen/website/commit/ab7212344344d8a5a7ca39c05c713b7ab071457c))
* upgrade site toolchain for Next.js 16 ([783b4ff](https://github.com/windsornguyen/website/commit/783b4ff717ca44f56be9aecaf89ec5077aafec8c))
