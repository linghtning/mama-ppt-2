import type { PresentationStore, PresenterRecord, SlideData } from './types.ts';
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
