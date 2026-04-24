import { useEffect, useState } from 'react';
import { STORE_KEY } from '../constants.ts';
import {
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
    setStore((prev) => upsertPresenter(prev, imported));
  }

  return {
    store,
    setStore,
    activePresenter,
    selectPresenter,
    upsertImportedPresenter,
  };
}
