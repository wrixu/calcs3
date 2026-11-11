import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="w-full mt-12 py-6 border-t border-slate-800/80 text-center text-xs text-slate-500 no-print">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-cyan-400/90 font-medium">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{t.footer.devNotice}</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>{t.footer.autoSave}</span>
        </div>
      </div>
    </footer>
  );
};
