export type ViewMode = 'editor' | 'presentation';
export type MessageTone = 'success' | 'error' | 'info';

export type ToastMessage = {
  tone: MessageTone;
  text: string;
};
