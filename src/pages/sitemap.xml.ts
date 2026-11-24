import type { APIRoute } from 'astro';
import { getImoveis, available, groupBy } from '../lib/api';
import { SITE } from '../lib/site';

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const all = available(await getImoveis());
  const urls: [string, string, number][] = [
    ['/', 'daily', 1.0],
    ['/imoveis', 'daily', 0.9],
    ['/contato', 'monthly', 0.5],
  ];
  for (const [city, ci] of groupBy(all, (i) => i.citySlug)) {
    urls.push([`/imoveis/${city}`, 'weekly', 0.8]);
    for (const type of groupBy(ci, (i) => i.typeSlug).keys()) urls.push([`/imoveis/${city}/${type}`, 'weekly', 0.7]);
  }
  for (const p of all) urls.push([`/imovel/${p.id}`, 'weekly', 0.6]);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(([u, f, pr]) => `  <url><loc>${SITE.url}${u === '/' ? '' : u}</loc><lastmod>${today}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
