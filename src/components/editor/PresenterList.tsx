import { Users } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import type { PresenterRecord } from '../../types.ts';

type PresenterListProps = {
  presenters: PresenterRecord[];
  activePresenter: PresenterRecord | null;
  onSelectPresenter: (presenterId: string) => void;
};

export function PresenterList({
  presenters,
  activePresenter,
  onSelectPresenter,
}: PresenterListProps) {
  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-3xl border border-natural-border/70 bg-white/55 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:bg-white/5">
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

      {presenters.length > 0 ? (
        <div className="theme-scrollbar min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-2">
          {presenters.map((presenter, index) => {
            const isActive = presenter.id === activePresenter?.id;

            return (
              <button
                key={presenter.id}
                onClick={() => onSelectPresenter(presenter.id)}
                className={cn(
                  'w-full rounded-xl border px-3.5 py-2.5 text-left transition-all',
                  isActive
                    ? 'border-natural-olive/30 bg-white text-natural-olive shadow-none ring-1 ring-natural-olive/8 dark:bg-white/8'
                    : 'border-transparent bg-transparent shadow-none hover:border-natural-border/70 hover:bg-white/45 dark:hover:bg-white/8',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold leading-5">
                      {presenter.personName}
                    </p>
                    <p
                      className={cn(
                        'mt-0.5 truncate text-[11px] leading-5',
                        isActive ? 'text-natural-olive/80' : 'opacity-60',
                      )}
                    >
                      {presenter.department || '未填写部门'}
                      {presenter.position ? ` / ${presenter.position}` : ''}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em]',
                      isActive ? 'text-natural-olive/70' : 'opacity-35',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyListState />
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
