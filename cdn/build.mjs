import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT  = join(ROOT, 'build');

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });

// App source
cpSync(join(ROOT, 'watch.mjs'),    join(OUT, 'watch.mjs'));
cpSync(join(ROOT, 'uploader.mjs'), join(OUT, 'uploader.mjs'));

// Minimal production package.json
const { name, version, type, dependencies } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
writeFileSync(join(OUT, 'package.json'), JSON.stringify({ name, version, type, private: true, dependencies }, null, 2));

console.log('Installing production dependencies...');
execSync('npm install --omit=dev --silent', { cwd: OUT, stdio: 'inherit' });

// Installer scripts
cpSync(join(ROOT, 'install.ps1'),   join(OUT, 'install.ps1'));
cpSync(join(ROOT, 'uninstall.ps1'), join(OUT, 'uninstall.ps1'));
cpSync(join(ROOT, 'winsw.xml'),     join(OUT, 'winsw.xml'));

// Bake in credentials from developer's .env — client only needs to set WATCH_FOLDER
cpSync(join(ROOT, '.env'), join(OUT, '.env'));

// winsw.exe
const winswSrc = join(ROOT, 'bin', 'winsw.exe');
if (existsSync(winswSrc)) {
  cpSync(winswSrc, join(OUT, 'winsw.exe'));
  console.log('winsw.exe included');
} else {
  console.warn('WARNING: cdn/bin/winsw.exe not found — download WinSW-x64.exe from https://github.com/winsw/winsw/releases, rename to winsw.exe and place it in cdn/bin/');
}

console.log(`\nBuild ready: ${OUT}`);
