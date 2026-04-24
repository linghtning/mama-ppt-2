import type { PresentationStore, PresenterRecord, SlideData } from './types.ts';
import type { ToastMessage, ViewMode } from './types/app.ts';
import { createDefaultDemoStore } from './constants.ts';
import { InfoCard } from './components/ui/InfoCard.tsx';
import { RuleCard } from './components/ui/RuleCard.tsx';
import { StatCard } from './components/ui/StatCard.tsx';
import { Toast } from './components/ui/Toast.tsx';
import { EditorShell } from './components/editor/EditorShell.tsx';
import { EditorSidebar } from './components/editor/EditorSidebar.tsx';
import { EmptyPreviewState } from './components/editor/EmptyPreviewState.tsx';
import { PresenterList } from './components/editor/PresenterList.tsx';
import { PresenterPreview } from './components/editor/PresenterPreview.tsx';
import { PresentationControls } from './components/presentation/PresentationControls.tsx';
import { PresentationScreen } from './components/presentation/PresentationScreen.tsx';
import { Slide } from './components/presentation/Slide.tsx';
import { usePresentationKeyboard } from './hooks/usePresentationKeyboard.ts';
import { usePresentationStore } from './hooks/usePresentationStore.ts';
import { useTheme } from './hooks/useTheme.ts';
import { useToast } from './hooks/useToast.ts';
import { formatDateTime } from './lib/format.ts';
import {
  getActivePresenter,
  deletePresenter,
  loadPresentationStore,
  normalizePersonName,
  upsertPresenter,
} from './lib/presentationStore.ts';
import { buildSlides } from './lib/slides.ts';

const store = loadPresentationStore() satisfies PresentationStore;
const demoStore = createDefaultDemoStore() satisfies PresentationStore;
const activePresenter = getActivePresenter(store) satisfies PresenterRecord | null;
const demoPresenter = getActivePresenter(demoStore) satisfies PresenterRecord | null;
const slides = buildSlides(activePresenter) satisfies SlideData[];
const demoSlides = buildSlides(demoPresenter) satisfies SlideData[];
const normalizedName = normalizePersonName(' 演讲人 ') satisfies string;
const formattedDate = formatDateTime('2026-04-24T00:00:00.000Z') satisfies string;

upsertPresenter(
  store,
  {
    id: 'contract-presenter',
    personName: normalizedName,
    position: '',
    department: '',
    reportData: {
      weekNumber: '',
      lastWeekCompletion: '',
      thisWeekPlan: '',
      dataSupport: '',
      problems: '',
      others: '',
    },
    createdAt: formattedDate,
    updatedAt: formattedDate,
  },
) satisfies PresentationStore;

deletePresenter(demoStore, demoPresenter?.id ?? '') satisfies PresentationStore;

slides satisfies SlideData[];
demoSlides satisfies SlideData[];

const viewMode = 'editor' satisfies ViewMode;
const toastMessage = { tone: 'info', text: viewMode } satisfies ToastMessage;
const hookExports = [
  EditorShell,
  EditorSidebar,
  EmptyPreviewState,
  InfoCard,
  PresenterList,
  PresentationControls,
  PresentationScreen,
  PresenterPreview,
  RuleCard,
  Slide,
  StatCard,
  Toast,
  useTheme,
  useToast,
  usePresentationStore,
  usePresentationKeyboard,
  toastMessage,
];

hookExports satisfies unknown[];
