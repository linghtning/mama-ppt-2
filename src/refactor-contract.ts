import type { PresentationStore, PresenterRecord, SlideData } from './types.ts';
import type { ToastMessage, ViewMode } from './types/app.ts';
import { InfoCard } from './components/ui/InfoCard.tsx';
import { RuleCard } from './components/ui/RuleCard.tsx';
import { StatCard } from './components/ui/StatCard.tsx';
import { Toast } from './components/ui/Toast.tsx';
import { usePresentationKeyboard } from './hooks/usePresentationKeyboard.ts';
import { usePresentationStore } from './hooks/usePresentationStore.ts';
import { useTheme } from './hooks/useTheme.ts';
import { useToast } from './hooks/useToast.ts';
import { formatDateTime } from './lib/format.ts';
import {
  getActivePresenter,
  loadPresentationStore,
  normalizePersonName,
  upsertPresenter,
} from './lib/presentationStore.ts';
import { buildSlides } from './lib/slides.ts';

const store = loadPresentationStore() satisfies PresentationStore;
const activePresenter = getActivePresenter(store) satisfies PresenterRecord | null;
const slides = buildSlides(activePresenter) satisfies SlideData[];
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

slides satisfies SlideData[];

const viewMode = 'editor' satisfies ViewMode;
const toastMessage = { tone: 'info', text: viewMode } satisfies ToastMessage;
const hookExports = [
  InfoCard,
  RuleCard,
  StatCard,
  Toast,
  useTheme,
  useToast,
  usePresentationStore,
  usePresentationKeyboard,
  toastMessage,
];

hookExports satisfies unknown[];
