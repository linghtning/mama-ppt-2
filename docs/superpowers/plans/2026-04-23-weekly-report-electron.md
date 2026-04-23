# Weekly Report Desktop App Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current weekly report web app into an offline-friendly Electron desktop app that can be packaged into a Windows installer and portable executable.

**Architecture:** Keep the existing React renderer, remove AI Studio template remnants, localize runtime assets, and add a minimal Electron shell that loads the renderer in development and production. Package the app with `electron-builder` so the final deliverable is a Windows-friendly desktop application rather than a hosted website.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS 4, Electron, electron-builder

---

## Chunk 1: Remove browser-hosting leftovers

### Task 1: Clean package metadata and scripts

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Modify: `.env.example`

- [ ] **Step 1: Write the failing test**

Create a focused metadata/assertion test or validation command target that proves AI Studio-specific entries are still present and need removal.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run lint`
Expected: Existing project still compiles before metadata cleanup, but the repository still contains AI Studio-specific config to remove.

- [ ] **Step 3: Write minimal implementation**

Remove unused AI Studio dependencies, replace scripts with desktop-friendly dev/build commands, and rewrite docs/env examples so they no longer describe AI Studio deployment.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm install`
Expected: Lockfile updates cleanly and `npm run lint` still passes.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json README.md .env.example
git commit -m "chore: remove AI Studio template remnants"
```

### Task 2: Remove AI Studio runtime config from Vite

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Write the failing test**

Add or identify a build validation that still depends on `process.env.GEMINI_API_KEY`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: Current build still injects AI Studio-specific env values.

- [ ] **Step 3: Write minimal implementation**

Remove `loadEnv`-based AI Studio injection and keep only the renderer config needed for aliases, Tailwind, and dev server behavior.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: Renderer build succeeds without requiring Gemini-related environment variables.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts
git commit -m "chore: remove AI Studio Vite config"
```

## Chunk 2: Make runtime assets local and offline-friendly

### Task 3: Bundle background images locally

**Files:**
- Create: `src/assets/backgrounds/*`
- Modify: `src/constants.ts`

- [ ] **Step 1: Write the failing test**

Add a focused assertion or manual validation target that identifies remote Unsplash URLs as unsupported for offline desktop packaging.

- [ ] **Step 2: Run test to verify it fails**

Run: `rg -n "https://images.unsplash.com" src/constants.ts`
Expected: Matches are found.

- [ ] **Step 3: Write minimal implementation**

Download the current background images into versioned local assets and replace URL literals with imported asset paths.

- [ ] **Step 4: Run test to verify it passes**

Run: `rg -n "https://images.unsplash.com" src/constants.ts`
Expected: No matches.

- [ ] **Step 5: Commit**

```bash
git add src/constants.ts src/assets/backgrounds
git commit -m "feat: bundle presentation backgrounds locally"
```

### Task 4: Make typography offline-safe

**Files:**
- Modify: `src/index.css`
- Create or Modify: `src/assets/fonts/*` (only if local fonts are chosen)

- [ ] **Step 1: Write the failing test**

Add a validation that flags remote Google Fonts imports.

- [ ] **Step 2: Run test to verify it fails**

Run: `rg -n "fonts.googleapis.com" src/index.css`
Expected: Match is found.

- [ ] **Step 3: Write minimal implementation**

Remove the remote font import and switch to a desktop-safe local/system stack, or bundle fonts locally if that is worth the packaging cost.

- [ ] **Step 4: Run test to verify it passes**

Run: `rg -n "fonts.googleapis.com" src/index.css`
Expected: No matches.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/assets/fonts
git commit -m "feat: make typography offline friendly"
```

## Chunk 3: Add Electron desktop shell

### Task 5: Add Electron main and preload entrypoints

**Files:**
- Create: `electron/main.ts`
- Create: `electron/preload.ts`
- Create: `tsconfig.electron.json`

- [ ] **Step 1: Write the failing test**

Add compile validation for new Electron TypeScript entrypoints.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsc -p tsconfig.electron.json`
Expected: Fails because Electron entrypoints do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create a secure BrowserWindow bootstrap that resolves the Vite dev URL in development and loads the built `dist/index.html` in production.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsc -p tsconfig.electron.json`
Expected: Passes.

- [ ] **Step 5: Commit**

```bash
git add electron/main.ts electron/preload.ts tsconfig.electron.json
git commit -m "feat: add Electron desktop shell"
```

### Task 6: Wire Electron into package scripts and builder config

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Add script-level validation for missing desktop commands.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run`
Expected: No Electron-specific dev/package scripts exist yet.

- [ ] **Step 3: Write minimal implementation**

Add Electron dependencies, development scripts, production packaging scripts, and `electron-builder` configuration for Windows installer + portable output.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run`
Expected: Electron dev/build/package scripts are listed.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add desktop packaging scripts"
```

## Chunk 4: Verify runtime behavior and distribution output

### Task 7: Validate renderer and desktop startup paths

**Files:**
- Modify as needed: `package.json`, `electron/main.ts`, `vite.config.ts`

- [ ] **Step 1: Write the failing test**

Define startup verification commands for renderer build and production Electron launch.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build:desktop`
Expected: Any missing path, packaging, or runtime issue is surfaced.

- [ ] **Step 3: Write minimal implementation**

Fix remaining pathing or packaging issues until the renderer build and Electron production startup flow both work cleanly.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build:desktop`
Expected: Dist output and packaged desktop artifacts are created successfully.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "build: verify desktop packaging flow"
```

### Task 8: Document handoff for Windows use

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write the failing test**

Identify missing operator instructions for local dev, desktop build, and Windows artifact locations.

- [ ] **Step 2: Run test to verify it fails**

Run: `sed -n '1,220p' README.md`
Expected: README does not yet explain the Electron packaging workflow.

- [ ] **Step 3: Write minimal implementation**

Document install, dev, build, and Windows packaging commands, plus where to find the installer/portable outputs.

- [ ] **Step 4: Run test to verify it passes**

Run: `sed -n '1,260p' README.md`
Expected: Desktop workflow is documented clearly.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document Electron desktop workflow"
```

Plan complete and saved to `docs/superpowers/plans/2026-04-23-weekly-report-electron.md`. Ready to execute.
