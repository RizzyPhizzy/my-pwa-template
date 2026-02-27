#!/usr/bin/env node

/**
 * Simple PNG icon generator for PWA
 * Creates basic colored squares as placeholder icons
 * Uses Node.js built-in zlib — no external dependencies needed
 * Usage: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeData), 0);
  return Buffer.concat([len, typeData, crc]);
}

function makePNG(w, h, r, g, b) {
  // Build raw pixel data (filter byte 0 + RGB per pixel, per row)
  const raw = Buffer.alloc(h * (1 + w * 3));
  let pos = 0;
  for (let y = 0; y < h; y++) {
    raw[pos++] = 0; // no filter
    for (let x = 0; x < w; x++) {
      raw[pos++] = r;
      raw[pos++] = g;
      raw[pos++] = b;
    }
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

  // Compress with Node's zlib
  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

// Purple-blue brand color
const [r, g, b] = [102, 126, 234];

console.log('Generating PWA placeholder icons...\n');

for (const [size, name] of [[192, 'pwa-192x192.png'], [512, 'pwa-512x512.png'], [32, 'favicon.ico']]) {
  const file = path.join(publicDir, name);
  fs.writeFileSync(file, makePNG(size, size, r, g, b));
  console.log(`  Created ${name} (${size}x${size})`);
}

console.log('\nDone! Replace these with your own icons when ready.');
