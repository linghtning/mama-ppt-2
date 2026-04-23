# Yiruite Weekly Report Desktop App

An offline-friendly weekly report editor and presentation app built with React, Vite, and Electron.

## Requirements

- Node.js 22+
- npm

## Install

```bash
npm install
```

## Development

Run the browser renderer only:

```bash
npm run dev
```

Run the desktop app with Electron:

```bash
npm run dev:desktop
```

## Build

Build the renderer and Electron main process:

```bash
npm run build:desktop
```

## Package for Windows

Generate the Windows installer and portable package:

```bash
npm run dist:win
```

Artifacts are written to `release/`.

## Notes

- Presentation background images are bundled locally for offline use.
- The app stores report content and theme settings locally on the machine.
- No API key or external service is required to run the packaged app.
