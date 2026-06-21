import { readdirSync, mkdirSync } from 'fs';
import { join, relative, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import {
  loadEnv, createStorageZone, formatBytes,
  checkExistsOnServer, uploadFileWithProgress,
  loadStatusFile, saveStatusFile,
} from './uploader.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env        = loadEnv();
const SCAN_ONLY  = process.argv.includes('--scan');
const TEMP_DIR   = join(__dirname, 'temp');
const LOGS_DIR   = join(__dirname, 'logs');
const AUDIO_EXT  = new Set(['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac']);

mkdirSync(LOGS_DIR, { recursive: true });

const storageZone = createStorageZone(env);


function scanFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanFiles(full));
    } else if (entry.isFile() && AUDIO_EXT.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

const statusPath = (f) => join(LOGS_DIR, relative(TEMP_DIR, f) + '.json');
const bunnyPath  = (f) => '/' + relative(TEMP_DIR, f).replace(/\\/g, '/');

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}


async function main() {
  log(`Scanning ${TEMP_DIR} ...`);
  const files = scanFiles(TEMP_DIR);
  log(`Found ${files.length} audio files`);

  let initialised = 0;
  for (const file of files) {
    if (!loadStatusFile(statusPath(file))) {
      const rel = relative(TEMP_DIR, file).replace(/\\/g, '/');
      saveStatusFile(statusPath(file), { file: rel, status: 'incomplete', existsOnServer: false });
      initialised++;
    }
  }
  if (initialised > 0) log(`Initialised ${initialised} new status file(s)`);

  if (SCAN_ONLY) {
    log('--scan mode: no uploads performed.');
    return;
  }

  const counts = { skipped: 0, exists: 0, uploaded: 0, errors: 0 };

  for (let i = 0; i < files.length; i++) {
    const file   = files[i];
    const rel    = relative(TEMP_DIR, file).replace(/\\/g, '/');
    const bPath  = bunnyPath(file);
    const status = loadStatusFile(statusPath(file));
    const prefix = `[${i + 1}/${files.length}]`;

    if (status?.status === 'complete' || status?.status === 'exists') {
      log(`${prefix} SKIP   ${rel}  (${status.status})`);
      counts.skipped++;
      continue;
    }

    log(`${prefix} CHECK  ${rel}`);
    if (await checkExistsOnServer(storageZone, bPath)) {
      log(`${prefix} EXISTS on server`);
      saveStatusFile(statusPath(file), { file: rel, status: 'exists', existsOnServer: true });
      counts.exists++;
      continue;
    }

    const { size } = (await import('fs')).statSync(file);
    log(`${prefix} UPLOAD → ${bPath}  (${formatBytes(size)})`);
    try {
      await uploadFileWithProgress(storageZone, file, bPath);
      log(`${prefix} DONE   ${rel}`);
      saveStatusFile(statusPath(file), {
        file: rel, status: 'complete', existsOnServer: true,
        uploadedAt: new Date().toISOString(),
      });
      counts.uploaded++;
    } catch (err) {
      log(`${prefix} ERROR  ${rel} — ${err.message}`);
      saveStatusFile(statusPath(file), {
        file: rel, status: 'incomplete', existsOnServer: false,
        error: err.message, lastAttempt: new Date().toISOString(),
      });
      counts.errors++;
    }
  }

  log('=== Summary ===');
  log(`Total:    ${files.length}`);
  log(`Skipped:  ${counts.skipped}  (already done)`);
  log(`Exists:   ${counts.exists}   (found on server)`);
  log(`Uploaded: ${counts.uploaded}`);
  log(`Errors:   ${counts.errors}`);
  if (counts.errors > 0) log('Re-run to retry failed uploads.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
