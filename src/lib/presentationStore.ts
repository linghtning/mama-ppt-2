import {
  createDefaultStore,
  createPresenterRecord,
  LEGACY_REPORT_KEY,
  STORE_KEY,
} from '../constants.ts';
import type { PresentationStore, PresenterRecord, ReportData } from '../types.ts';

export function loadPresentationStore(): PresentationStore {
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PresentationStore;
      if (Array.isArray(parsed.presenters)) {
        return {
          presenters: parsed.presenters,
          activePresenterId:
            parsed.presenters.some((item) => item.id === parsed.activePresenterId)
              ? parsed.activePresenterId
              : parsed.presenters[0]?.id ?? null,
        };
      }
    }
  } catch {
    localStorage.removeItem(STORE_KEY);
  }

  const legacy = migrateLegacyReport();
  if (legacy) {
    return legacy;
  }

  return createDefaultStore();
}

export function getActivePresenter(store: PresentationStore) {
  return (
    store.presenters.find((item) => item.id === store.activePresenterId) ??
    store.presenters[0] ??
    null
  );
}

export function upsertPresenter(
  store: PresentationStore,
  imported: PresenterRecord,
): PresentationStore {
  const importKey = normalizePersonName(imported.personName);
  const existingIndex = store.presenters.findIndex(
    (item) => normalizePersonName(item.personName) === importKey,
  );

  if (existingIndex === -1) {
    return {
      presenters: [...store.presenters, imported],
      activePresenterId: imported.id,
    };
  }

  const existing = store.presenters[existingIndex];
  const replacedPresenter: PresenterRecord = {
    ...imported,
    id: existing.id,
    createdAt: existing.createdAt,
  };

  return {
    presenters: store.presenters.map((item, index) =>
      index === existingIndex ? replacedPresenter : item,
    ),
    activePresenterId: replacedPresenter.id,
  };
}

export function normalizePersonName(name: string) {
  return name.trim().toLocaleLowerCase();
}

function migrateLegacyReport(): PresentationStore | null {
  try {
    const legacyRaw = localStorage.getItem(LEGACY_REPORT_KEY);
    if (!legacyRaw) {
      return null;
    }

    const legacyData = JSON.parse(legacyRaw) as ReportData;
    const presenter = createPresenterRecord('默认演讲人');
    presenter.reportData = {
      weekNumber: legacyData.weekNumber || '',
      lastWeekCompletion: legacyData.lastWeekCompletion || '',
      thisWeekPlan: legacyData.thisWeekPlan || '',
      dataSupport: legacyData.dataSupport || '',
      problems: legacyData.problems || '',
      others: legacyData.others || '',
    };

    return {
      presenters: [presenter],
      activePresenterId: presenter.id,
    };
  } catch {
    return null;
  }
}
