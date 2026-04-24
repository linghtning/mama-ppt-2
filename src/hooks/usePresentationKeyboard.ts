import { useEffect } from 'react';

type UsePresentationKeyboardOptions = {
  enabled: boolean;
  slideCount: number;
  goNext: () => void;
  goPrevious: () => void;
  exit: () => void;
};

export function usePresentationKeyboard({
  enabled,
  slideCount,
  goNext,
  goPrevious,
  exit,
}: UsePresentationKeyboardOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled || slideCount === 0) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        goNext();
      }

      if (event.key === 'ArrowLeft') {
        goPrevious();
      }

      if (event.key === 'Escape') {
        exit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, exit, goNext, goPrevious, slideCount]);
}
