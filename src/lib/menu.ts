import { products, inPart, PART } from './catalog';
import { u } from './url';

// Плитки разделов для мобильного меню: фото – самый дорогой товар раздела (самый эффектный кадр).
export interface MenuTile { title: string; href: string; img: string; count: number; children: { title: string; href: string }[] }

// Каждой плитке – своё фото: товары, уже стоящие на других плитках, пропускаем.
const used = new Set<string>();
function tile(title: string, part: string): MenuTile {
  const list = products.filter((p) => inPart(p, part));
  const sorted = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  const p = sorted.find((x) => !used.has(x.id)) ?? sorted[0];
  if (p) used.add(p.id);
  return { title, href: u(`/catalog?part=${part}`), img: p ? u(p.images[0] + '-480.webp') : '', count: list.length, children: [] };
}

export const menuTiles: MenuTile[] = [
  tile('Розы', PART.roses),
  tile('Большие букеты', PART.big),
  tile('Кустовые розы', PART.spray),
  tile('Хризантемы', PART.chrys),
  tile('Составные букеты', PART.mix),
  tile('Корзины', PART.baskets),
  tile('Гортензии', PART.hydrangea),
  tile('Свадебные букеты', PART.wedding),
];
