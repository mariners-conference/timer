// Renders public/og-image.svg to a 1200x630 PNG using the bundled fonts in
// .ogfonts/. Used by the Astro build integration (see astro.config.mjs) and
// runnable directly (`pnpm generate:og`) to refresh public/og-image.png locally.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const svgPath = new URL('../public/og-image.svg', import.meta.url);
const fontsDir = fileURLToPath(new URL('../.ogfonts', import.meta.url));

/** Render the OG image and return it as a PNG buffer. */
export async function renderOgImage() {
  const svg = await readFile(svgPath, 'utf-8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: {
      // Bundle our own fonts so output is identical everywhere (CI included).
      fontDirs: [fontsDir],
      loadSystemFonts: false,
      defaultFontFamily: 'IBM Plex Sans',
    },
  });
  return resvg.render().asPng();
}

// When run directly, write into public/ for local dev/preview.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
  const png = await renderOgImage();
  await writeFile(out, png);
  console.log(`Generated ${out} (${png.length} bytes)`);
}
