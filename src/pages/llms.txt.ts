import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteMetadata } from '../data/site';
import { formatLlmsArticleList } from '../utils/schema';
import { absoluteUrl, DEFAULT_DESCRIPTION } from '../utils/seo';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const body = `# ${siteMetadata.title}

> ${DEFAULT_DESCRIPTION}

## Author
- Name: ${siteMetadata.author.name}
- Role: ${siteMetadata.subtitle}
- About: ${absoluteUrl('/about/')}
- GitHub: https://github.com/${siteMetadata.author.github}
- LinkedIn: https://www.linkedin.com/in/${siteMetadata.author.linkedin}
- X: https://twitter.com/${siteMetadata.author.twitter}

## Primary pages
- Home: ${absoluteUrl('/')}
- All topics: ${absoluteUrl('/categories/')}
- Tags: ${absoluteUrl('/tags/')}
- RSS: ${absoluteUrl('/rss.xml')}

## Articles (newest first)
${formatLlmsArticleList(posts)}

## Topics covered
AI in production, agentic engineering, software architecture, distributed systems, developer tooling, and lessons from shipping production software.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
