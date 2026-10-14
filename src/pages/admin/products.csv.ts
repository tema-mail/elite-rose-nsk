import { products, partById } from '../../lib/catalog';

// Выгрузка товаров в CSV формата магазина Тильды (разделитель «;», UTF-8 с BOM – открывается в Excel).
const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
export const COLS = ['SKU', 'Category', 'Title', 'Description', 'Text', 'Photo', 'Price', 'Price Old', 'Quantity', 'Mark', 'Url'];

export function GET({ site }: { site: URL }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rows = products.map((p, i) => [
    `ER-${String(i + 1).padStart(4, '0')}`,
    p.parts.map((id) => partById.get(id)?.title).filter(Boolean).join(';'),
    p.title, p.descr, p.text.replace(/<[^>]+>/g, ' ').trim(),
    p.images.map((im) => new URL(`${base}${im}-1000.webp`, site).href).join(' '),
    p.price ?? '', p.priceOld ?? '', p.stock ?? '', p.mark, new URL(`${base}${p.path}`, site).href,
  ].map(q).join(';'));
  return new Response('﻿' + [COLS.join(';'), ...rows].join('\r\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
