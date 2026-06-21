import chokidar from 'chokidar';
import { statSync, mkdirSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  loadEnv, createStorageZone, formatBytes,
  checkExistsOnServer, uploadFileWithProgress,
  loadStatusFile, saveStatusFile,
} from './uploader.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = loadEnv();

function argAfter(flag) {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : null;
}

const WATCH_FOLDER = argAfter('--folder') || env.WATCH_FOLDER;
if (!WATCH_FOLDER) {
  console.error(
    'No folder specified.\n' +
    'Usage:  node watch.mjs --folder "C:\\path\\to\\audio"\n' +
    '        or set WATCH_FOLDER in cdn/.env',
  );
  process.exit(1);
}

const REMOTE_PREFIX = (argAfter('--prefix') || env.WATCH_REMOTE_PREFIX || '')
  .replace(/\/+$/, '');

const LOGS_DIR = join(__dirname, 'logs', 'watch');
const AUDIO_EXT = new Set(['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac']);

mkdirSync(LOGS_DIR, { recursive: true });

const storageZone = createStorageZone(env);


function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function statusPath(localFile) {
  return join(LOGS_DIR, relative(WATCH_FOLDER, localFile).replace(/\\/g, '/') + '.json');
}

function remotePath(localFile) {
  const rel = relative(WATCH_FOLDER, localFile).replace(/\\/g, '/');
  return REMOTE_PREFIX ? `${REMOTE_PREFIX}/${rel}` : `/${rel}`;
}


const queue   = [];
const queued  = new Set();
let   running = false;

function enqueue(localFile) {
  if (queued.has(localFile)) return;
  queued.add(localFile);
  queue.push(localFile);
  drain();
}

async function drain() {
  if (running) return;
  running = true;
  while (queue.length > 0) {
    const file = queue.shift();
    queued.delete(file);
    await processFile(file);
  }
  running = false;
}

async function processFile(localFile) {
  const rel    = relative(WATCH_FOLDER, localFile).replace(/\\/g, '/');
  const sPath  = statusPath(localFile);
  const rPath  = remotePath(localFile);
  const status = loadStatusFile(sPath);

  if (status?.status === 'complete' || status?.status === 'exists') {
    log(`SKIP   ${rel}  (${status.status})`);
    return;
  }

  log(`CHECK  ${rel}`);
  if (await checkExistsOnServer(storageZone, rPath)) {
    log(`EXISTS ${rel}`);
    saveStatusFile(sPath, { file: rel, status: 'exists', existsOnServer: true });
    return;
  }

  const fileSize = statSync(localFile).size;
  log(`UPLOAD ${rel}  (${formatBytes(fileSize)})`);
  try {
    await uploadFileWithProgress(storageZone, localFile, rPath);
    log(`DONE   ${rel}`);
    saveStatusFile(sPath, {
      file: rel, status: 'complete', existsOnServer: true,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err) {
    log(`ERROR  ${rel} — ${err.message}`);
    saveStatusFile(sPath, {
      file: rel, status: 'incomplete', existsOnServer: false,
      error: err.message, lastAttempt: new Date().toISOString(),
    });
  }
}


async function main() {
  log(`Starting watcher`);
  log(`  Watch folder : ${WATCH_FOLDER}`);
  log(`  Remote prefix: ${REMOTE_PREFIX || '/'}`);
  log(`  Status logs  : ${LOGS_DIR}`);
  log('');

  const watcher = chokidar.watch(WATCH_FOLDER, {
    ignored: /(^|[/\\])\./,
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
  });

  watcher
    .on('add', (filePath) => {
      if (!AUDIO_EXT.has(extname(filePath).toLowerCase())) return;
      log(`DETECTED ${relative(WATCH_FOLDER, filePath).replace(/\\/g, '/')}`);
      enqueue(filePath);
    })
    .on('ready', () => {
      log('Initial scan queued — watching for new files (Ctrl+C to stop)');
    })
    .on('error', (err) => log(`Watcher error: ${err.message}`));

  // Graceful shutdown
  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, async () => {
      log('Shutting down...');
      await watcher.close();
      process.exit(0);
    });
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
