// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// GitHub Pages（プロジェクトサイト）: https://mariners-conference.github.io/timer/
// https://astro.build/config
export default defineConfig({
  site: 'https://mariners-conference.github.io',
  base: '/timer/',
  integrations: [svelte()]
});
