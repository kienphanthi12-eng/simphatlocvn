import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simphatlocvn.com'

  // Lấy danh sách sim
  const allSims = await prisma.sim.findMany()
  const availableSims = allSims.filter(s => s.status === 'AVAILABLE')

  const simUrls = availableSims.map((sim) => ({
    url: `${baseUrl}/sims/${sim.phone}`,
    lastModified: sim.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const staticRoutes = [
    '',
    '/sims',
    '/lien-he',
    '/sim-tam-hoa',
    '/sim-tu-quy',
    '/sim-tien-len',
    '/sim-loc-phat',
    '/sim-than-tai',
    '/sim-nam-sinh',
    '/sim-de-nho',
    '/sim-vip',
    '/sim-duoi-1-trieu',
    '/sim-1-3-trieu',
    '/sim-3-10-trieu',
    '/sim-tren-10-trieu',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  return [...staticRoutes, ...simUrls]
}
