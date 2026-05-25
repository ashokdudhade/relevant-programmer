import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteMetadata } from '../data/site';
import { extractFirstImage, postPath } from '../utils/blog';
import { absoluteUrl, DEFAULT_DESCRIPTION } from '../utils/seo';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const items = posts
    .map((entry) => {
      const post = entry.data;
      const url = absoluteUrl(postPath(post.path));
      const hero = extractFirstImage(entry.body);
      const enclosure = hero
        ? `<enclosure url="${escapeXml(absoluteUrl(hero.startsWith('/') ? hero : `/${hero}`))}" type="image/jpeg" />`
        : '';

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="true">${escapeXml(url)}</guid>
  <pubDate>${post.date.toUTCString()}</pubDate>
  <description>${escapeXml(post.description)}</description>
  <category>${escapeXml(post.category)}</category>
  ${enclosure}
</item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml(DEFAULT_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
