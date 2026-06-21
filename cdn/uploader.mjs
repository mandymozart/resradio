import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync, createReadStream, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Transform } from 'stream';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadEnv() {
  const out = {};
  for (const line of readFileSync(join(__dirname, '.env'), 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const REGION_MAP = {
  falkenstein: BunnyStorageSDK.regions.StorageRegion.Falkenstein,
  uk:          BunnyStorageSDK.regions.StorageRegion.UK,
  ny:          BunnyStorageSDK.regions.StorageRegion.NY,
  la:          BunnyStorageSDK.regions.StorageRegion.LA,
  sg:          BunnyStorageSDK.regions.StorageRegion.SG,
  se:          BunnyStorageSDK.regions.StorageRegion.SE,
  br:          BunnyStorageSDK.regions.StorageRegion.BR,
  jh:          BunnyStorageSDK.regions.StorageRegion.JH,
  syd:         BunnyStorageSDK.regions.StorageRegion.SYD,
};

export function createStorageZone(env) {
  const region = (env.TARGET_BUNNY_REGION || 'falkenstein').toLowerCase();
  if (!env.TARGET_BUNNY_STORAGE_ZONE || !env.TARGET_BUNNY_API_KEY) {
    throw new Error('Missing TARGET_BUNNY_STORAGE_ZONE or TARGET_BUNNY_API_KEY in .env');
  }
  return BunnyStorageSDK.zone.connect_with_accesskey(
    REGION_MAP[region] ?? BunnyStorageSDK.regions.StorageRegion.Falkenstein,
    env.TARGET_BUNNY_STORAGE_ZONE,
    env.TARGET_BUNNY_API_KEY,
  );
}

const BAR_WIDTH = 28;

export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024)        return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function makeProgressStream(totalBytes) {
  let sent = 0;
  return new Transform({
    transform(chunk, _enc, cb) {
      sent += chunk.length;
      const pct    = totalBytes > 0 ? Math.min(sent / totalBytes, 1) : 0;
      const filled = Math.round(pct * BAR_WIDTH);
      const bar    = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
      process.stdout.write(
        `\r  [${bar}] ${(pct * 100).toFixed(1).padStart(5)}%  ${formatBytes(sent).padStart(9)} / ${formatBytes(totalBytes)}   `,
      );
      cb(null, chunk);
    },
  });
}

export async function checkExistsOnServer(storageZone, remotePath) {
  try {
    await BunnyStorageSDK.file.get(storageZone, remotePath);
    return true;
  } catch {
    return false;
  }
}

export async function uploadFileWithProgress(storageZone, localPath, remotePath) {
  const fileSize = statSync(localPath).size;
  const progress = makeProgressStream(fileSize);
  createReadStream(localPath).pipe(progress);
  try {
    await BunnyStorageSDK.file.upload(storageZone, remotePath, progress);
  } finally {
    process.stdout.write('\n');
  }
  return fileSize;
}

export function loadStatusFile(statusPath) {
  if (!existsSync(statusPath)) return null;
  try { return JSON.parse(readFileSync(statusPath, 'utf8')); } catch { return null; }
}

export function saveStatusFile(statusPath, data) {
  mkdirSync(dirname(statusPath), { recursive: true });
  writeFileSync(statusPath, JSON.stringify(data, null, 2));
}
