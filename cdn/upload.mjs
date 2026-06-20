/**
 * Resumable upload script: cdn/temp → Bunny Storage
 *
 * Usage:
 *   node upload.mjs           # upload all pending files
 *   node upload.mjs --scan    # only initialise status files, no uploads
 *
 * State: cdn/logs/<year>/<filename>.json per file, persisted between runs.
 * Status values:
 *   "incomplete" – not yet uploaded (initial state)
 *   "exists"     – file was found on the server, skipping
 *   "complete"   – successfully uploaded this run
 */

import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, createReadStream, statSync } from 'fs';
import { join, relative, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { Transform } from 'stream';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Load cdn/.env manually (no dotenv dependency)
// ---------------------------------------------------------------------------
function loadEnv(envPath) {
  const out = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const env = loadEnv(join(__dirname, '.env'));
const STORAGE_ZONE = env.TARGET_BUNNY_STORAGE_ZONE;
const API_KEY      = env.TARGET_BUNNY_API_KEY;
const REGION       = (env.TARGET_BUNNY_REGION || 'falkenstein').toLowerCase();

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

if (!STORAGE_ZONE || !API_KEY) {
  console.error('Missing TARGET_BUNNY_STORAGE_ZONE or TARGET_BUNNY_API_KEY in cdn/.env');
  process.exit(1);
}

const SCAN_ONLY = process.argv.includes('--scan');
const AUDIO_EXTENSIONS = new Set(['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac']);

const TEMP_DIR = join(__dirname, 'temp');
const LOGS_DIR = join(__dirname, 'logs');

mkdirSync(LOGS_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Bunny connection
// ---------------------------------------------------------------------------
const storageZone = BunnyStorageSDK.zone.connect_with_accesskey(
  REGION_MAP[REGION] ?? BunnyStorageSDK.regions.StorageRegion.Falkenstein,
  STORAGE_ZONE,
  API_KEY,
);

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------
function scanFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanFiles(full));
    } else if (entry.isFile() && AUDIO_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function statusPath(sourceFile) {
  const rel = relative(TEMP_DIR, sourceFile);
  return join(LOGS_DIR, rel + '.json');
}

function bunnyPath(sourceFile) {
  return '/' + relative(TEMP_DIR, sourceFile).replace(/\\/g, '/');
}

function loadStatus(sourceFile) {
  const p = statusPath(sourceFile);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function saveStatus(sourceFile, data) {
  const p = statusPath(sourceFile);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2));
}

async function existsOnServer(path) {
  try {
    await BunnyStorageSDK.file.get(storageZone, path);
    return true;
  } catch {
    return false;
  }
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------
const BAR_WIDTH = 28;

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024)        return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function renderBar(sent, total) {
  const pct     = total > 0 ? Math.min(sent / total, 1) : 0;
  const filled  = Math.round(pct * BAR_WIDTH);
  const bar     = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
  const pctStr  = (pct * 100).toFixed(1).padStart(5);
  process.stdout.write(
    `\r  [${bar}] ${pctStr}%  ${formatBytes(sent).padStart(9)} / ${formatBytes(total)}   `,
  );
}

function makeProgressStream(totalBytes) {
  let sent = 0;
  return new Transform({
    transform(chunk, _enc, cb) {
      sent += chunk.length;
      renderBar(sent, totalBytes);
      cb(null, chunk);
    },
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  log(`Scanning ${TEMP_DIR} ...`);
  const files = scanFiles(TEMP_DIR);
  log(`Found ${files.length} audio files`);

  // Phase 1 — initialise status files for any new files
  let initialised = 0;
  for (const file of files) {
    if (!loadStatus(file)) {
      const rel = relative(TEMP_DIR, file).replace(/\\/g, '/');
      saveStatus(file, { file: rel, status: 'incomplete', existsOnServer: false });
      initialised++;
    }
  }
  if (initialised > 0) log(`Initialised ${initialised} new status file(s)`);

  if (SCAN_ONLY) {
    log('--scan mode: no uploads performed.');
    return;
  }

  // Phase 2 — upload
  const counts = { skipped: 0, exists: 0, uploaded: 0, errors: 0 };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rel  = relative(TEMP_DIR, file).replace(/\\/g, '/');
    const bPath = bunnyPath(file);
    const status = loadStatus(file);
    const prefix = `[${i + 1}/${files.length}]`;

    // Already done in a previous run
    if (status?.status === 'complete' || status?.status === 'exists') {
      log(`${prefix} SKIP  ${rel}  (${status.status})`);
      counts.skipped++;
      continue;
    }

    log(`${prefix} CHECK ${rel}`);

    const alreadyThere = await existsOnServer(bPath);
    if (alreadyThere) {
      log(`${prefix} EXISTS on server`);
      saveStatus(file, { file: rel, status: 'exists', existsOnServer: true });
      counts.exists++;
      continue;
    }

    const fileSize = statSync(file).size;
    log(`${prefix} UPLOAD → ${bPath}  (${formatBytes(fileSize)})`);
    try {
      const progress = makeProgressStream(fileSize);
      createReadStream(file).pipe(progress);
      await BunnyStorageSDK.file.upload(storageZone, bPath, progress);
      process.stdout.write('\n');
      log(`${prefix} DONE  ${rel}`);
      saveStatus(file, {
        file: rel,
        status: 'complete',
        existsOnServer: true,
        uploadedAt: new Date().toISOString(),
      });
      counts.uploaded++;
    } catch (err) {
      process.stdout.write('\n');
      log(`${prefix} ERROR ${rel} — ${err.message}`);
      saveStatus(file, {
        file: rel,
        status: 'incomplete',
        existsOnServer: false,
        error: err.message,
        lastAttempt: new Date().toISOString(),
      });
      counts.errors++;
    }
  }

  log('=== Summary ===');
  log(`Total:    ${files.length}`);
  log(`Skipped:  ${counts.skipped}  (already complete/exists)`);
  log(`Exists:   ${counts.exists}   (found on server)`);
  log(`Uploaded: ${counts.uploaded}`);
  log(`Errors:   ${counts.errors}`);

  if (counts.errors > 0) {
    log('Re-run the script to retry failed uploads.');
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
