import { AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { PresenterRecord, SlideData } from '../../types.ts';
import { PresentationControls } from './PresentationControls.tsx';
import { Slide } from './Slide.tsx';

type PresentationScreenProps = {
  activePresenter: PresenterRecord | null;
  slides: SlideData[];
  currentSlide: number;
  onExit: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function PresentationScreen({
  activePresenter,
  slides,
  currentSlide,
  onExit,
  onPrevious,
  onNext,
}: PresentationScreenProps) {
  return (
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
          onClick={onExit}
          className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
          title="退出预览 (Esc)"
        >
          <X size={24} />
        </button>
      </div>

      <PresentationControls
        currentSlide={currentSlide}
        slideCount={slides.length}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
