import { Building2, Download, Moon, Sun, Upload } from 'lucide-react';
import type { PresenterRecord } from '../../types.ts';
import { PresenterList } from './PresenterList.tsx';

type EditorSidebarProps = {
  presenters: PresenterRecord[];
  activePresenter: PresenterRecord | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onExportTemplate: () => void;
  onImportClick: () => void;
  onSelectPresenter: (presenterId: string) => void;
};

export function EditorSidebar({
  presenters,
  activePresenter,
  isDark,
  onToggleTheme,
  onExportTemplate,
  onImportClick,
  onSelectPresenter,
}: EditorSidebarProps) {
  return (
    <aside className="flex h-screen w-[340px] shrink-0 flex-col overflow-hidden border-r border-natural-border bg-natural-sidebar px-6 py-6 transition-colors duration-300">
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
          onClick={onToggleTheme}
          className="rounded-full p-2 text-natural-olive transition-colors hover:bg-natural-olive/10 dark:hover:bg-white/10"
          title="切换主题"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <div className="grid gap-3">
        <button
          onClick={onExportTemplate}
          className="flex items-center justify-center gap-2 rounded-2xl border border-natural-border bg-white/75 px-4 py-3 font-semibold transition hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
        >
          <Download size={18} />
          导出 Excel 模板
        </button>

        <button
          onClick={onImportClick}
          className="flex items-center justify-center gap-2 rounded-2xl bg-natural-olive px-4 py-3 font-semibold text-white shadow-lg shadow-natural-olive/15 transition hover:bg-natural-olive-light"
        >
          <Upload size={18} />
          导入 Excel
        </button>
      </div>

      <PresenterList
        presenters={presenters}
        activePresenter={activePresenter}
        onSelectPresenter={onSelectPresenter}
      />
    </aside>
  );
}
