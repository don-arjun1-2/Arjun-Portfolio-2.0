import { chromium } from '/root/.bun/install/global/node_modules/playwright-core/index.mjs';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const svgContent = fs.readFileSync(path.resolve('./public/icon.svg'), 'utf-8');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; display: flex; align-items: center; justify-content: center; }
          svg { width: 100vw; height: 100vh; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(htmlContent);
    const outputPath = path.resolve('./public', name);
    await page.screenshot({ path: outputPath, omitBackground: false });
    console.log(`Generated ${name} (${size}x${size})`);
  }

  await browser.close();
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
