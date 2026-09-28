const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

// Load original Bengal cat JPEG
const jpegData = fs.readFileSync('C:/Users/Thabe/.gemini/antigravity-ide/brain/2f1c5ef8-cb81-4f15-b87b-e17a60e02e60/bengal_cat_banner_1790229736752.jpg');
const rawImage = jpeg.decode(jpegData, { useTArray: true });

const width = rawImage.width;
const height = rawImage.height;
const png = new PNG({ width, height });

// Sample corner background colors (top-left, top-right, bottom-left)
const bgR = 43, bgG = 38, bgB = 45; // ~ #2B262D

// Flood fill or distance-based alpha transparency
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = rawImage.data[idx];
    const g = rawImage.data[idx + 1];
    const b = rawImage.data[idx + 2];

    // Color distance to dark studio background
    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;

    if (dist < 18) {
      // Complete background
      png.data[idx + 3] = 0;
    } else if (dist < 32) {
      // Feathered smooth edge
      const alpha = Math.round(((dist - 18) / (32 - 18)) * 255);
      png.data[idx + 3] = alpha;
    } else {
      // Solid cat
      png.data[idx + 3] = 255;
    }
  }
}

// Ensure public/images directory exists
if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images', { recursive: true });
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('public/images/bengal_cat_cutout.png', buffer);
console.log('Saved transparent Bengal cat PNG to public/images/bengal_cat_cutout.png successfully!');
