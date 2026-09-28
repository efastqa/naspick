import React, { useState } from 'react';

interface NaspickLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'full' | 'icon';
}

export const NaspickLogo: React.FC<NaspickLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'full',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: { img: 'h-9 sm:h-10 max-w-[160px]', icon: 'w-8 h-8', title: 'text-lg', sub: 'text-[9px]', lk: 'text-[9px] px-1 py-0.2' },
    md: { img: 'h-11 sm:h-13 md:h-14 max-w-[220px]', icon: 'w-10 h-10', title: 'text-xl', sub: 'text-[10px]', lk: 'text-[10px] px-1.5 py-0.5' },
    lg: { img: 'h-12 sm:h-15 md:h-16 max-w-[260px]', icon: 'w-13 h-13', title: 'text-2xl', sub: 'text-[11px]', lk: 'text-xs px-2 py-0.5' },
    xl: { img: 'h-16 sm:h-20 md:h-24 max-w-[340px]', icon: 'w-16 h-16', title: 'text-3xl', sub: 'text-xs', lk: 'text-sm px-2.5 py-1' },
  }[size];

  return (
    <div 
      id="naspick-brand-logo" 
      className={`flex items-center select-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
      title="Naspick Sri Lanka - Ride Anytime Anywhere"
    >
      {!imageError ? (
        <div className="relative flex items-center">
          <img
            src="/naspick_logo.png"
            alt="Naspick - Ride Anytime Anywhere"
            className={`${sizeClasses.img} w-auto object-contain rounded-lg drop-shadow-[0_2px_14px_rgba(16,185,129,0.35)]`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        /* Fallback High-Fidelity Vector Logo if raster fails */
        <div className="flex items-center gap-2.5">
          <div className={`relative ${sizeClasses.icon} flex-shrink-0 flex items-center justify-center`}>
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_2px_12px_rgba(16,185,129,0.5)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="roadLoopGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d9f5" />
                  <stop offset="60%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              {/* Speed Lines */}
              <line x1="8" y1="40" x2="24" y2="40" stroke="#00d9f5" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              <line x1="4" y1="50" x2="28" y2="50" stroke="#00d9f5" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="10" y1="60" x2="22" y2="60" stroke="#10b981" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

              {/* Looping Road Map Pin */}
              <path
                d="M 28 85 C 40 70 42 55 42 42 C 42 26 54 14 70 14 C 86 14 96 26 96 42 C 96 58 84 70 70 70 C 60 70 54 64 54 55"
                stroke="url(#roadLoopGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* White Dashed Road Markings */}
              <path
                d="M 30 85 C 40 70 42 55 42 42 C 42 26 54 14 70 14 C 86 14 96 26 96 42 C 96 58 84 70 70 70"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                fill="none"
              />
              {/* Center Car Silhouette */}
              <g transform="translate(62, 34) scale(0.7)">
                <path
                  d="M4 10 L8 4 L16 4 L20 10 L22 12 C23 12 24 13 24 14 L24 18 C24 19 23 20 22 20 L21 20 C20 20 19 19 19 18 L19 17 L5 17 L5 18 C5 19 4 20 3 20 L2 20 C1 20 0 19 0 18 L0 14 C0 13 1 12 2 12 Z"
                  fill="#ffffff"
                />
                <circle cx="6" cy="14" r="1.8" fill="#00d9f5" />
                <circle cx="18" cy="14" r="1.8" fill="#00d9f5" />
              </g>
            </svg>
          </div>

          {variant === 'full' && (
            <div className="flex flex-col leading-none justify-center">
              <div className="flex items-baseline gap-1">
                {/* Stylized Sinhala 'න' + 'sh pick' */}
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-xl font-heading">
                  න
                </span>
                <span className={`font-black tracking-tight font-heading text-white ${sizeClasses.title}`}>
                  sh
                </span>
                <span className="font-black italic tracking-tight font-heading text-cyan-400 text-xl flex items-center">
                  p<span className="relative">i<span className="absolute -top-1 left-0.5 text-xs text-cyan-300">📍</span></span>ck
                </span>
                <span className={`font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/70 rounded-md shadow-sm ml-1 ${sizeClasses.lk}`}>
                  LK
                </span>
              </div>
              {showSubtitle && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-slate-300 font-bold uppercase tracking-[0.2em] ${sizeClasses.sub}`}>
                    RIDE • ANYTIME • ANYWHERE
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
