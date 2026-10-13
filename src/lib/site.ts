// Контакты и навигация Elite Rose – одно место для шапки, меню, подвала и страниц.
// Источник: сообщество VK vk.ru/elite_rose_nsk (14.10.2026). Чего там нет – не выдумываем.
export const SITE = {
  name: 'Elite Rose',
  city: 'Новосибирск',
  cityIn: 'Новосибирску',
  address: 'Линейная ул., 114к2',
  phone: '+7 (923) 151-42-74',
  phoneHref: 'tel:+79231514274',
  // В VK указано только «откроется в 9:00» – время закрытия неизвестно.
  hours: 'Открываемся в 9:00',
  vk: 'https://vk.ru/elite_rose_nsk',
  vkChat: 'https://vk.me/elite_rose_nsk',
  rating: { value: '5,0', count: 33, url: 'https://vk.ru/market-196170263?screen=group' },
  map: 'https://yandex.ru/maps/?text=' + encodeURIComponent('Новосибирск, Линейная улица, 114к2'),
};

export const SOCIALS = [
  { id: 'vk', label: 'ВКонтакте', href: 'https://vk.ru/elite_rose_nsk' },
  { id: 'max', label: 'MAX', href: 'https://max.ru/join/yJyoNYzuKiAPka_iYIL2nSIXJOOmJkjiUqP4VkUBPE0' },
  { id: 'avito', label: 'Авито', href: 'https://www.avito.ru/user/f380e24b1dfd88e79d9ce174f5aa0c6e/profile' },
] as const;

/** Верхнее меню. */
export const NAV = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Розы', href: '/catalog?part=roses' },
  { label: 'Большие букеты', href: '/catalog?part=big' },
  { label: 'Корзины', href: '/catalog?part=baskets' },
  { label: 'Свадебные', href: '/catalog?part=wedding' },
  { label: 'Доставка', href: '/#delivery' },
  { label: 'Контакты', href: '/#contacts' },
];

export const FOOTER = {
  menu: [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Доставка', href: '/#delivery' },
    { label: 'Почему мы', href: '/#preim' },
    { label: 'Контакты', href: '/#contacts' },
  ],
  catalog: [
    { label: 'Розы', href: '/catalog?part=roses' },
    { label: 'Кустовые розы', href: '/catalog?part=spray' },
    { label: 'Хризантемы', href: '/catalog?part=chrys' },
    { label: 'Составные букеты', href: '/catalog?part=mix' },
    { label: 'Корзины', href: '/catalog?part=baskets' },
    { label: 'Свадебные букеты', href: '/catalog?part=wedding' },
  ],
  buyers: [
    { label: 'Избранное', href: '/favorites' },
    { label: 'Корзина', href: '/order' },
  ],
  info: [
    { label: 'Мы во ВКонтакте', href: 'https://vk.ru/elite_rose_nsk' },
    { label: 'Канал в MAX', href: 'https://max.ru/join/yJyoNYzuKiAPka_iYIL2nSIXJOOmJkjiUqP4VkUBPE0' },
  ],
};

// Плитки преимуществ под первым экраном. Иконки – свои (src/islands/icons.tsx, FeatureIcon).
export const FEATURE = {
  wholesale: { icon: 'tag', text: 'Свежие цветы по оптовым ценам' },
  fresh: { icon: 'truck', text: 'Поставки каждые три дня' },
  guarantee: { icon: 'shield', text: 'Гарантия качества 48 часов' },
  delivery: { icon: 'clock', text: 'Доставка по Новосибирску от 60 минут' },
  photo: { icon: 'camera', text: 'Фото букета перед доставкой' },
} as const;
export type FeatureKey = keyof typeof FEATURE;
