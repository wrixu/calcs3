import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface ResetModalProps {
  isOpen: boolean;
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  language,
  onConfirm,
  onCancel,
}) => {
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-rose-400">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white m-0">
            {t.modal.resetTitle}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed m-0">
          {t.modal.resetMessage}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {t.modal.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            {t.modal.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
