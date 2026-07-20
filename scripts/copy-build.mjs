import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const nestedDirectory = resolve(distDirectory, 'stank-radio');

mkdirSync(nestedDirectory, { recursive: true });

for (const entry of ['index.html', 'songs.json', 'assets', 'images', 'music']) {
  const source = resolve(distDirectory, entry);
  if (!existsSync(source)) continue;

  cpSync(source, resolve(nestedDirectory, entry), {
    recursive: true,
    force: true,
  });
}
