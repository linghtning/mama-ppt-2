import { Play, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import type { PresenterRecord } from '../../types.ts';
import { StatCard } from '../ui/StatCard.tsx';
import { EditorSidebar } from './EditorSidebar.tsx';
import { EmptyPreviewState } from './EmptyPreviewState.tsx';
import { PresenterPreview } from './PresenterPreview.tsx';

type EditorShellProps = {
  presenters: PresenterRecord[];
  activePresenter: PresenterRecord | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onExportTemplate: () => void;
  onImportClick: () => void;
  onSelectPresenter: (presenterId: string) => void;
  onOpenPresentation: () => void;
};

export function EditorShell({
  presenters,
  activePresenter,
  isDark,
  onToggleTheme,
  onExportTemplate,
  onImportClick,
  onSelectPresenter,
  onOpenPresentation,
}: EditorShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <EditorSidebar
        presenters={presenters}
        activePresenter={activePresenter}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onExportTemplate={onExportTemplate}
        onImportClick={onImportClick}
        onSelectPresenter={onSelectPresenter}
      />

      <main className="flex h-screen flex-1 flex-col overflow-hidden bg-natural-bg px-8 py-8 transition-colors duration-300 md:px-10">
        <header className="mb-8 flex shrink-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
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
            <StatCard label="已导入人数" value={String(presenters.length)} />
            <button
              onClick={onOpenPresentation}
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

        <div className="min-h-0 flex-1 overflow-hidden">
          {activePresenter ? (
            <PresenterPreview presenter={activePresenter} />
          ) : (
            <EmptyPreviewState />
          )}
        </div>

        <footer className="mt-6 flex shrink-0 justify-end">
          <div className="flex items-center gap-2 rounded-full border border-natural-border/70 bg-white/70 px-4 py-2 text-sm text-natural-olive shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:bg-white/5">
            <Sparkles size={16} />
            <span>专属定制:祝妈妈每天工作都有好心情</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
