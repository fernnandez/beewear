// eslint-disable-next-line @typescript-eslint/no-require-imports
const { copyFileSync, mkdirSync, existsSync } = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { resolve } = require('path');

const src = resolve(__dirname, '../coverage/badges.svg');
const destDir = resolve(__dirname, '../../.github/assets');
const dest = resolve(destDir, 'coverage-badge.svg');

// Garante que a pasta .github/assets existe
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

copyFileSync(src, dest);
console.log(
  '✅ Badge de cobertura movido para .github/assets/coverage-badge.svg',
);
