const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '..', 'public', 'img');
const files = fs.readdirSync(dir).filter(f => /\.(webp|jpg|png|jpeg)$/i.test(f));

(async () => {
  for (const f of files) {
    const meta = await sharp(path.join(dir, f)).metadata();
    console.log(`${f}: width=${meta.width} height=${meta.height}`);
  }
})();
