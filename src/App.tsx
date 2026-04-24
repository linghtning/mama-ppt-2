/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { EditorShell } from './components/editor/EditorShell.tsx';
import { PresentationScreen } from './components/presentation/PresentationScreen.tsx';
import { Toast } from './components/ui/Toast.tsx';
import { usePresentationKeyboard } from './hooks/usePresentationKeyboard.ts';
import { usePresentationStore } from './hooks/usePresentationStore.ts';
import { useTheme } from './hooks/useTheme.ts';
import { useToast } from './hooks/useToast.ts';
import { normalizePersonName } from './lib/presentationStore.ts';
import { buildSlides } from './lib/slides.ts';
import { exportPresenterTemplate, importPresenterFromFile } from './reportWorkbook.ts';
import type { ViewMode } from './types/app.ts';

export default function App() {
  const { store, activePresenter, selectPresenter, upsertImportedPresenter } = usePresentationStore();
  const [view, setView] = useState<ViewMode>('editor');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { message, showMessage } = useToast();
  const { isDark, setIsDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slides = buildSlides(activePresenter);

  const goToPreviousSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const goToNextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));

  usePresentationKeyboard({
    enabled: view === 'presentation',
    slideCount: slides.length,
    goNext: goToNextSlide,
    goPrevious: goToPreviousSlide,
    exit: () => setView('editor'),
  });

  useEffect(() => {
    if (currentSlide > slides.length - 1) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const imported = await importPresenterFromFile(file);
      const shouldReplace = store.presenters.some(
        (item) => normalizePersonName(item.personName) === normalizePersonName(imported.personName),
      );

      upsertImportedPresenter(imported);
      showMessage({
        tone: 'success',
        text: shouldReplace
          ? `已用新 Excel 替换 ${imported.personName} 的旧记录。`
          : `导入成功，已新增人员：${imported.personName}`,
      });
    } catch (error) {
      const text = error instanceof Error ? error.message : '导入失败，请检查 Excel 模板。';
      showMessage({
        tone: 'error',
        text,
      });
    }
  }

  function openPresentation() {
    if (!activePresenter) {
      return;
    }

    setCurrentSlide(0);
    setView('presentation');
  }

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-ink transition-colors duration-300">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleImport}
      />

      <Toast message={message} />

      {view === 'editor' ? (
        <EditorShell
          presenters={store.presenters}
          activePresenter={activePresenter}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onExportTemplate={exportPresenterTemplate}
          onImportClick={() => fileInputRef.current?.click()}
          onSelectPresenter={selectPresenter}
          onOpenPresentation={openPresentation}
        />
      ) : (
        <PresentationScreen
          activePresenter={activePresenter}
          slides={slides}
          currentSlide={currentSlide}
          onExit={() => setView('editor')}
          onPrevious={goToPreviousSlide}
          onNext={goToNextSlide}
        />
      )}
    </div>
  );
}
