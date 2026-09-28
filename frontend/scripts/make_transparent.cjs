const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const jpegData = fs.readFileSync('C:/Users/Thabe/.gemini/antigravity-ide/brain/2f1c5ef8-cb81-4f15-b87b-e17a60e02e60/bengal_cat_banner_1790229736752.jpg');
const rawImage = jpeg.decode(jpegData, { useTArray: true });

const width = rawImage.width;
const height = rawImage.height;
const png = new PNG({ width, height });

// Sample corner background colors
const bgR = 37, bgG = 34, bgB = 39;

// Calculate color similarity to dark background
// Cat fur is warm orange/brown/black/white, distinct from dark neutral gray (#252227)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = rawImage.data[idx];
    const g = rawImage.data[idx + 1];
    const b = rawImage.data[idx + 2];

    // Saturation and brightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const brightness = (r + g + b) / 3;

    // Is it neutral dark background?
    const isDarkNeutral = delta < 16 && brightness < 52;
    const distToBg = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;

    if (isDarkNeutral || distToBg < 20) {
      png.data[idx + 3] = 0; // Transparent
    } else if (distToBg < 35 && delta < 25) {
      const alpha = Math.round(((distToBg - 20) / 15) * 255);
      png.data[idx + 3] = Math.max(0, Math.min(255, alpha));
    } else {
      png.data[idx + 3] = 255; // Cat body & paw
    }
  }
}

// Find bounding box to crop tightly
let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = png.data[(y * width + x) * 4 + 3];
    if (a > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log('Bounding box:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;
const cropped = new PNG({ width: cropW, height: cropH });

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((y + minY) * width + (x + minX)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    cropped.data[dstIdx] = png.data[srcIdx];
    cropped.data[dstIdx + 1] = png.data[srcIdx + 1];
    cropped.data[dstIdx + 2] = png.data[srcIdx + 2];
    cropped.data[dstIdx + 3] = png.data[srcIdx + 3];
  }
}

const buffer = PNG.sync.write(cropped);
fs.writeFileSync('public/images/bengal_cat_cutout.png', buffer);
console.log('Successfully written tight cropped transparent PNG to public/images/bengal_cat_cutout.png');
