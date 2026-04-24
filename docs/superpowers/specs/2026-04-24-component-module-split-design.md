# Component Module Split Design

## Goal

Refactor the current React + Electron weekly report app into smaller components and modules without changing UI, behavior, persistence, import/export, or presentation playback.

## Scope

This work is structural only:

- Keep the current editor and presentation screens visually unchanged.
- Keep Excel template export and import behavior unchanged.
- Keep localStorage keys and migration behavior unchanged.
- Keep keyboard and button navigation behavior unchanged.
- Fix TypeScript and lint issues discovered during the refactor.
- Do not introduce new runtime features or design changes.

## Current Project Context

The app is small, but `src/App.tsx` has grown to 864 lines and currently owns several responsibilities:

- Application state and view mode.
- Local persistence and legacy data migration.
- Theme persistence and document class updates.
- Toast message timing.
- Excel import coordination.
- Editor layout and read-only preview UI.
- Presentation layout, controls, keyboard navigation, and slide rendering.
- Slide construction and presenter store helpers.

The existing `pnpm run lint` command runs TypeScript checks for the renderer and Electron entrypoints. There is no ESLint configuration in the repository yet, so "ESLint errors" in this pass means keeping code compatible with common lint expectations while preserving the existing script behavior unless a config is later added.

## Chosen Approach

Use a lightweight component and module split. Keep route-level orchestration in `App.tsx`, move focused UI pieces into `components`, move stateful browser concerns into `hooks`, and move pure business helpers into `lib`.

This is the safest option for the current project size: it reduces file size and improves maintainability without introducing a heavier feature-folder architecture.

## Architecture

### App Shell

`src/App.tsx` remains the top-level coordinator. It should own:

- Loading the presenter store through a hook.
- Tracking editor versus presentation view.
- Wiring import, theme, toast, and presentation open/close actions.
- Rendering either the editor screen or presentation screen.

It should not contain low-level card components, slide rendering internals, or localStorage helper implementations.

### Editor Components

Editor components live under `src/components/editor`.

- `EditorShell` renders the fixed two-column editor layout.
- `EditorSidebar` renders the title area, theme toggle, Excel actions, and presenter list.
- `PresenterList` renders imported presenter records and selection state.
- `PresenterPreview` renders the current person info and usage rules.
- Small empty states can live near the components that use them.

These components receive data and callbacks through props. They do not read localStorage or import Excel files directly.

### Presentation Components

Presentation components live under `src/components/presentation`.

- `PresentationScreen` renders the full-screen presentation view.
- `PresentationControls` renders previous/next buttons and slide count.
- `Slide` renders the animated slide.

Keyboard navigation remains in a hook so the presentation screen stays focused on layout.

### Shared UI Components

Shared presentational components live under `src/components/ui`.

- `Toast`
- `StatCard`
- `InfoCard`
- `RuleCard`

These components should remain styling-only and receive all content via props.

### Hooks

Hooks live under `src/hooks`.

- `usePresentationStore` owns localStorage persistence, active presenter selection, and presenter upsert.
- `useTheme` owns persisted dark/light theme state and document class updates.
- `useToast` owns message state and auto-dismiss timing.
- `usePresentationKeyboard` owns presentation key handling.

Hooks can call pure helpers from `src/lib`, but UI components should not duplicate that logic.

### Library Helpers

Pure helpers live under `src/lib`.

- `presentationStore.ts` owns loading, legacy migration, active presenter lookup, upsert, and name normalization.
- `slides.ts` owns slide construction.
- `format.ts` owns date formatting.

Existing `src/reportWorkbook.ts`, `src/constants.ts`, and `src/types.ts` stay in place unless tiny type-only adjustments are needed.

## Data Flow

`App` initializes store/theme/toast hooks, derives the active presenter and slides, then passes data downward:

1. `EditorShell` receives presenters, active presenter, counts, action callbacks, and message-independent UI state.
2. Excel import stays initiated from the hidden file input in `App`, then calls `importPresenterFromFile` and `upsertPresenter`.
3. `PresentationScreen` receives the active presenter, slides, current slide index, and navigation callbacks.
4. `Slide` receives only the current `SlideData`, the presenter, and slide metadata.

State changes remain centralized so the split does not create hidden state ownership.

## Error Handling

- Invalid stored data still clears the current store key and falls back to legacy migration or an empty store.
- Import errors still show the original error message when available.
- Empty presenter and empty slide content states remain unchanged.
- Current slide index still resets if imported data changes the available slide set.

## Testing and Verification

This refactor should be verified with:

- `pnpm run lint`
- `pnpm run build`

Because behavior is intended to remain unchanged, the most important check is that the app compiles after the split and no type-only imports or unused helpers remain.

## Acceptance Criteria

- `src/App.tsx` is substantially smaller and mostly orchestration.
- Editor UI, presentation UI, shared cards, hooks, and pure helpers have clear file boundaries.
- No user-facing copy, visual styling, storage keys, or import/presentation behavior changes.
- TypeScript validation passes for renderer and Electron code.
- Renderer production build passes.
