# Agent guidelines

This repository is Yongkang Qi's personal site, built with AstroPaper and Astro.
The owner explicitly replaced al-folio; the former Jekyll/gem boundaries no longer apply.

- Edit site identity and feature flags in `astro-paper.config.ts`.
- Pages, components, and styles belong in `src/`; static files belong in `public/`.
- Posts live in `src/content/posts/`. Preserve the author's original prose and code unless asked to revise it. Use ISO timestamps with an explicit timezone, meaningful descriptions, and topic tags.
- Do not publish posts marked `draft: true`. Do not reimport articles dated before 2022.
- Personal facts come from the owner's profile; do not invent publications, affiliations, or achievements.
- Use npm and commit `package-lock.json`. Node 24 LTS is the supported development/CI runtime.
- Validate with `npm run format:check`, `npm run lint`, `npm run build`, and `npm test`. For UI changes, also run `npm run test:browser` after installing Playwright Chromium.
- GitHub Pages serves this user site at `/`, not `/al-folio`. Deployment uses `.github/workflows/deploy.yml`.
- Migration provenance and unavailable source images are recorded in `docs/`. Preserve upstream AstroPaper's MIT license.
- Legacy al-folio skills under agent-tooling directories are retained for tooling compatibility and do not apply to this Astro site.
