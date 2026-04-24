/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { EditorShell } from './components/editor/EditorShell.tsx';
import { Toast } from './components/ui/Toast.tsx';
import { usePresentationKeyboard } from './hooks/usePresentationKeyboard.ts';
import { usePresentationStore } from './hooks/usePresentationStore.ts';
import { useTheme } from './hooks/useTheme.ts';
import { useToast } from './hooks/useToast.ts';
import { normalizePersonName } from './lib/presentationStore.ts';
import { buildSlides } from './lib/slides.ts';
import { cn } from './lib/utils.ts';
import { exportPresenterTemplate, importPresenterFromFile } from './reportWorkbook.ts';
import type { ViewMode } from './types/app.ts';
import { PresenterRecord, SlideData } from './types.ts';

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
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-black select-none">
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <Slide
                key={`${activePresenter?.id ?? 'none'}-${currentSlide}`}
                data={slides[currentSlide]}
                presenter={activePresenter}
                slides={slides}
              />
            </AnimatePresence>
          </div>

          <div className="absolute right-6 top-6 z-50 flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
              {activePresenter?.personName || '未选择'}
            </div>
            <button
              onClick={() => setView('editor')}
              className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              title="退出预览 (Esc)"
            >
              <X size={24} />
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-50 flex items-center justify-center gap-8">
            <button
              onClick={goToPreviousSlide}
              disabled={currentSlide === 0}
              className={cn(
                'pointer-events-auto rounded-full p-4 backdrop-blur-md transition-all active:scale-90',
                currentSlide === 0
                  ? 'bg-white/5 text-white/20'
                  : 'bg-white/10 text-white hover:bg-white/20',
              )}
            >
              <ChevronLeft size={32} />
            </button>

            <div className="pointer-events-auto rounded-full border border-white/10 bg-black/30 px-6 py-2 font-mono text-sm text-white/70 backdrop-blur-md">
              {currentSlide + 1} / {slides.length}
            </div>

            <button
              onClick={goToNextSlide}
              disabled={currentSlide === slides.length - 1}
              className={cn(
                'pointer-events-auto rounded-full p-4 backdrop-blur-md transition-all active:scale-90',
                currentSlide === slides.length - 1
                  ? 'bg-white/5 text-white/20'
                  : 'bg-white/10 text-white shadow-xl shadow-blue-500/20 hover:bg-white/20',
              )}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Slide: React.FC<{
  data: SlideData;
  presenter: PresenterRecord | null;
  slides: SlideData[];
}> = ({ data, presenter, slides }) => {
  const contentLines = data.content?.split('\n').filter((line) => line.trim() !== '') || [];
  const reportData = presenter?.reportData ?? {
    weekNumber: '',
    lastWeekCompletion: '',
    thisWeekPlan: '',
    dataSupport: '',
    problems: '',
    others: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-natural-ink dark:text-[#d1d1c7]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear"
          style={{
            backgroundImage: `url("${data.bgImage}")`,
            animation: 'kenburns 40s linear infinite alternate',
          }}
        />
        <div className="absolute inset-0 z-10 bg-black/40 transition-colors duration-300 dark:bg-black/60" />
        <div className="absolute inset-0 z-10 bg-natural-bg/10 dark:bg-black/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <div className="relative z-20 w-full max-w-6xl px-12 py-16 text-white">
        {data.type === 'title' && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="mb-12 h-1 w-24 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            <h3 className="mb-6 text-3xl font-serif italic tracking-wide text-white/90 drop-shadow-lg">
              成都依瑞特包装有限公司
            </h3>
            <h1 className="text-center text-7xl font-bold leading-tight tracking-tighter text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] md:text-9xl">
              业务部 工作汇报
            </h1>

            <div className="mt-16 flex items-center justify-center gap-6 rounded-full border border-white/30 bg-white/20 px-12 py-5 shadow-2xl backdrop-blur-md transition-colors">
              <span className="text-xl font-serif italic opacity-70">第</span>
              <span className="border-b-4 border-white px-4 text-4xl font-black text-white">
                {reportData.weekNumber || 'XX'}
              </span>
              <span className="text-xl font-serif italic opacity-70">周</span>
            </div>
          </motion.div>
        )}

        {data.type === 'agenda' && (
          <div className="grid items-center gap-20 md:grid-cols-2">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="mb-4 h-1 w-16 bg-white shadow-lg" />
              <h2 className="font-serif text-8xl font-bold uppercase tracking-tighter text-white drop-shadow-2xl">
                目录
              </h2>
              <p className="text-xl font-bold uppercase tracking-[0.4em] text-white drop-shadow-md opacity-80">
                Agenda Overview
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                '01 上周工作完成情况',
                '02 本周工作计划',
                '03 数据支持',
                '04 问题反馈',
                '05 其他补充',
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group flex items-center gap-8"
                >
                  <span className="w-12 border-b-2 border-white/30 text-3xl font-bold italic text-white/60">
                    {index + 1}
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-white drop-shadow-lg transition-transform duration-300 group-hover:translate-x-2">
                    {item.substring(3)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.type === 'content' && (
          <div className="max-w-4xl">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-14"
            >
              <h2 className="mb-6 font-serif text-6xl font-bold italic tracking-tighter text-white drop-shadow-2xl">
                {data.title.substring(3)}
              </h2>
              <div className="h-1.5 w-32 rounded-full bg-white shadow-lg" />
            </motion.div>

            <div className="space-y-10 border-l-4 border-white/20 pl-8">
              {contentLines.length > 0 ? (
                contentLines.map((line, index) => (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-6"
                  >
                    <div className="mt-3.5 h-3.5 w-3.5 shrink-0 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    <p className="text-3xl font-serif font-medium italic leading-snug text-white drop-shadow-xl md:text-5xl">
                      {line}
                    </p>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-serif italic text-white/40"
                >
                  暂无具体内容填写...
                </motion.div>
              )}
            </div>
          </div>
        )}

        {data.type === 'end' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2, type: 'spring' }}
            className="text-center"
          >
            <h1 className="mb-12 font-serif text-9xl font-bold italic tracking-tighter text-white drop-shadow-2xl">
              汇报完毕
            </h1>
            <div className="mx-auto mb-12 h-1 w-24 bg-white shadow-lg" />

            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-20 border-t border-white/20 pt-12 text-left text-sm font-serif italic text-white/80 drop-shadow-md">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white not-italic">
                  Location
                </p>
                <p>成都依瑞特包装有限公司</p>
                <p>业务部 汇报中心</p>
              </div>
              <div className="text-right">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white not-italic">
                  Social
                </p>
                <p>Yiruite Packaging Co., Ltd.</p>
                <p>Weekly Sales Report</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {data.type !== 'title' && data.type !== 'end' && (
        <div className="absolute right-10 top-20 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 drop-shadow-md">
          <span>Page {slides.findIndex((slide) => slide.id === data.id) + 1}</span>
          <div className="h-px w-12 bg-white/40" />
          <span>Weekly {reportData.weekNumber || 'XX'}</span>
        </div>
      )}
    </motion.div>
  );
};
