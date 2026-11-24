#!/usr/bin/env node
/**
 * Menyusun index.html dari src/index.template.html dan partials di src/partials/.
 * Tanpa dependency: cukup Node.js.
 *
 *   node scripts/build.js          build sekali
 *   node scripts/build.js --watch  build ulang otomatis saat src/ berubah
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'src', 'index.template.html');
const outputPath = path.join(root, 'index.html');
const includePattern = /^[ \t]*<!--\s*@include\s+([^\s]+)\s*-->\r?\n/gm;

function resolvePartial(name) {
  if (name.startsWith('/') || name.split(/[\\/]/).includes('..')) {
    throw new Error(`Path partial tidak valid: ${name}`);
  }
  return path.join(root, 'src', name);
}

function build() {
  const template = fs.readFileSync(templatePath, 'utf8');
  const output = template.replace(includePattern, (_match, name) => {
    const partialPath = resolvePartial(name);
    if (!fs.existsSync(partialPath)) {
      throw new Error(`Partial tidak ditemukan: ${name}`);
    }
    return fs.readFileSync(partialPath, 'utf8').replace(/\r\n/g, '\n');
  });

  if (/<!--\s*@include\b/.test(output)) {
    throw new Error('Masih ada penanda @include yang belum terselesaikan.');
  }

  fs.writeFileSync(outputPath, output);
  console.log(`✓ index.html dibangun (${output.split('\n').length - 1} baris)`);
}

build();

if (process.argv.includes('--watch')) {
  fs.watch(path.join(root, 'src'), { recursive: true }, (_event, filename) => {
    if (filename && filename.endsWith('.html')) build();
  });
  console.log('👀 Watch aktif. Tekan Ctrl+C untuk berhenti.');
}
