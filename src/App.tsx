/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Moon,
  Play,
  Sun,
  Upload,
  Users,
  X,
} from 'lucide-react';
import {
  BG_IMAGES,
  createDefaultStore,
  createPresenterRecord,
  LEGACY_REPORT_KEY,
  STORE_KEY,
  THEME_KEY,
} from './constants.ts';
import { cn } from './lib/utils.ts';
import { exportPresenterTemplate, importPresenterFromFile } from './reportWorkbook.ts';
import { PresentationStore, PresenterRecord, ReportData, SlideData } from './types.ts';

type ViewMode = 'editor' | 'presentation';
type MessageTone = 'success' | 'error' | 'info';

type ToastMessage = {
  tone: MessageTone;
  text: string;
};

export default function App() {
  const [store, setStore] = useState<PresentationStore>(loadPresentationStore);
  const [view, setView] = useState<ViewMode>('editor');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePresenter = getActivePresenter(store);
  const slides = buildSlides(activePresenter);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => setMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (view !== 'presentation') {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      }

      if (event.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }

      if (event.key === 'Escape') {
        setView('editor');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, view]);

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

      setStore((prev) => upsertPresenter(prev, imported));
      setMessage({
        tone: 'success',
        text: shouldReplace
          ? `已用新 Excel 替换 ${imported.personName} 的旧记录。`
          : `导入成功，已新增人员：${imported.personName}`,
      });
    } catch (error) {
      const text = error instanceof Error ? error.message : '导入失败，请检查 Excel 模板。';
      setMessage({
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

      {message && (
        <div
          className={cn(
            'fixed left-1/2 top-5 z-[70] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-xl backdrop-blur-md',
            message.tone === 'success' && 'bg-emerald-700/90 text-white',
            message.tone === 'error' && 'bg-rose-700/90 text-white',
            message.tone === 'info' && 'bg-slate-900/85 text-white',
          )}
        >
          {message.text}
        </div>
      )}

      {view === 'editor' ? (
        <div className="flex min-h-screen overflow-hidden">
          <aside className="w-[340px] shrink-0 border-r border-natural-border bg-natural-sidebar px-6 py-6 transition-colors duration-300">
            <header className="mb-8 flex items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2 text-natural-olive">
                  <Building2 size={24} strokeWidth={2.5} />
                  <span className="font-serif text-xl font-bold italic">演讲后台</span>
                </div>
                <p className="text-xs uppercase tracking-[0.24em] opacity-55">
                  Import Only Manager
                </p>
              </div>
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className="rounded-full p-2 text-natural-olive transition-colors hover:bg-natural-olive/10 dark:hover:bg-white/10"
                title="切换主题"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </header>

            <div className="grid gap-3">
              <button
                onClick={() => exportPresenterTemplate()}
                className="flex items-center justify-center gap-2 rounded-2xl border border-natural-border bg-white/75 px-4 py-3 font-semibold transition hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
              >
                <Download size={18} />
                导出 Excel 模板
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-natural-olive px-4 py-3 font-semibold text-white shadow-lg shadow-natural-olive/15 transition hover:bg-natural-olive-light"
              >
                <Upload size={18} />
                导入 Excel
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-natural-border/70 bg-white/55 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-natural-olive/65">
                    导入列表
                  </p>
                  <p className="mt-1 text-sm opacity-75">后台只展示已导入的人员 Excel 列表</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-natural-olive/10 text-natural-olive">
                  <Users size={20} />
                </div>
              </div>

              {store.presenters.length > 0 ? (
                <div className="space-y-3">
                  {store.presenters.map((presenter, index) => {
                    const isActive = presenter.id === activePresenter?.id;

                    return (
                      <button
                        key={presenter.id}
                        onClick={() => setStore((prev) => ({ ...prev, activePresenterId: presenter.id }))}
                        className={cn(
                          'w-full rounded-2xl border p-4 text-left transition-all',
                          isActive
                            ? 'border-natural-olive bg-natural-olive text-white shadow-lg shadow-natural-olive/15'
                            : 'border-natural-border bg-white/75 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10',
                        )}
                      >
                        <p className="text-[11px] uppercase tracking-[0.28em] opacity-70">
                          #{String(index + 1).padStart(2, '0')}
                        </p>
                        <p className="mt-1 truncate text-base font-semibold">
                          {presenter.personName}
                        </p>
                        <p className={cn('mt-1 text-xs', isActive ? 'text-white/80' : 'opacity-65')}>
                          {presenter.department || '未填写部门'}
                          {presenter.position ? ` / ${presenter.position}` : ''}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <EmptyListState />
              )}
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto bg-natural-bg px-8 py-8 transition-colors duration-300 md:px-10">
            <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-natural-olive/65">
                  后台只读预览
                </p>
                <h1 className="mt-2 font-serif text-4xl font-bold italic text-natural-olive">
                  Excel 导入人员中心
                </h1>
                <p className="mt-2 text-sm opacity-70">
                  演讲信息在后台不可编辑。如需修改，请重新导入同名 Excel，系统会自动替换旧记录。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatCard label="已导入人数" value={String(store.presenters.length)} />
                <button
                  onClick={openPresentation}
                  disabled={!activePresenter}
                  className={cn(
                    'flex items-center gap-3 rounded-full px-8 py-3.5 font-bold text-white shadow-xl transition',
                    activePresenter
                      ? 'bg-natural-olive shadow-natural-olive/20 hover:bg-natural-olive-light'
                      : 'cursor-not-allowed bg-slate-400/70 shadow-none',
                  )}
                >
                  <Play size={18} fill="currentColor" />
                  前台开始演示
                </button>
              </div>
            </header>

            {activePresenter ? (
              <div className="grid gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                <section className="rounded-[28px] border border-natural-border bg-white p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:bg-natural-sidebar/50">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-natural-olive/65">
                        当前人员
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-natural-olive">
                        个人信息预览
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-natural-olive/10 p-3 text-natural-olive">
                      <FileSpreadsheet size={20} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InfoCard label="人员姓名" value={activePresenter.personName} />
                    <InfoCard label="所属部门" value={activePresenter.department || '未填写'} />
                    <InfoCard label="岗位 / 身份" value={activePresenter.position || '未填写'} />
                    <InfoCard
                      label="汇报周次"
                      value={activePresenter.reportData.weekNumber || '未填写'}
                    />
                    <InfoCard
                      label="最后导入时间"
                      value={formatDateTime(activePresenter.updatedAt)}
                    />
                  </div>
                </section>

                <section className="rounded-[28px] border border-natural-border bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:bg-natural-sidebar/50">
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-natural-olive/65">
                      导入规则
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-natural-olive">
                      后台使用说明
                    </h2>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <RuleCard
                      title="后台不可编辑"
                      description="后台不再提供手工修改演讲信息，列表中的数据全部来自导入的 Excel。"
                    />
                    <RuleCard
                      title="同名自动替换"
                      description="再次导入同名人员的 Excel 时，会直接替换旧记录，不会重复新增。"
                    />
                    <RuleCard
                      title="右侧只读预览"
                      description="点击左侧人员后，右侧只显示该人员的个人信息，不提供编辑入口。"
                    />
                    <RuleCard
                      title="前台照常演示"
                      description="导入完成后可直接进入前台，并在演示界面切换不同人员播放内容。"
                    />
                  </div>

                  <div className="mt-8 rounded-3xl bg-natural-bg/70 p-5 dark:bg-black/10">
                    <p className="text-sm font-semibold text-natural-olive">Excel 流程</p>
                    <p className="mt-3 text-sm leading-7 opacity-75">
                      先导出单人 Excel 模板，填写该人员的信息后导入。若后续要修改同一个人的演讲内容，请重新导入同名 Excel，系统会用新数据覆盖旧数据。
                    </p>
                  </div>
                </section>
              </div>
            ) : (
              <EmptyPreviewState />
            )}
          </main>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-black select-none">
          <div className="absolute left-6 top-6 z-[60] flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-white backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
              当前演讲人
            </span>
            <select
              value={activePresenter?.id ?? ''}
              onChange={(event) =>
                setStore((prev) => ({ ...prev, activePresenterId: event.target.value }))
              }
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white outline-none"
            >
              {store.presenters.map((presenter) => (
                <option key={presenter.id} value={presenter.id} className="text-black">
                  {presenter.personName}
                </option>
              ))}
            </select>
          </div>

          <div className="absolute right-6 top-6 z-[60] flex items-center gap-3">
            <button
              onClick={() => setView('editor')}
              className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
              title="退出演示"
            >
              <X size={24} />
            </button>
          </div>

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

          <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-[60] flex items-center justify-center gap-8">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className={cn(
                'pointer-events-auto rounded-full p-4 backdrop-blur-md transition',
                currentSlide === 0
                  ? 'bg-white/5 text-white/25'
                  : 'bg-white/10 text-white hover:bg-white/20',
              )}
            >
              <ChevronLeft size={32} />
            </button>

            <div className="pointer-events-auto rounded-full border border-white/10 bg-black/30 px-6 py-2 font-mono text-sm text-white/75 backdrop-blur-md">
              {currentSlide + 1} / {slides.length}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
              disabled={currentSlide === slides.length - 1}
              className={cn(
                'pointer-events-auto rounded-full p-4 backdrop-blur-md transition',
                currentSlide === slides.length - 1
                  ? 'bg-white/5 text-white/25'
                  : 'bg-white/10 text-white hover:bg-white/20',
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

function EmptyListState() {
  return (
    <div className="rounded-2xl border border-dashed border-natural-border bg-natural-bg/60 p-5 text-sm leading-7 opacity-75 dark:bg-black/10">
      还没有导入任何人员。先导出 Excel 模板并填写，再导入到后台列表。
    </div>
  );
}

function EmptyPreviewState() {
  return (
    <div className="rounded-[32px] border border-dashed border-natural-border bg-white/70 p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-natural-olive/65">
        Ready For Import
      </p>
      <h2 className="mt-4 font-serif text-3xl font-bold italic text-natural-olive">
        暂无可预览人员
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 opacity-75">
        后台不提供手工编辑。请导入 Excel 后查看人员列表，点击左侧某个人员，右侧会展示该人员的个人信息预览。
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-natural-border bg-white px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:bg-white/5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-natural-olive/60">
        {label}
      </p>
      <p className="mt-2 max-w-[180px] truncate text-lg font-semibold">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-natural-border bg-natural-bg/70 p-4 dark:bg-black/10">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-natural-olive/60">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}

function RuleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-natural-border bg-natural-bg/70 p-5 dark:bg-black/10">
      <p className="text-base font-semibold text-natural-olive">{title}</p>
      <p className="mt-3 text-sm leading-7 opacity-75">{description}</p>
    </div>
  );
}

const Slide: React.FC<{
  data: SlideData;
  presenter: PresenterRecord | null;
  slides: SlideData[];
}> = ({ data, presenter, slides }) => {
  const contentLines = data.content?.split('\n').filter((line) => line.trim() !== '') || [];
  const displayName = presenter?.personName || '未命名演讲人';
  const weekNumber = presenter?.reportData.weekNumber || '未填写';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden text-natural-ink dark:text-[#d1d1c7]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear"
          style={{
            backgroundImage: `url("${data.bgImage}")`,
            animation: 'kenburns 40s linear infinite alternate',
          }}
        />
        <div className="absolute inset-0 z-10 bg-black/45 transition-colors duration-300 dark:bg-black/60" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <div className="relative z-20 w-full max-w-6xl px-12 py-16 text-white">
        {data.type === 'title' && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm uppercase tracking-[0.32em] text-white/70">
              {presenter?.department || '演讲部门'}
              {presenter?.position ? ` · ${presenter.position}` : ''}
            </div>
            <div className="mb-12 h-1 w-24 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            <h2 className="mb-5 text-2xl font-serif italic text-white/85">多人演讲展示</h2>
            <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] md:text-8xl">
              {displayName}
            </h1>
            <p className="mt-5 text-2xl font-serif italic text-white/80">工作汇报 / Presentation</p>

            <div className="mt-14 flex items-center justify-center gap-5 rounded-full border border-white/30 bg-white/18 px-10 py-5 shadow-2xl backdrop-blur-md">
              <span className="text-lg opacity-75">汇报周次</span>
              <span className="border-b-4 border-white px-3 text-4xl font-black">
                {weekNumber}
              </span>
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
              <h2 className="font-serif text-7xl font-bold uppercase tracking-tighter text-white drop-shadow-2xl">
                目录
              </h2>
              <p className="text-lg font-bold uppercase tracking-[0.35em] text-white/75">
                Agenda Overview
              </p>
              <p className="pt-6 text-xl leading-9 text-white/85">
                当前演讲人：<span className="font-semibold text-white">{displayName}</span>
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
                  className="flex items-center gap-8"
                >
                  <span className="w-12 border-b-2 border-white/30 text-3xl font-bold text-white/65">
                    {index + 1}
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                    {item.substring(3)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.type === 'content' && (
          <div className="max-w-5xl">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-white/65">
                {displayName} / {weekNumber}
              </p>
              <h2 className="mb-6 font-serif text-5xl font-bold italic tracking-tight text-white drop-shadow-2xl md:text-6xl">
                {data.title.substring(3)}
              </h2>
              <div className="h-1.5 w-32 rounded-full bg-white shadow-lg" />
            </motion.div>

            <div className="space-y-8 border-l-4 border-white/20 pl-8">
              {contentLines.length > 0 ? (
                contentLines.map((line, index) => (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                    className="flex items-start gap-6"
                  >
                    <div className="mt-4 h-3.5 w-3.5 shrink-0 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.75)]" />
                    <p className="text-3xl font-medium leading-snug text-white drop-shadow-xl md:text-4xl">
                      {line}
                    </p>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl italic text-white/45"
                >
                  当前页还没有填写内容。
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
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-white/65">
              Thank You
            </p>
            <h1 className="mb-8 font-serif text-8xl font-bold italic tracking-tight text-white drop-shadow-2xl">
              汇报完毕
            </h1>
            <div className="mx-auto mb-10 h-1 w-24 bg-white shadow-lg" />
            <p className="text-2xl text-white/85">
              演讲人：<span className="font-semibold text-white">{displayName}</span>
            </p>
            <p className="mt-3 text-lg text-white/65">{getDepartmentAndPosition(presenter)}</p>
          </motion.div>
        )}
      </div>

      {data.type !== 'title' && data.type !== 'end' && (
        <div className="absolute right-10 top-10 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white/60 drop-shadow-md">
          <span>Page {slides.findIndex((slide) => slide.id === data.id) + 1}</span>
          <div className="h-px w-12 bg-white/40" />
          <span>{displayName}</span>
        </div>
      )}
    </motion.div>
  );
};

function buildSlides(presenter: PresenterRecord | null): SlideData[] {
  const reportData = presenter?.reportData;

  return [
    {
      id: 'title',
      title: `${presenter?.personName || '未命名演讲人'} 工作汇报`,
      type: 'title',
      bgImage: BG_IMAGES.TITLE,
    },
    {
      id: 'agenda',
      title: '目录',
      type: 'agenda',
      bgImage: BG_IMAGES.AGENDA,
    },
    {
      id: 'completion',
      title: '01 上周工作完成情况',
      content: reportData?.lastWeekCompletion || '',
      type: 'content',
      bgImage: BG_IMAGES.COMPLETION,
    },
    {
      id: 'plan',
      title: '02 本周工作计划',
      content: reportData?.thisWeekPlan || '',
      type: 'content',
      bgImage: BG_IMAGES.PLAN,
    },
    {
      id: 'data',
      title: '03 数据支持',
      content: reportData?.dataSupport || '',
      type: 'content',
      bgImage: BG_IMAGES.DATA,
    },
    {
      id: 'problems',
      title: '04 问题反馈',
      content: reportData?.problems || '',
      type: 'content',
      bgImage: BG_IMAGES.PROBLEMS,
    },
    {
      id: 'others',
      title: '05 其他补充',
      content: reportData?.others || '',
      type: 'content',
      bgImage: BG_IMAGES.OTHERS,
    },
    {
      id: 'end',
      title: '汇报完毕',
      type: 'end',
      bgImage: BG_IMAGES.END,
    },
  ];
}

function loadPresentationStore(): PresentationStore {
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

function getActivePresenter(store: PresentationStore) {
  return (
    store.presenters.find((item) => item.id === store.activePresenterId) ??
    store.presenters[0] ??
    null
  );
}

function upsertPresenter(store: PresentationStore, imported: PresenterRecord): PresentationStore {
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

function normalizePersonName(name: string) {
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

function getDepartmentAndPosition(presenter: PresenterRecord | null) {
  if (!presenter) {
    return '未填写';
  }

  return [presenter.department, presenter.position].filter(Boolean).join(' / ') || '未填写';
}

function formatDateTime(iso: string) {
  if (!iso) {
    return '未记录';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
