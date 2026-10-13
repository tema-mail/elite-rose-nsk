// Товары Elite Rose из раздела «Товары» сообщества VK (снято 14.10.2026 в data-src/vk-products.json)
// → src/data/products.json, src/data/parts.json, фото в public/img/p (webp 480/1000).
// Разделы проставляются по названию товара – в VK у товаров нет машинно читаемых подборок.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IMG = path.join(ROOT, 'public/img/p');
const raw = JSON.parse(await readFile(path.join(ROOT, 'data-src/vk-products.json'), 'utf8'));

export const PARTS = [
  { id: 'roses', title: 'Розы', test: (t) => /роз/i.test(t) && !/кустов/i.test(t) },
  { id: 'spray', title: 'Кустовые розы', test: (t) => /кустов/i.test(t) },
  { id: 'chrys', title: 'Хризантемы', test: (t) => /хризан/i.test(t) },
  { id: 'mix', title: 'Составные букеты', test: (t) => /составн|микс|дофамин|эустом|композиц/i.test(t) },
  { id: 'baskets', title: 'Корзины', test: (t) => /корзин/i.test(t) },
  { id: 'hydrangea', title: 'Гортензии', test: (t) => /гортенз/i.test(t) },
  { id: 'wedding', title: 'Свадебные букеты', test: (t) => /свадеб/i.test(t) },
  { id: 'big', title: 'Большие букеты', test: (t, p) => p >= 15000 || /\b(51|71|101|151|181|201|1001)\b/.test(t) },
];

const fixTitle = (t) => t.replace('хризанетмы', 'хризантемы').replace('Дофаминовый Букет', 'Дофаминовый букет');

await mkdir(IMG, { recursive: true });
const products = [];
for (const [i, r] of raw.entries()) {
  const m = r.url.match(/product\/(.+)-\d+-(\d+)$/);
  const slug = m[1], id = m[2];
  const title = fixTitle(r.title);
  const images = [];
  for (const [n, src] of r.images.entries()) {
    const base = `${id}-${n}`;
    if (!existsSync(path.join(IMG, `${base}-480.webp`))) {
      // VK отдаёт файлы только с браузерным заголовком – качаем curl'ом
      const buf = execFileSync('curl', ['-sL', '-A', 'Mozilla/5.0', src], { maxBuffer: 30e6 });
      for (const w of [480, 1000]) {
        await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(IMG, `${base}-${w}.webp`));
      }
    }
    images.push(`/img/p/${base}`);
  }
  products.push({
    id, path: `/catalog/tproduct/${id}-${slug}`, title, descr: r.descr || '', text: '',
    price: r.price, priceOld: r.priceOld, mark: r.priceOld ? `-${Math.round((1 - r.price / r.priceOld) * 100)}%` : '',
    stock: null, parts: PARTS.filter((p) => p.test(title, r.price)).map((p) => p.id), sort: i, images,
  });
}
await writeFile(path.join(ROOT, 'src/data/products.json'), JSON.stringify(products, null, 1));
await writeFile(path.join(ROOT, 'src/data/parts.json'), JSON.stringify(PARTS.map((p) => ({ id: p.id, title: p.title, parent: null, children: [] })), null, 1));
console.log('товаров', products.length, PARTS.map((p) => `${p.title}: ${products.filter((x) => x.parts.includes(p.id)).length}`).join(', '));
console.log('без раздела:', products.filter((p) => !p.parts.length).map((p) => p.title));
