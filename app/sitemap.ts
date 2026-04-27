import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://onyeakuko.online',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: 'https://onyeakuko.online/?category=politics',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: 'https://onyeakuko.online/?category=business',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: 'https://onyeakuko.online/?region=nigeria',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    }
  ]
}
