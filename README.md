# Alves Negócios Imobiliários — site (Astro)

Site estático (SSG) que consome a API existente `https://api.alvesnegociosimob.com.br` **em tempo de build**.

    npm install
    npm run dev       # desenvolvimento
    npm run build     # gera ./dist (163+ páginas, imagens em WebP)

## Atualização dos imóveis
Como é estático, novos imóveis/alterações só aparecem após um novo build. Agende um cron ou chame o build via webhook:

    */30 * * * * cd /var/www/mari_alves_site && npm run build >> build.log 2>&1

## Nginx (URLs sem .html)
    root /var/www/mari_alves_site/dist;
    location / { try_files $uri $uri.html $uri/index.html =404; }
    error_page 404 /404.html;
    location /_astro/ { add_header Cache-Control "public, max-age=31536000, immutable"; }

## SEO
- `/imovel/:id` mantém as URLs do site antigo. Vendidos ficam `noindex` e fora do sitemap.
- Landing pages: `/imoveis/{cidade}` e `/imoveis/{cidade}/{tipo}`.
- JSON-LD (RealEstateAgent, RealEstateListing, BreadcrumbList, FAQPage), `/sitemap.xml`, canonical e OG.

## Deploy automático (GitHub Actions → Hostinger)
Workflow: `.github/workflows/deploy.yml` (build a cada push, a cada 30 min, manual e via webhook).
Secrets necessários (Settings → Secrets and variables → Actions):
`SSH_HOST`, `SSH_PORT` (Hostinger: 65002), `SSH_USER`, `SSH_KEY` (chave privada), `SSH_PATH` (ex.: /home/USUARIO/domains/alvesnegociosimob.com.br/public_html).
Webhook (dashboard/API chamam após criar/editar/vender imóvel):
    curl -X POST -H "Authorization: Bearer <TOKEN_GITHUB>" -H "Accept: application/vnd.github+json" \
      https://api.github.com/repos/<USUARIO>/<REPO>/dispatches -d '{"event_type":"imoveis-atualizados"}'
