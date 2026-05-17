const sharp = require('sharp');
const path = require('path');

const files = ['case-b2c.webp', 'case-logistics.webp', 'case-banking.webp', 'case-forecast.webp'];
const dir = path.join(__dirname, '..', 'public', 'img');

(async () => {
  for (const f of files) {
    const base = f.replace('.webp', '');
    const inPath = path.join(dir, f);
    const outPath = path.join(dir, `${base}-480w.webp`);
    await sharp(inPath).resize(480).toFile(outPath);
    console.log(`Created ${base}-480w.webp`);
  }
})();
