import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');

const svg = await fs.readFile(path.join(publicDir, 'apple-touch-icon.svg'));

// Generate apple-touch-icon (PNG, 180x180) for iOS < 14
await sharp(svg, { density: 600 })
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));

// Generate favicon-32 PNG
await sharp(svg, { density: 600 })
  .resize(32, 32)
  .png()
  .toFile(path.join(publicDir, 'favicon-32x32.png'));

// Generate favicon-16 PNG
await sharp(svg, { density: 600 })
  .resize(16, 16)
  .png()
  .toFile(path.join(publicDir, 'favicon-16x16.png'));

console.log('Favicons generated.');
