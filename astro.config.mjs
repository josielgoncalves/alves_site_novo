import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://alvesnegociosimob.com.br',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'viewport' },
  image: {
    domains: ['api.alvesnegociosimob.com.br'],
    remotePatterns: [{ protocol: 'https', hostname: 'api.alvesnegociosimob.com.br' }],
  },
  vite: { plugins: [tailwindcss()] },
});
