import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api/', '/_next/'],
            },
            // Explicit allowlist for AI search engines & crawlers
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'OAI-SearchBot',
                    'Google-Extended',
                    'ClaudeBot',
                    'anthropic-ai',
                    'PerplexityBot',
                    'Applebot-Extended',
                    'Bytespider',
                    'CCBot',
                ],
                allow: '/',
                disallow: ['/admin', '/api/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
