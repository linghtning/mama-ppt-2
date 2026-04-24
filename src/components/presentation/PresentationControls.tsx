import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

type PresentationControlsProps = {
  currentSlide: number;
  slideCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function PresentationControls({
  currentSlide,
  slideCount,
  onPrevious,
  onNext,
}: PresentationControlsProps) {
  return (
    <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-50 flex items-center justify-center gap-8">
      <button
        onClick={onPrevious}
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
        {currentSlide + 1} / {slideCount}
      </div>

      <button
        onClick={onNext}
        disabled={currentSlide === slideCount - 1}
        className={cn(
          'pointer-events-auto rounded-full p-4 backdrop-blur-md transition-all active:scale-90',
          currentSlide === slideCount - 1
            ? 'bg-white/5 text-white/20'
            : 'bg-white/10 text-white shadow-xl shadow-blue-500/20 hover:bg-white/20',
        )}
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
