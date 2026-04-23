# Weekly Report Desktop App Design

## Goal

Convert the current Vite + React weekly report app into an offline-friendly Electron desktop app that can be packaged as a Windows executable for non-technical end users.

## Current Project Context

- The UI is already a client-side React app with local persistence in `localStorage`.
- The app does not rely on a real backend today.
- The repo still contains AI Studio template leftovers:
  - `GEMINI_API_KEY` injection in `vite.config.ts`
  - AI Studio wording in `README.md` and `.env.example`
  - unused dependencies such as `@google/genai`, `express`, and related type packages
- Presentation backgrounds are loaded from remote Unsplash URLs, which is fragile for offline desktop use.
- Fonts are loaded from Google Fonts, which is also fragile for offline desktop use.

## Chosen Approach

Wrap the existing Vite-rendered React app with Electron, keep the existing UI structure, remove unused AI Studio/browser-hosting concerns, and localize all critical visual assets so the packaged app works without network access.

This keeps the current product surface stable while minimizing rewrite risk. Electron is the right trade-off here because Windows 10 and Windows 11 compatibility matters more than package size.

## Architecture

### Renderer

- Keep `src/main.tsx` and `src/App.tsx` as the renderer entrypoint and UI shell.
- Continue storing report content and theme state in browser storage.
- Replace remote backgrounds with bundled local image assets.
- Replace remote font loading with local fonts or a system-font fallback stack.

### Desktop Shell

- Add an Electron main process that opens a single application window.
- In development, Electron should load the Vite dev server.
- In production, Electron should load the built renderer from `dist/`.
- Use a preload script only if needed; keep `nodeIntegration` off and `contextIsolation` on.

### Packaging

- Use `electron-builder` to generate:
  - a Windows installer (`nsis`)
  - a portable Windows build as fallback
- Keep the app name, executable name, and product metadata explicit so the output is easy to hand off.

## File and Responsibility Outline

- `src/App.tsx`: existing editor/presentation UI, updated only where asset paths or offline assumptions change
- `src/constants.ts`: slide metadata and background image imports
- `src/index.css`: font handling and any asset-related global styling
- `electron/main.ts`: app lifecycle, window creation, dev/prod URL resolution
- `electron/preload.ts`: optional bridge surface; likely minimal or empty for now
- `vite.config.ts`: renderer build config only, with AI Studio-specific env injection removed
- `package.json`: scripts, desktop packaging config, dependency cleanup
- `assets/...`: bundled background images and any local fonts/icons needed for offline desktop use
- `README.md`: local development and desktop build instructions

## Error Handling and Runtime Expectations

- If local persisted data is missing or invalid, the app should fall back to the initial report state.
- If assets fail to resolve in development, the renderer should still start and fail loudly in the console rather than silently blanking.
- The packaged app should not require `.env` files, external services, or a running local server.

## Testing and Verification Strategy

- Add focused tests where practical for new behavior that can be exercised in the current toolchain.
- Verify the renderer still builds with `vite build`.
- Verify Electron main/preload TypeScript compiles cleanly.
- Verify the packaged desktop output can be generated successfully.
- Smoke-test the production app startup path by running Electron against the built files.

## Acceptance Criteria

- No AI Studio-specific configuration remains in the runtime path.
- All presentation background images required by the app are bundled locally.
- The app can run offline as a desktop app.
- The repo can produce a Windows `.exe` installer and a portable build through a documented command.
- The existing weekly report editing and presentation flow still works.
