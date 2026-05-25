import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://www.relevantprogrammer.com';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, 'src/content/blog');

function normalizeSiteUrl(pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withSlash = p.endsWith('/') || p.includes('.') ? p : `${p}/`;
  return new URL(withSlash, `${SITE}/`).href;
}

function parseFrontmatterValue(block, key) {
  const scalar = block.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?`, 'm'));
  if (scalar) return scalar[1].trim();
  const quoted = block.match(new RegExp(`^${key}:\\s*"([^"]+)"`, 'm'));
  if (quoted) return quoted[1].trim();
  return null;
}

function parseTags(block) {
  const section = block.match(/^tags:\s*\n((?:\s+-\s*.+\n?)+)/m);
  if (!section) return [];
  return [...section[1].matchAll(/^\s+-\s*["']?([^"'\n]+)["']?/gm)].map((m) => m[1].trim());
}

function loadBlogMetaFromDisk() {
  if (!fs.existsSync(BLOG_DIR)) {
    return { postLastmodByUrl: new Map(), tagPostCounts: new Map() };
  }

  const postLastmodByUrl = new Map();
  const tagPostCounts = new Map();

  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;

    const fm = match[1];
    if (parseFrontmatterValue(fm, 'draft') === 'true') continue;

    const postPath = parseFrontmatterValue(fm, 'path');
    const dateStr = parseFrontmatterValue(fm, 'date');
    if (!postPath || !dateStr) continue;

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) continue;

    postLastmodByUrl.set(normalizeSiteUrl(postPath), date);

    for (const tag of parseTags(fm)) {
      const slug = tag.toLowerCase().replace(/\s+/g, '-');
      tagPostCounts.set(slug, (tagPostCounts.get(slug) ?? 0) + 1);
    }
  }

  return { postLastmodByUrl, tagPostCounts };
}

const { postLastmodByUrl, tagPostCounts } = loadBlogMetaFromDisk();

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes('/404')) return false;
        const tagMatch = page.match(/\/tags\/([^/]+)/);
        if (tagMatch) {
          return (tagPostCounts.get(tagMatch[1]) ?? 0) >= 2;
        }
        return true;
      },
      serialize(item) {
        const lastmod = postLastmodByUrl.get(item.url);
        if (lastmod) {
          return { ...item, lastmod: lastmod.toISOString() };
        }
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },
});
