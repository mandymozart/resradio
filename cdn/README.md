# CDN Upload Tools

Uploads audio files from `cdn/temp/` to Bunny Storage and watches a local folder for continuous sync.

## Setup

```bash
cd cdn
npm install
```

Configure `cdn/.env`:

```env
TARGET_BUNNY_STORAGE_ZONE=resradio
TARGET_BUNNY_API_KEY=<your-key>
TARGET_BUNNY_REGION=falkenstein

# Required for watch.mjs
WATCH_FOLDER=C:\path\to\audio
WATCH_REMOTE_PREFIX=/shows   # optional, defaults to /
```

## Batch upload (`upload.mjs`)

Uploads all audio files in `cdn/temp/` to Bunny Storage. Resumable — already completed files are skipped.

```bash
node upload.mjs          # upload all pending files
node upload.mjs --scan   # initialise status files only, no uploads
```

Status files are written to `cdn/logs/<year>/<filename>.json`.

## Folder watcher (`watch.mjs`)

Syncs a local folder to Bunny Storage. On startup runs an initial sync, then watches continuously for new files.

```bash
node watch.mjs --folder "C:\path\to\audio"
node watch.mjs --folder "C:\path\to\audio" --prefix /shows
```

Or set `WATCH_FOLDER` (and optionally `WATCH_REMOTE_PREFIX`) in `.env` and run:

```bash
node watch.mjs
```

Status files are written to `cdn/logs/watch/` mirroring the watched folder structure.

## Status values

| Value        | Meaning                              |
|--------------|--------------------------------------|
| `incomplete` | Not yet uploaded (will be retried)   |
| `exists`     | Already found on the server          |
| `complete`   | Successfully uploaded                |

## Building a distributable installer

Produces a self-contained bundle in `cdn/build/` that can be zipped and deployed to any Windows machine.

**One-time prerequisite:** download `WinSW-x64.exe` from [github.com/winsw/winsw/releases](https://github.com/winsw/winsw/releases), rename it to `winsw.exe` and place it in `cdn/bin/`.

```bash
npm run build
```

Bunny credentials are baked in from `cdn/.env` at build time — the client only needs to set `WATCH_FOLDER`.

Output:

```
cdn/build/
  install.ps1       ← run as Administrator on the target machine
  uninstall.ps1
  .env              ← pre-filled with credentials
  winsw.exe
  winsw.xml
  watch.mjs
  lib/uploader.mjs
  package.json
  node_modules/
```

**Client setup:**

1. Unzip the bundle
2. Open `.env` and set `WATCH_FOLDER=C:\path\to\audio`
3. Right-click `install.ps1` → *Run as Administrator*

Node.js will be installed automatically via `winget` if not already present.  
The service starts on boot and restarts automatically on crash.
