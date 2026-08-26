import { MetadataRoute } from 'next';
import { INITIAL_PROGRAMS, INITIAL_TRAINERS } from '@/services/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ironforgefitness.com';

  const staticRoutes = [
    '',
    '/about',
    '/programs',
    '/membership',
    '/trainers',
    '/workouts',
    '/bmi-calculator',
    '/calorie-calculator',
    '/contact',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const programRoutes = INITIAL_PROGRAMS.map((p) => ({
    url: `${baseUrl}/programs/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const trainerRoutes = INITIAL_TRAINERS.map((t) => ({
    url: `${baseUrl}/trainers/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes, ...trainerRoutes];
}
