import type { CollectionEntry } from 'astro:content';
import { siteMetadata } from '../data/site';
import { estimateReadTime, postPath } from './blog';
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_URL } from './seo';

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function authorSameAs(): string[] {
  const { author } = siteMetadata;
  return [
    `https://github.com/${author.github}`,
    `https://twitter.com/${author.twitter}`,
    `https://www.linkedin.com/in/${author.linkedin}`,
  ];
}

export function buildPersonSchema(options?: { profileUrl?: string }) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: siteMetadata.author.name,
    url: options?.profileUrl ?? absoluteUrl('/about/'),
    jobTitle: siteMetadata.subtitle,
    sameAs: authorSameAs(),
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteMetadata.title,
    url: absoluteUrl('/'),
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
  };
}

export function buildHomeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildPersonSchema(), buildWebSiteSchema()],
  };
}

export function buildAboutSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildPersonSchema({ profileUrl: absoluteUrl('/about/') }),
      {
        '@type': 'ProfilePage',
        '@id': absoluteUrl('/about/'),
        url: absoluteUrl('/about/'),
        name: `About ${siteMetadata.author.name}`,
        description: `${siteMetadata.author.name} — ${siteMetadata.subtitle}`,
        mainEntity: { '@id': PERSON_ID },
        inLanguage: 'en-US',
      },
    ],
  };
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function buildBlogPostingSchema(
  entry: CollectionEntry<'blog'>,
  options: { fullUrl: string; heroImageUrl?: string | null },
) {
  const post = entry.data;
  const wordCount = countWords(entry.body);
  const readMinutes = estimateReadTime(entry.body);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${options.fullUrl}#article`,
    headline: post.title,
    description: post.description,
    url: options.fullUrl,
    datePublished: post.date.toISOString(),
    dateModified: post.date.toISOString(),
    inLanguage: 'en-US',
    wordCount,
    timeRequired: `PT${readMinutes}M`,
    articleSection: post.category,
    keywords: post.tags.join(', '),
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.fullUrl,
    },
    isPartOf: { '@id': WEBSITE_ID },
    ...(options.heroImageUrl ? { image: [options.heroImageUrl] } : {}),
  };
}

/** Plain-text article index for llms.txt */
export function formatLlmsArticleList(posts: CollectionEntry<'blog'>[]): string {
  return posts
    .map((post) => {
      const url = absoluteUrl(postPath(post.data.path));
      return `- [${post.data.title}](${url}): ${post.data.description}`;
    })
    .join('\n');
}
