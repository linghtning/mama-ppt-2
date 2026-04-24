import type { ToastMessage } from '../../types/app.ts';
import { cn } from '../../lib/utils.ts';

type ToastProps = {
  message: ToastMessage | null;
};

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
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
  );
}
