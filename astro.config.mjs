import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Адрес сайта для canonical. Своего домена у Elite Rose пока нет – показ на GitHub Pages (PUBLIC_SITE_URL задаёт workflow).
const SITE = process.env.PUBLIC_SITE_URL || 'https://tema-mail.github.io/elite-rose-nsk';
// Подпапка для GitHub Pages (например /milovini-samara), на своём домене – пусто.
const BASE = process.env.PUBLIC_BASE || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [preact()],
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
