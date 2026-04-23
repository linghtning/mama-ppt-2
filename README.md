# Yiruite Weekly Report Desktop App

An offline-friendly weekly report editor and presentation app built with React, Vite, and Electron.

## Requirements

- Node.js 22+
- pnpm

## Install

```bash
pnpm install
```

## Development

Run the browser renderer only:

```bash
pnpm run dev
```

Run the desktop app with Electron:

```bash
pnpm run dev:desktop
```

## Build

Build the renderer and Electron main process:

```bash
pnpm run build:desktop
```

## Package for Windows

Generate the Windows installer and portable package:

```bash
pnpm run dist:win
```

Artifacts are written to `release/`.

For a quick local packaging check without creating the installer artifacts:

```bash
pnpm run dist:win:dir
```

## Notes

- Presentation background images are bundled locally for offline use.
- The app stores report content and theme settings locally on the machine.
- No API key or external service is required to run the packaged app.
- Windows packaging in this project uses `signAndEditExecutable=false` to avoid `winCodeSign` symlink extraction failures on machines without symlink privilege. If you need the default executable editing behavior, enable Windows Developer Mode or run the terminal as Administrator and then adjust the packaging command.
