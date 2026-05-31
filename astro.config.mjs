// @ts-check
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

/**
 * Generates the OG image into the build output on every `astro build`, so it
 * stays in sync with public/og-image.svg without committing the PNG.
 * @returns {import('astro').AstroIntegration}
 */
function ogImage() {
  return {
    name: 'og-image',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const { renderOgImage } = await import('./scripts/og-image.mjs');
        const png = await renderOgImage();
        await writeFile(fileURLToPath(new URL('og-image.png', dir)), png);
        logger.info(`generated og-image.png (${png.length} bytes)`);
      },
    },
  };
}

// GitHub Pages（プロジェクトサイト）: https://mariners-conference.github.io/timer/
// https://astro.build/config
export default defineConfig({
  site: 'https://mariners-conference.github.io',
  base: '/timer/',
  integrations: [svelte(), ogImage()]
});
