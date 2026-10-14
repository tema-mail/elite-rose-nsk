import { COLS } from './products.csv';

// Шаблон CSV для загрузки товаров: заголовки и одна строка-пример.
export function GET() {
  const ex = ['ER-0100', 'Розы;Большие букеты', 'Букет из 51 розы 60 см', 'Розы: белые, красные и розовые', 'Роза 60 см – 51 шт.; упаковка; лента', 'https://example.ru/photo-1.jpg https://example.ru/photo-2.jpg', '6500', '8650', '', '-25%', ''];
  return new Response('﻿' + COLS.join(';') + '\r\n' + ex.map((v) => `"${v}"`).join(';'), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
