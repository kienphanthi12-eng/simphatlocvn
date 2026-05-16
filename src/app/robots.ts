import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simphatlocvn.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/sims/', '/sim-'],
      disallow: ['/admin/', '/api/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
