# Component Module Split Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the large `src/App.tsx` file into focused components, hooks, and helper modules without changing behavior or visuals.

**Architecture:** Keep `App.tsx` as the app coordinator. Move pure presenter-store and slide helpers into `src/lib`, browser state concerns into `src/hooks`, editor and presentation layouts into `src/components`, and shared display cards into `src/components/ui`. Preserve existing storage keys, copy, Tailwind classes, import/export behavior, and presentation navigation.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Electron

---

## File Structure

- Modify: `src/App.tsx` - top-level orchestration only.
- Create: `src/types/app.ts` - app-only view and toast message types.
- Create: `src/lib/presentationStore.ts` - store loading, migration, active presenter lookup, upsert, and name normalization.
- Create: `src/lib/slides.ts` - slide construction from presenter data.
- Create: `src/lib/format.ts` - date-time formatting.
- Create: `src/hooks/useTheme.ts` - persisted theme state and document class updates.
- Create: `src/hooks/useToast.ts` - toast message state and auto-dismiss timing.
- Create: `src/hooks/usePresentationStore.ts` - persisted presenter store state and selection/upsert actions.
- Create: `src/hooks/usePresentationKeyboard.ts` - presentation keyboard navigation.
- Create: `src/components/ui/Toast.tsx` - toast rendering.
- Create: `src/components/ui/StatCard.tsx` - statistic card.
- Create: `src/components/ui/InfoCard.tsx` - information card.
- Create: `src/components/ui/RuleCard.tsx` - rule card.
- Create: `src/components/editor/EditorShell.tsx` - editor page layout.
- Create: `src/components/editor/EditorSidebar.tsx` - sidebar header/actions/list.
- Create: `src/components/editor/PresenterList.tsx` - presenter list and empty state.
- Create: `src/components/editor/PresenterPreview.tsx` - active presenter info and rules.
- Create: `src/components/editor/EmptyPreviewState.tsx` - empty editor preview.
- Create: `src/components/presentation/PresentationScreen.tsx` - full-screen presentation layout.
- Create: `src/components/presentation/PresentationControls.tsx` - slide navigation controls.
- Create: `src/components/presentation/Slide.tsx` - animated slide renderer.

## Chunk 1: Move Pure Helpers

### Task 1: Extract store helpers

**Files:**
- Create: `src/lib/presentationStore.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run a compile check before extraction so any missing export/import problem after the move is caught by the same command.

```bash
pnpm run lint
```

Expected: PASS before the refactor.

- [ ] **Step 2: Move implementation**

Move these functions from `src/App.tsx` to `src/lib/presentationStore.ts`:

- `loadPresentationStore`
- `getActivePresenter`
- `upsertPresenter`
- `normalizePersonName`
- `migrateLegacyReport`

Export the first four. Keep `migrateLegacyReport` private.

- [ ] **Step 3: Update imports**

Update `src/App.tsx` to import the exported helpers from `src/lib/presentationStore.ts`.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

### Task 2: Extract slide and format helpers

**Files:**
- Create: `src/lib/slides.ts`
- Create: `src/lib/format.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run:

```bash
pnpm run lint
```

Expected: PASS before extraction.

- [ ] **Step 2: Move implementation**

Move `buildSlides` to `src/lib/slides.ts` and `formatDateTime` to `src/lib/format.ts`.

- [ ] **Step 3: Update imports**

Update `src/App.tsx` to import `buildSlides` and `formatDateTime`.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

## Chunk 2: Extract Hooks

### Task 3: Extract theme and toast hooks

**Files:**
- Create: `src/types/app.ts`
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useToast.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run:

```bash
pnpm run lint
```

Expected: PASS before extraction.

- [ ] **Step 2: Move app-only types**

Move `ViewMode`, `MessageTone`, and `ToastMessage` to `src/types/app.ts`.

- [ ] **Step 3: Add hooks**

Create:

- `useTheme`, returning `{ isDark, setIsDark }`.
- `useToast`, returning `{ message, showMessage, clearMessage }`.

Preserve the current `THEME_KEY`, document class toggling, and 3200ms dismiss timing.

- [ ] **Step 4: Update App**

Use the hooks in `src/App.tsx`, replacing local theme and toast state/effects.

- [ ] **Step 5: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

### Task 4: Extract store and keyboard hooks

**Files:**
- Create: `src/hooks/usePresentationStore.ts`
- Create: `src/hooks/usePresentationKeyboard.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run:

```bash
pnpm run lint
```

Expected: PASS before extraction.

- [ ] **Step 2: Add hooks**

Create:

- `usePresentationStore`, returning `{ store, setStore, activePresenter, selectPresenter, upsertImportedPresenter }`.
- `usePresentationKeyboard`, receiving `{ enabled, slideCount, goNext, goPrevious, exit }`.

Preserve localStorage persistence and keyboard behavior.

- [ ] **Step 3: Update App**

Replace direct store state/effects and keydown effect in `src/App.tsx` with the new hooks.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

## Chunk 3: Extract Components

### Task 5: Extract shared UI components

**Files:**
- Create: `src/components/ui/Toast.tsx`
- Create: `src/components/ui/StatCard.tsx`
- Create: `src/components/ui/InfoCard.tsx`
- Create: `src/components/ui/RuleCard.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run:

```bash
pnpm run lint
```

Expected: PASS before extraction.

- [ ] **Step 2: Move implementation**

Move the existing JSX and class names for `Toast`, `StatCard`, `InfoCard`, and `RuleCard` into separate files.

- [ ] **Step 3: Update imports**

Update consumers to import these components.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

### Task 6: Extract editor components

**Files:**
- Create: `src/components/editor/EditorShell.tsx`
- Create: `src/components/editor/EditorSidebar.tsx`
- Create: `src/components/editor/PresenterList.tsx`
- Create: `src/components/editor/PresenterPreview.tsx`
- Create: `src/components/editor/EmptyPreviewState.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run:

```bash
pnpm run lint
```

Expected: PASS before extraction.

- [ ] **Step 2: Move editor JSX**

Move the editor-only layout from `src/App.tsx` into the new components. Preserve all copy, Tailwind classes, icons, and button behavior.

- [ ] **Step 3: Wire props**

Pass presenters, active presenter, selection callback, import/export callbacks, presentation callback, theme callback, count, and file input trigger through props.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

### Task 7: Extract presentation components

**Files:**
- Create: `src/components/presentation/PresentationScreen.tsx`
- Create: `src/components/presentation/PresentationControls.tsx`
- Create: `src/components/presentation/Slide.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Run:

```bash
pnpm run lint
```

Expected: PASS before extraction.

- [ ] **Step 2: Move presentation JSX**

Move the presentation full-screen layout, navigation controls, and `Slide` renderer into the new components. Preserve all animation, class names, and copy.

- [ ] **Step 3: Wire props**

Pass current slide index, slides, active presenter, exit callback, and navigation callbacks through props.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm run lint
```

Expected: PASS.

## Chunk 4: Final Cleanup

### Task 8: Remove unused imports and verify build

**Files:**
- Modify: `src/App.tsx`
- Modify as needed: newly created component, hook, or lib files

- [ ] **Step 1: Clean imports**

Remove unused React, icon, motion, type, and helper imports after extraction.

- [ ] **Step 2: Verify TypeScript**

Run:

```bash
pnpm run lint
```

Expected: PASS.

- [ ] **Step 3: Verify renderer build**

Run:

```bash
pnpm run build
```

Expected: PASS.

- [ ] **Step 4: Inspect final structure**

Run:

```bash
wc -l src/App.tsx src/components/editor/*.tsx src/components/presentation/*.tsx src/components/ui/*.tsx src/hooks/*.ts src/lib/*.ts
```

Expected: `src/App.tsx` is substantially smaller than before and responsibilities are split.
