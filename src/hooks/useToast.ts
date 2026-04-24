import { useEffect, useState } from 'react';
import type { ToastMessage } from '../types/app.ts';

export function useToast() {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => setMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return {
    message,
    showMessage: setMessage,
    clearMessage: () => setMessage(null),
  };
}
