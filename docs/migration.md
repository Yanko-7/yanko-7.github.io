# Migration from al-folio

The owner requested a complete replacement of al-folio with AstroPaper. The migration uses AstroPaper 6.1.0, upstream commit `35cfa7fbe0b897306d27670d3819e55d5205f3dd`, with the official demo’s single-column home page, colors, Google Sans Code typography, and article cards. Personalization is limited to identity, profile, and content. The original repository history is unchanged; the working tree before migration was also copied to `/tmp/yanko-al-folio-backup` during this session (temporary, not a permanent backup).

## Personal information

The profile was rewritten from the previous `_pages/about.md` and `_data/cv.yml`. Research/project claims, measurements, affiliations, education, and awards are retained as supplied by the owner. The original CV remains available at `/assets/pdf/cv.pdf`. The contact links retain GitHub and email. The old `/cv/`, `/blog/`, and `/repositories/` entry points redirect to their new destinations.

## Articles

Source: `Yanko-7/MyBlog`, commit `94ca4813e4b0881c3739e5e1d3ce7df1a69afc88`.

- Use the date in each article's original frontmatter, not the Git commit date.
- Import 13 articles from 2022–2024. Keep the Hugo setup article as a draft, leaving 12 publicly visible articles.
- Exclude 14 articles dated 2021.
- Preserve original body text and code, normalizing code-fence language aliases, image paths, and one mixed Chinese/math delimiter. Titles, summaries, and tags are edited for clarity. Earlier notes have not been fact-checked or rewritten as current guidance.
- Give articles stable ASCII slugs and convert timestamps without explicit offsets using Asia/Shanghai (`+08:00`). Date-only entries use local midnight.
- Add KaTeX rendering and Chinese Pagefind segmentation. Article HTML uses `zh-CN`; the surrounding site identity and navigation are English.

`content-migration.json` records every source file, source date, destination slug, and draft/exclusion decision.

A subsequent formatting pass repaired heading levels, lists, emphasis, formula delimiters and subscripts, and duplicated copy/paste notation. Five remote formula images were converted to inline math. All 146 code blocks retain their original contents.

## Images

All 28 referenced images have been saved to `public/images/posts/`. Three OI Wiki PNG links had moved to SVG versions; their original and resolved URLs are recorded in `image-migration.json`. Original image attribution and external links in the text remain intact. No missing illustrations have been invented or replaced with unrelated images.

## Implementation

Removed Jekyll configuration, gems, Docker setup, example assets, old documentation, and al-folio CI/tests. Kept Git history and protected agent-tooling directories. Root `AGENTS.md` now describes the Astro site; legacy al-folio skills do not apply.

The site uses locally hosted Google Sans Code fonts, a local static social preview image, and a generated local search index. No external font requests are required for rendering or building. Automatic per-post OG generation is disabled. Upstream's MIT license is retained.

The GitHub Pages workflow serves at `/`. It runs format, lint, build, migration/link tests, and browser checks before deploying. Repository Settings → Pages must use **GitHub Actions** as the publishing source. The migration itself does not push or publish changes.
