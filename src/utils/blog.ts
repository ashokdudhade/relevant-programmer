import type { CollectionEntry } from 'astro:content';

export function categorySlug(category: string): string {
  return `/categories/${category.toLowerCase().replace(/\s+/g, '-')}/`;
}

export function postPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function extractFirstImage(body: string): string | null {
  const match = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match?.[1] ?? null;
}

export function getCategoryCounts(
  posts: CollectionEntry<'blog'>[],
): { name: string; count: number; slug: string }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const name = post.data.category;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, slug: categorySlug(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function estimateReadTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
