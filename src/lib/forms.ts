// Приёма заявок на сервере у Elite Rose нет – заказы они принимают в личных сообщениях VK и по телефону.
// Поэтому форма собирает заявку в готовый текст, копирует его и открывает переписку с магазином в VK
// (страница «Спасибо» показывает текст и кнопки). Подключить почту/Telegram – заменить ORDER_CHANNEL.
import { u } from './url';
import { SITE } from './site';

export const ORDER_CHANNEL = 'vk-chat' as const;
const KEY = 'er_last_message';

export async function sendForm(formName: string, fields: Record<string, string>): Promise<boolean> {
  const text = [`Заявка с сайта: ${formName}`, ...Object.entries(fields).filter(([k, v]) => v && k !== 'Согласие' && k !== 'Agree').map(([k, v]) => `${k}: ${v}`)].join('\n');
  try { sessionStorage.setItem(KEY, text); } catch {}
  try { await navigator.clipboard.writeText(text); } catch { /* браузер не дал доступ – текст покажем на странице «Спасибо» */ }
  return true;
}

export const lastMessage = () => { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } };
export const vkChat = SITE.vkChat;
/** Адрес «Спасибо» с учётом подпапки на Pages. */
export const thanksUrl = () => u('/thanks');
