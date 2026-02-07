import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.literal('post').default('post'),
    draft: z.boolean().default(false),
    path: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kind: z.literal('page').optional(),
    path: z.string().optional(),
  }),
});

export const collections = {
  blog,
  pages,
};
