const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

// 1. Process white-background cutout
if (fs.existsSync('C:/Users/Thabe/.gemini/antigravity-ide/brain/2f1c5ef8-cb81-4f15-b87b-e17a60e02e60/cat_isolated_cutout_1790230111760.jpg')) {
  const whiteBgJpeg = fs.readFileSync('C:/Users/Thabe/.gemini/antigravity-ide/brain/2f1c5ef8-cb81-4f15-b87b-e17a60e02e60/cat_isolated_cutout_1790230111760.jpg');
  const rawWhite = jpeg.decode(whiteBgJpeg, { useTArray: true });
  console.log('Processing isolated cutout:', rawWhite.width, 'x', rawWhite.height);
}

// 2. Load original Bengal cat banner and perform clean segmentation
const jpegData = fs.readFileSync('C:/Users/Thabe/.gemini/antigravity-ide/brain/2f1c5ef8-cb81-4f15-b87b-e17a60e02e60/bengal_cat_banner_1790229736752.jpg');
const rawImage = jpeg.decode(jpegData, { useTArray: true });

const width = rawImage.width;
const height = rawImage.height;
const png = new PNG({ width, height });

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = rawImage.data[idx];
    const g = rawImage.data[idx + 1];
    const b = rawImage.data[idx + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const brightness = (r + g + b) / 3;

    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;

    // Is it cat fur or eye?
    const isCat = (r > 50 && r > b + 8 && r >= g - 5) || (delta > 15 && brightness > 35) || (g > 60 && g > r + 8);

    // Is it shelf reflection around paw? If brightness is very high in a tiny dark zone or dark background
    if (isCat) {
      png.data[idx + 3] = 255;
    } else {
      png.data[idx + 3] = 0;
    }
  }
}

// Clean up any stray white pixels around the paw by checking neighbor alpha
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const idx = (y * width + x) * 4;
    const a = png.data[idx + 3];
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];

    if (a > 0 && r > 180 && g > 180 && b > 180) {
      // Check if it's surrounded by transparent pixels (shelf edge reflection)
      let transparentNeighbors = 0;
      if (png.data[((y - 1) * width + x) * 4 + 3] === 0) transparentNeighbors++;
      if (png.data[((y + 1) * width + x) * 4 + 3] === 0) transparentNeighbors++;
      if (png.data[(y * width + (x - 1)) * 4 + 3] === 0) transparentNeighbors++;
      if (png.data[(y * width + (x + 1)) * 4 + 3] === 0) transparentNeighbors++;

      if (transparentNeighbors >= 2) {
        png.data[idx + 3] = 0;
      }
    }
  }
}

// Find bounding box
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

fs.writeFileSync('public/images/bengal_cat_cutout.png', PNG.sync.write(cropped));
console.log('Saved clean cutout to public/images/bengal_cat_cutout.png');
