import { useRef, useState, type PointerEvent } from 'react';
import { Users } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import type { PresenterRecord } from '../../types.ts';

const DELETE_REVEAL_WIDTH = 86;
const DELETE_OPEN_THRESHOLD = 42;
const HORIZONTAL_DRAG_THRESHOLD = 8;

type PresenterListProps = {
  presenters: PresenterRecord[];
  activePresenter: PresenterRecord | null;
  onSelectPresenter: (presenterId: string) => void;
  onDeletePresenter: (presenterId: string) => void;
};

type DragState = {
  presenterId: string;
  offset: number;
};

export function PresenterList({
  presenters,
  activePresenter,
  onSelectPresenter,
  onDeletePresenter,
}: PresenterListProps) {
  const [openPresenterId, setOpenPresenterId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragRef = useRef<{
    presenterId: string;
    startX: number;
    startY: number;
    startOffset: number;
    lastOffset: number;
    isHorizontalSwipe: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  function getPresenterOffset(presenterId: string) {
    if (dragState?.presenterId === presenterId) {
      return dragState.offset;
    }

    return openPresenterId === presenterId ? -DELETE_REVEAL_WIDTH : 0;
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, presenterId: string) {
    dragRef.current = {
      presenterId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: openPresenterId === presenterId ? -DELETE_REVEAL_WIDTH : 0,
      lastOffset: openPresenterId === presenterId ? -DELETE_REVEAL_WIDTH : 0,
      isHorizontalSwipe: false,
    };
    suppressClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    if (!current) {
      return;
    }

    const diffX = event.clientX - current.startX;
    const diffY = event.clientY - current.startY;

    if (
      !current.isHorizontalSwipe &&
      Math.abs(diffX) > HORIZONTAL_DRAG_THRESHOLD &&
      Math.abs(diffX) > Math.abs(diffY)
    ) {
      current.isHorizontalSwipe = true;
    }

    if (!current.isHorizontalSwipe) {
      return;
    }

    event.preventDefault();
    suppressClickRef.current = true;

    const offset = Math.max(
      -DELETE_REVEAL_WIDTH,
      Math.min(0, current.startOffset + diffX),
    );
    current.lastOffset = offset;
    setDragState({
      presenterId: current.presenterId,
      offset,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    if (!current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const offset = current.lastOffset;
    setOpenPresenterId(offset <= -DELETE_OPEN_THRESHOLD ? current.presenterId : null);
    setDragState(null);
    dragRef.current = null;
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragState(null);
    dragRef.current = null;
  }

  function handlePresenterClick(presenterId: string) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (openPresenterId === presenterId) {
      setOpenPresenterId(null);
      return;
    }

    setOpenPresenterId(null);
    onSelectPresenter(presenterId);
  }

  function handleDeletePresenter(presenterId: string) {
    setOpenPresenterId(null);
    setDragState(null);
    onDeletePresenter(presenterId);
  }

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
            const offset = getPresenterOffset(presenter.id);
            const deleteOpacity = Math.min(1, Math.abs(offset) / DELETE_REVEAL_WIDTH);

            return (
              <div
                key={presenter.id}
                className="relative w-full overflow-hidden rounded-xl"
              >
                <button
                  onClick={() => handleDeletePresenter(presenter.id)}
                  tabIndex={openPresenterId === presenter.id ? 0 : -1}
                  aria-hidden={openPresenterId !== presenter.id}
                  style={{
                    opacity: deleteOpacity,
                    pointerEvents: openPresenterId === presenter.id ? 'auto' : 'none',
                  }}
                  className="absolute inset-y-0 right-0 z-0 flex w-[86px] items-center justify-center rounded-xl bg-rose-600 text-sm font-bold text-white transition hover:bg-rose-700"
                >
                  删除
                </button>

                <button
                  onPointerDown={(event) => handlePointerDown(event, presenter.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  onClick={() => handlePresenterClick(presenter.id)}
                  style={{ transform: `translateX(${offset}px)` }}
                  className={cn(
                    'relative z-10 w-full touch-pan-y rounded-xl border px-3.5 py-2.5 text-left transition-all',
                    dragState?.presenterId === presenter.id ? 'duration-0' : 'duration-200',
                    isActive
                      ? 'border-natural-olive/30 bg-white text-natural-olive shadow-none ring-1 ring-natural-olive/8 dark:bg-white/8'
                      : 'border-transparent bg-natural-bg/70 shadow-none hover:border-natural-border/70 hover:bg-white/45 dark:bg-white/5 dark:hover:bg-white/8',
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
              </div>
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
