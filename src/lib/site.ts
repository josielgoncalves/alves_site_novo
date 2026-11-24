export const SITE = {
  name: 'Alves Negócios Imobiliários',
  short: 'Alves Imobiliária',
  url: 'https://alvesnegociosimob.com.br',
  creci: 'CRECI-RS 079504-F',
  phone: '(51) 99813-6624',
  phoneIntl: '5551998136624',
  phone2: '(51) 99884-9654',
  email: 'comercial.alvesimobiliaria@gmail.com',
  instagram: 'https://www.instagram.com/marialves_corretora/',
  hours: 'Seg a Sex: 9h às 18h · Sáb: 9h às 13h',
  region: 'Vale do Paranhana e Litoral Norte do RS',
  api: 'https://api.alvesnegociosimob.com.br',
};

export const wa = (msg: string, phone = SITE.phoneIntl) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
