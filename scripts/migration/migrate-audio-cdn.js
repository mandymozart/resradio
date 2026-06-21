#!/usr/bin/env node
/**
 * Migrates broadcast audio URLs from the old server to the new BunnyCDN.
 *
 * Old: https://res-audio.viennastruggle.at/...
 * New: https://cdn.res.radio/...
 *
 * Usage:
 *   npx tsx migrate-audio-cdn.js
 *   npx tsx migrate-audio-cdn.js --dry-run    # validate CDN only, no writes
 *   npx tsx migrate-audio-cdn.js --force      # reprocess cdn_missing / api_error docs
 *
 * URL auto-fixes applied before CDN check:
 *   - Date format:  YYYY-MM-DD-filename → YYYYMMDDfilename
 *   - Double ext:   .mp3.mp3 → .mp3
 *   - Wrong ext:    .mp3v → .mp3
 *   - Missing dot:  filename ends with mp3 but no dot → .mp3
 *
 * Manual corrections live in force/migration.log (one mapping per line):
 *   <old-res-audio-url> to <correct-cdn-url>
 * When a CDN miss still occurs after auto-fix, the script checks this file.
 * If no match found, prompts for a URL and saves the answer for future runs.
 *
 * State is persisted to migrations/migrate-audio-cdn-state.json.
 * Documents with status "updated" are skipped on re-runs unless --force is set.
 *
 * Note: changes are staged in a Prismic migration release and must be
 * published via the Prismic dashboard after this script completes.
 *
 * Required env vars (in ../../.env):
 *   PRISMIC_ACCESS_TOKEN   Read token — Prismic dashboard › API & Security
 *   PRISMIC_WRITE_TOKEN    Permanent write token — same page
 *
 * Optional env vars:
 *   PRISMIC_REPOSITORY     defaults to "resradio"
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'fs';
import https from 'https';
import readline from 'readline';
import * as prismic from '@prismicio/client';

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(__dirname, '.env') });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const OLD_BASE   = 'https://res-audio.viennastruggle.at';
const NEW_BASE   = 'https://cdn.res.radio';
const REPOSITORY = process.env.PRISMIC_REPOSITORY  || 'resradio';
const ACCESS_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;
const WRITE_TOKEN  = process.env.PRISMIC_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE   = process.argv.includes('--force');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const MIGRATIONS_DIR        = join(__dirname, 'migrations');
const LOG_DIR               = join(__dirname, 'logs');
const FORCE_DIR             = join(__dirname, 'force');
const FORCE_CANDIDATES_FILE = join(FORCE_DIR, 'migration.log');

for (const dir of [MIGRATIONS_DIR, LOG_DIR, FORCE_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

const RUN_TS    = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const STATE_FILE = join(MIGRATIONS_DIR, 'migrate-audio-cdn-state.json');
const LOG_FILE   = join(LOG_DIR, `migrate-audio-cdn_${RUN_TS}.log`);

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

function log(level, msg, extra) {
  const ts   = new Date().toISOString();
  const tail = extra !== undefined
    ? ' ' + (typeof extra === 'object' ? JSON.stringify(extra) : extra)
    : '';
  const line = `[${ts}] [${level.padEnd(5)}] ${msg}${tail}`;
  console.log(line);
  logStream.write(line + '\n');
}

const logger = {
  info:  (m, x) => log('INFO',  m, x),
  warn:  (m, x) => log('WARN',  m, x),
  error: (m, x) => log('ERROR', m, x),
  ok:    (m, x) => log('OK',    m, x),
  skip:  (m, x) => log('SKIP',  m, x),
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { startedAt: new Date().toISOString(), processed: {} };
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    logger.warn('Could not parse state file — starting fresh.');
    return { startedAt: new Date().toISOString(), processed: {} };
  }
}

function saveState(state) {
  state.lastRunAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ---------------------------------------------------------------------------
// URL normalization
// ---------------------------------------------------------------------------
function normalizeNewUrl(url) {
  let u = url;
  u = u.replace(/(\d{4})-(\d{2})-(\d{2})-/g, '$1$2$3-'); // YYYY-MM-DD- → YYYYMMDD-
  u = u.replace(/\.mp3v$/i, '.mp3');                       // wrong extension
  u = u.replace(/([^.])mp3$/i, '$1.mp3');                  // missing dot before mp3
  return u;
}

// ---------------------------------------------------------------------------
// Force candidates — force/migration.log
// Format per line: <old-res-audio-url> to <correct-cdn-url>
// ---------------------------------------------------------------------------
function loadForceCandidates() {
  if (!fs.existsSync(FORCE_CANDIDATES_FILE)) return {};
  const map = {};
  for (const line of fs.readFileSync(FORCE_CANDIDATES_FILE, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(' to ');
    if (idx === -1) continue;
    const wrong   = trimmed.slice(0, idx).trim();
    const correct = trimmed.slice(idx + 4).trim();
    if (wrong && correct) map[wrong] = correct;
  }
  return map;
}

function appendForceCandidate(wrongUrl, correctUrl) {
  fs.appendFileSync(FORCE_CANDIDATES_FILE, `${wrongUrl} to ${correctUrl}\n`);
  logger.info('Saved to force/migration.log', { wrongUrl, correctUrl });
}

// ---------------------------------------------------------------------------
// Interactive prompt
// ---------------------------------------------------------------------------
function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

// ---------------------------------------------------------------------------
// CDN check
// ---------------------------------------------------------------------------
function checkUrl(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD' }, res => {
      resolve({ exists: res.statusCode < 400, status: res.statusCode });
    });
    req.setTimeout(15_000, () => { req.destroy(); resolve({ exists: false, status: null, error: 'timeout' }); });
    req.on('error', err => resolve({ exists: false, status: null, error: err.message }));
    req.end();
  });
}

// ---------------------------------------------------------------------------
// URL resolution: normalization → force candidate → user prompt
// ---------------------------------------------------------------------------
async function resolveUrl(rawNewUrl, oldUrl, label, forceCandidates) {
  const normalizedUrl = normalizeNewUrl(rawNewUrl);

  if (normalizedUrl !== rawNewUrl) {
    logger.info(`${label} URL auto-fixed`, { from: rawNewUrl, to: normalizedUrl });
  }

  // 1. Normalized URL
  let cdn = await checkUrl(normalizedUrl);
  if (cdn.exists) return { url: normalizedUrl };

  logger.warn(`${label} CDN miss (HTTP ${cdn.status ?? cdn.error})`, { url: normalizedUrl });

  // 2. Force candidate — keyed by original old URL from Prismic
  const candidate = forceCandidates[oldUrl];
  if (candidate) {
    logger.info(`${label} trying force candidate`, { candidate });
    cdn = await checkUrl(candidate);
    if (cdn.exists) {
      logger.ok(`${label} force candidate resolved`, { url: candidate });
      return { url: candidate };
    }
    logger.warn(`${label} force candidate not found (HTTP ${cdn.status ?? cdn.error})`, { candidate });
  }

  // 3. User prompt (skipped in dry-run)
  if (DRY_RUN) return null;

  const answer = await prompt(
    `  No CDN match for ${label}.\n  Old URL: ${oldUrl}\n  Enter correct new URL (or Enter to skip): `
  );
  if (!answer) return null;

  cdn = await checkUrl(answer);
  if (cdn.exists) {
    appendForceCandidate(oldUrl, answer);
    return { url: answer };
  }

  logger.error(`${label} manual URL not found — skipping`, { answer });
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  logger.info('=== migrate-audio-cdn starting ===', {
    repository: REPOSITORY, oldBase: OLD_BASE, newBase: NEW_BASE, dryRun: DRY_RUN, force: FORCE,
  });

  const envPath = resolve(__dirname, '../../.env');
  logger.info('.env loaded from', envPath);
  logger.info('PRISMIC_ACCESS_TOKEN', ACCESS_TOKEN ? `${ACCESS_TOKEN.slice(0, 6)}…${ACCESS_TOKEN.slice(-4)}` : 'NOT SET');
  logger.info('PRISMIC_WRITE_TOKEN ', WRITE_TOKEN  ? `${WRITE_TOKEN.slice(0, 6)}…${WRITE_TOKEN.slice(-4)}`  : 'NOT SET');
  logger.info('PRISMIC_REPOSITORY  ', REPOSITORY);

  if (!ACCESS_TOKEN) {
    logger.error('PRISMIC_ACCESS_TOKEN is not set. Add it to .env and retry.');
    process.exit(1);
  }
  if (!DRY_RUN && !WRITE_TOKEN) {
    logger.error('PRISMIC_WRITE_TOKEN is not set. Add it to .env and retry.');
    process.exit(1);
  }

  const state           = loadState();
  const forceCandidates = loadForceCandidates();
  if (!state.processed) state.processed = {};

  logger.info(`Loaded ${Object.keys(forceCandidates).length} force candidate(s)`);

  // Prismic clients
  const readClient = prismic.createClient(REPOSITORY, { accessToken: ACCESS_TOKEN });
  const writeClient = !DRY_RUN
    ? prismic.createWriteClient(REPOSITORY, { writeToken: WRITE_TOKEN })
    : null;

  // Fetch all broadcasts via SDK (handles pagination automatically)
  logger.info('Fetching all broadcasts...');
  const all = await readClient.getAllByType('broadcasts');
  logger.info(`Total broadcasts: ${all.length}`);

  const candidates = all.filter(d => d.data.audio?.includes(OLD_BASE));
  logger.info(`Broadcasts with old CDN URL: ${candidates.length}`);

  if (candidates.length === 0) {
    logger.info('Nothing to migrate.');
    logStream.end();
    return;
  }

  const counts = { skipped: 0, updated: 0, cdnMissing: 0, errors: 0 };
  const cdnMissingDocs = [];

  for (const doc of candidates) {
    const { id, uid } = doc;
    const oldUrl = doc.data.audio.trim();
    const label  = `[${uid || id}]`;

    // Skip already-done docs unless --force
    const prev = state.processed[id];
    if (prev?.status === 'updated' && !FORCE) {
      logger.skip(`${label} already migrated at ${prev.at}`);
      counts.skipped++;
      continue;
    }

    // Resolve final CDN URL
    const resolved = await resolveUrl(oldUrl.replace(OLD_BASE, NEW_BASE), oldUrl, label, forceCandidates);

    if (!resolved) {
      state.processed[id] = {
        status: 'cdn_missing', uid, oldUrl,
        attemptedUrl: normalizeNewUrl(oldUrl.replace(OLD_BASE, NEW_BASE)),
        at: new Date().toISOString(),
      };
      saveState(state);
      counts.cdnMissing++;
      cdnMissingDocs.push({ uid, oldUrl });
      continue;
    }

    const { url: finalUrl } = resolved;
    logger.info(`${label} CDN OK`, { finalUrl });

    if (DRY_RUN) {
      logger.info(`${label} [DRY RUN] would update audio → ${finalUrl}`);
      counts.updated++;
      continue;
    }

    // Update via SDK — one migration per document for per-doc state tracking
    try {
      const migration = prismic.createMigration();

      doc.data.audio = finalUrl;
      migration.updateDocument(doc);

      await writeClient.migrate(migration, {
        reporter: event => {
          if (event.type === 'documents:updated') {
            logger.ok(`${label} SDK updated`, { count: event.data?.length });
          } else {
            logger.info(`${label} SDK: ${event.type}`);
          }
        },
      });

      state.processed[id] = { status: 'updated', uid, oldUrl, newUrl: finalUrl, at: new Date().toISOString() };
      counts.updated++;
    } catch (err) {
      logger.error(`${label} Migration SDK error`, { id, message: err.message });
      state.processed[id] = {
        status: 'api_error', uid, oldUrl, newUrl: finalUrl,
        error: err.message, at: new Date().toISOString(),
      };
      counts.errors++;
    }

    saveState(state);
  }

  // Summary
  logger.info('=== Summary ===');
  logger.info(`Candidates:   ${candidates.length}`);
  logger.info(`Skipped:      ${counts.skipped}  (already done)`);
  logger.info(`Updated:      ${counts.updated}`);
  logger.info(`CDN missing:  ${counts.cdnMissing}`);
  logger.info(`API errors:   ${counts.errors}`);

  if (counts.cdnMissing > 0) {
    logger.warn(`${counts.cdnMissing} file(s) still missing. Add to force/migration.log and re-run with --force.`);
    for (const { uid, oldUrl } of cdnMissingDocs) {
      const link = uid ? `https://res.radio/broadcasts/${uid}` : '(no uid)';
      logger.warn(`  CDN missing: ${link}  ←  ${oldUrl}`);
    }
  }
  if (counts.errors > 0) {
    logger.warn(`${counts.errors} error(s). Re-run with --force to retry.`);
  }

  logStream.end();
}

main().catch(err => {
  logger.error('Fatal error', err.message);
  logStream.end();
  process.exit(1);
});