import { products, parts, inPart } from './catalog';
import { u } from './url';

// Плитки разделов для мобильного меню строятся из parts.json – раздел, добавленный в админке,
// появляется в меню сам. Фото – самый дорогой видимый товар раздела, без повторов между плитками.
export interface MenuTile { title: string; href: string; img: string; count: number; children: { title: string; href: string }[] }

const used = new Set<string>();
export const menuTiles: MenuTile[] = parts
  .map((pt) => {
    const list = products.filter((p) => inPart(p, pt.id));
    const sorted = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    const p = sorted.find((x) => !used.has(x.id)) ?? sorted[0];
    if (p) used.add(p.id);
    return { title: pt.title, href: u(`/catalog?part=${pt.id}`), img: p ? u(p.images[0] + '-480.webp') : '', count: list.length, children: [] };
  })
  .filter((t) => t.count > 0);
