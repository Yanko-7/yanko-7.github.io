import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const read = path => readFileSync(path, "utf8");
const manifest = JSON.parse(read("docs/content-migration.json"));

test("migration respects original dates and draft visibility across public indexes", () => {
  const rss = read("dist/rss.xml");
  const archive = read("dist/archives/index.html");
  const sitemap = read("dist/sitemap-0.xml");
  assert.equal(manifest.imported.length, 13);
  assert.equal(manifest.excluded.length, 14);
  assert.equal((rss.match(/<item>/g) || []).length, 12);
  for (const post of manifest.imported) {
    assert.ok(Number(post.date.slice(0, 4)) >= 2022);
    assert.equal(existsSync(`dist/posts/${post.slug}/index.html`), !post.draft);
    if (post.draft) {
      for (const index of [rss, archive, sitemap])
        assert.ok(!index.includes(post.slug));
    } else {
      assert.ok(rss.includes(post.slug));
      assert.ok(archive.includes(post.slug));
    }
  }
});

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory()
      ? htmlFiles(join(dir, entry.name))
      : entry.name.endsWith(".html")
        ? [join(dir, entry.name)]
        : []
  );
}

test("all internal page links and assets resolve in the production output", () => {
  for (const file of htmlFiles("dist")) {
    const html = read(file);
    assert.ok(!html.includes('class="katex-error"'), `Invalid math: ${file}`);
    for (const [, raw] of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)) {
      if (raw.startsWith("//")) continue;
      const path = decodeURIComponent(raw.split(/[?#]/)[0]);
      const target = join("dist", path);
      assert.ok(
        existsSync(target) || existsSync(join(target, "index.html")),
        `${file}: ${raw}`
      );
    }
  }
});

test("article images are local, present, and preserve source provenance", () => {
  const images = JSON.parse(read("docs/image-migration.json"));
  for (const image of Object.values(images)) {
    if (image.status === "downloaded")
      assert.ok(existsSync(join("public", image.local)));
    else assert.ok(image.error);
  }
  for (const post of manifest.imported) {
    const markdown = read(`src/content/posts/${post.slug}.md`);
    assert.ok(!/!\[[^\]]*\]\(https?:/.test(markdown));
  }
});
