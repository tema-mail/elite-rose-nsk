import productsJson from '../data/products.json';
import partsJson from '../data/parts.json';

export interface Product {
  id: string;
  path: string;
  title: string;
  descr: string;
  text: string;
  price: number | null;
  priceOld: number | null;
  mark: string;
  stock: number | null;
  parts: string[];
  sort: number;
  images: string[];
  sku?: string;
  /** Выключен в админке – на сайте не показывается, страница товара не собирается. */
  hidden?: boolean;
}
export interface Part { id: string; title: string; parent: string | null; children: Part[] }

/** Карточка товара для островов: только то, что нужно сетке и корзине. */
export interface Card {
  id: string; path: string; title: string; descr: string;
  price: number; priceOld: number | null; mark: string; img: string; img2?: string;
  parts: string[]; stock: number | null;
}

/** Все товары, включая скрытые – для админки. */
export const allProducts = productsJson as Product[];
/** Товары, которые видны на сайте. */
export const products = allProducts.filter((p) => !p.hidden);
export const parts = partsJson as Part[];

const flat: Part[] = [];
const walk = (ps: Part[]) => ps.forEach((p) => { flat.push(p); walk(p.children); });
walk(parts);
export const partById = new Map(flat.map((p) => [p.id, p]));

/** id раздела и всех его подразделов. */
export function partIds(id: string): Set<string> {
  const out = new Set<string>();
  const add = (p?: Part) => { if (!p) return; out.add(p.id); p.children.forEach(add); };
  add(partById.get(id));
  return out;
}

export function inPart(p: Product, id: string): boolean {
  const ids = partIds(id);
  return p.parts.some((x) => ids.has(x));
}

export const toCard = (p: Product): Card => ({
  id: p.id, path: p.path, title: p.title, descr: p.descr,
  price: p.price ?? 0, priceOld: p.priceOld, mark: p.mark,
  img: p.images[0] ?? '', img2: p.images[1], parts: p.parts, stock: p.stock,
});

export const rub = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

// Разделы Elite Rose (проставляет scripts/import-vk.mjs по названию товара).
export const PART = {
  roses: 'roses', spray: 'spray', chrys: 'chrys', mix: 'mix', baskets: 'baskets',
  hydrangea: 'hydrangea', wedding: 'wedding', big: 'big',
} as const;

/** Допродажи (открытки, игрушки) у Elite Rose в VK нет – блок на странице заказа не показывается. */
export const addonParts: string[] = [];

/** Чип фильтра для острова Catalog: раздел со всеми подразделами. */
export interface Chip { id: string; title: string; ids: string[]; children?: Chip[] }
export function chip(id: string, title?: string, withChildren = true): Chip {
  const p = partById.get(id)!;
  return {
    id, title: title ?? p.title, ids: [...partIds(id)],
    children: withChildren && p.children.length ? p.children.map((c) => chip(c.id, undefined, false)) : undefined,
  };
}
/** Чипы общего каталога – все разделы магазина. */
export const allChips = (): Chip[] => parts.map((p) => chip(p.id));

/** Товары страницы-каталога: раздел (с подразделами) или совпадение в названии. */
export function catalogCards(part: string, match?: string): Card[] {
  return products
    .filter((p) => p.images.length && p.price && (inPart(p, part) || (match ? p.title.includes(match) : false)))
    .map(toCard);
}
