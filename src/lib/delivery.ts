// Условия доставки Elite Rose. В VK: «быстрая доставка по городу от двери до двери»; районы и тарифы не указаны,
// поэтому стоимость вне бесплатного порога подтверждает менеджер. Порог 1 500 ₽ – оффер шаблона (решение владельца 14.10.2026).
export const FREE_FROM = 1500;

export interface Zone { id: string; title: string; price: number | null; note: string; areas: string[] }

export const ZONES: Zone[] = [
  { id: 'center', title: 'По Новосибирску', price: 0, note: `Бесплатно при заказе от ${FREE_FROM.toLocaleString('ru-RU')} ₽`, areas: ['от двери до двери'] },
  { id: 'region', title: 'За городом', price: null, note: 'Возможность и стоимость подтвердит менеджер', areas: ['адрес за пределами Новосибирска'] },
  { id: 'pickup', title: 'Самовывоз', price: 0, note: 'Новосибирск, Линейная ул., 114к2', areas: [] },
];

export const NIGHT = { from: 22, to: 9, note: 'Время после 22:00 и до 9:00 менеджер подтвердит отдельно' };

/** Стоимость доставки для зоны; null – сумму уточнит менеджер. */
export function deliveryPrice(zoneId: string, subtotal: number, night: boolean): number | null {
  if (zoneId === 'pickup') return 0;
  if (night) return null;
  if (zoneId === 'center') return subtotal >= FREE_FROM ? 0 : null;
  return null;
}

/** Интервалы доставки – дневные, по 2 часа (магазин открывается в 9:00). */
export const SLOTS = ['09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00', '21:00–23:00'];
export const isNightSlot = (s: string) => parseInt(s, 10) >= 22 || parseInt(s, 10) < 9;
