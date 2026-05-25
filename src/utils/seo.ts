import { siteMetadata } from '../data/site';

export const SITE_URL = siteMetadata.url.replace(/\/$/, '');
export const DEFAULT_DESCRIPTION =
  'Notes on software engineering, AI in production, and building reliable systems that hold up after deploy.';
export const DEFAULT_OG_IMAGE = '/profile-pic.jpg';

/** Build an absolute URL on the production site (trailing slash on paths). */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const pathname = path.startsWith('/') ? path : `/${path}`;
  const withSlash =
    pathname.endsWith('/') || pathname.includes('.') ? pathname : `${pathname}/`;
  return new URL(withSlash, `${SITE_URL}/`).href;
}

/** Resolve a site-relative or absolute image path to an absolute URL for OG/Twitter. */
export function absoluteImageUrl(image?: string | null): string {
  if (!image) return absoluteUrl(DEFAULT_OG_IMAGE);
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return absoluteUrl(image.startsWith('/') ? image : `/${image}`);
}

/** Turn a URL slug segment into a readable label (fallback when no post metadata). */
export function formatTaxonomyName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function taxonomyDescription(label: string, count: number, kind: 'category' | 'tag'): string {
  const noun = kind === 'category' ? 'topic' : 'tag';
  const posts = count === 1 ? '1 article' : `${count} articles`;
  return `${posts} about ${label} on ${siteMetadata.title} — ${DEFAULT_DESCRIPTION}`;
}
