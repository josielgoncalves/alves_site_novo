import { SITE } from './site';

export interface Imovel {
  id: number;
  codigo: string;
  negociacao: string;
  descricao: string;
  area_total: string | null;
  area_construida: string | null;
  bairro: string | null;
  quartos: number;
  banheiros: number;
  vagas: number;
  status: string;
  cidade: string;
  cidade_id: number;
  tipo: string;
  destaque: number;
  preco: string;
  titulo: string;
  fotos: string[];
  // derivados
  isRent: boolean;
  sold: boolean;
  citySlug: string;
  typeSlug: string;
  typePlural: string;
  cityLabel: string;
  images: string[];
  priceNum: number;
  priceLabel: string;
}

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase()).replace(/\b(Da|De|Do|Das|Dos)\b/g, (m) => m.toLowerCase());

const PLURAL: Record<string, string> = {
  Casa: 'Casas', Terreno: 'Terrenos', 'Sítio': 'Sítios', Apartamento: 'Apartamentos',
  'Sala Comercial': 'Salas Comerciais', 'Prédio Comercial': 'Prédios Comerciais',
};

export const brl = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

export const imgUrl = (path: string) => `${SITE.api}/public${path}`;

let cache: Imovel[] | null = null;

export async function getImoveis(): Promise<Imovel[]> {
  if (cache) return cache;
  const res = await fetch(`${SITE.api}/imoveis/search?limit=500`);
  if (!res.ok) throw new Error(`API respondeu ${res.status}`);
  const json = await res.json();
  const raw: any[] = json.data.data;
  cache = raw
    .filter((r) => r.status !== 'INATIVO' && Array.isArray(r.fotos))
    .map((r) => {
      const neg = String(r.negociacao).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      const isRent = neg === 'aluguel' || neg === 'locacao';
      const priceNum = Number(r.preco) || 0;
      const images = (r.fotos as string[]).length ? (r.fotos as string[]).map(imgUrl) : [`${SITE.api}/public/placeholder.jpg`];
      let desc = String(r.descricao ?? '').trim();
      if (desc.startsWith('"') && desc.endsWith('"')) desc = desc.slice(1, -1);
      return {
        ...r,
        descricao: desc,
        isRent,
        sold: r.status === 'VENDIDO',
        citySlug: slugify(r.cidade),
        cityLabel: titleCase(r.cidade),
        typeSlug: slugify(PLURAL[r.tipo] ?? r.tipo),
        typePlural: PLURAL[r.tipo] ?? r.tipo + 's',
        images,
        priceNum,
        priceLabel: priceNum === 0 ? 'Sob consulta' : brl(priceNum) + (isRent ? '/mês' : ''),
      } as Imovel;
    });
  return cache;
}

export const available = (l: Imovel[]) => l.filter((i) => !i.sold);

export function groupBy<T>(arr: T[], key: (t: T) => string) {
  const m = new Map<string, T[]>();
  for (const a of arr) m.set(key(a), [...(m.get(key(a)) ?? []), a]);
  return m;
}

/** Texto limpo (sem emojis/quebras) para meta description */
export function plain(s: string, max = 155) {
  const t = s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).replace(/\s\S*$/, '') + '…' : t;
}

export function propertyTitle(i: Imovel) {
  const acao = i.isRent ? 'para alugar' : 'à venda';
  return `${i.tipo}${i.bairro && i.bairro !== i.tipo ? ' ' + i.bairro : ''} ${acao} em ${i.cityLabel}`;
}
