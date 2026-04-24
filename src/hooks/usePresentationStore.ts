import { useEffect, useState } from 'react';
import { DEFAULT_DEMO_DISMISSED_KEY, STORE_KEY } from '../constants.ts';
import {
  deletePresenter,
  getActivePresenter,
  loadPresentationStore,
  upsertPresenter,
} from '../lib/presentationStore.ts';
import type { PresentationStore, PresenterRecord } from '../types.ts';

export function usePresentationStore() {
  const [store, setStore] = useState<PresentationStore>(loadPresentationStore);
  const activePresenter = getActivePresenter(store);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store]);

  function selectPresenter(presenterId: string) {
    setStore((prev) => ({ ...prev, activePresenterId: presenterId }));
  }

  function upsertImportedPresenter(imported: PresenterRecord) {
    localStorage.removeItem(DEFAULT_DEMO_DISMISSED_KEY);
    setStore((prev) => upsertPresenter(prev, imported));
  }

  function deletePresenterById(presenterId: string) {
    setStore((prev) => {
      const next = deletePresenter(prev, presenterId);
      if (next.presenters.length === 0) {
        localStorage.setItem(DEFAULT_DEMO_DISMISSED_KEY, 'true');
      }

      return next;
    });
  }

  return {
    store,
    setStore,
    activePresenter,
    selectPresenter,
    upsertImportedPresenter,
    deletePresenterById,
  };
}
