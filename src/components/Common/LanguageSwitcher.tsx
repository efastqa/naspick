import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  const languages: { id: Language; label: string; sub: string }[] = [
    { id: 'en', label: 'English', sub: 'EN' },
    { id: 'si', label: 'සිංහල', sub: 'SI' },
    { id: 'ta', label: 'தமிழ்', sub: 'TA' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shadow-sm">
      <div className="pl-2 pr-1 text-slate-500 flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      {languages.map((lang) => {
        const isSelected = currentLanguage === lang.id;
        return (
          <button
            key={lang.id}
            id={`lang-btn-${lang.id}`}
            onClick={() => onSelectLanguage(lang.id)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
