import React from 'react';

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
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', title: 'text-lg', sub: 'text-[8.5px]', lk: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', title: 'text-2xl', sub: 'text-[10px]', lk: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-12 h-12', title: 'text-3xl', sub: 'text-[11px]', lk: 'text-xs px-2 py-0.5' },
    xl: { icon: 'w-16 h-16', title: 'text-4xl', sub: 'text-xs', lk: 'text-sm px-2.5 py-1' },
  }[size];

  return (
    <div id="naspick-brand-logo" className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Latest Naspick Hexagonal Emblem with Speed Track N and Golden Core */}
      <div className={`relative ${sizeClasses.icon} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(16,185,129,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal shield base with neon emerald border */}
          <path
            d="M50 5 L88 25 L88 75 L50 95 L12 75 L12 25 Z"
            fill="#031614"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          
          {/* Inner dashed track / road contour */}
          <path
            d="M50 14 L80 31 L80 69 L50 86 L20 69 L20 31 Z"
            stroke="#065f46"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />

          {/* Geometric Dynamic 'N' Monogram */}
          <path
            d="M32 72 V28 H42 L58 56 V28 H68 V72 H58 L42 44 V72 H32 Z"
            fill="url(#naspickGreenGrad)"
          />

          {/* Glowing Golden Ceylon Hub / Sun with Radiant Spokes */}
          <g transform="translate(50, 28)">
            <circle cx="0" cy="0" r="6" fill="#f59e0b" />
            <circle cx="0" cy="0" r="9" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.8" />
            {/* Sun rays */}
            <line x1="0" y1="-11" x2="0" y2="-8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="8" x2="0" y2="11" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-11" y1="0" x2="-8" y2="0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="0" x2="11" y2="0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="naspickGreenGrad" x1="32" y1="28" x2="68" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#10b981" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Green Beacon Node at top-right corner of hexagon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
        </span>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight font-heading text-white ${sizeClasses.title}`}>
              NAS<span className="text-emerald-400">PICK</span>
            </span>
            <span
              className={`font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/70 rounded-md shadow-sm ${sizeClasses.lk}`}
            >
              LK
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`text-slate-400 font-bold uppercase tracking-[0.18em] mt-1 ${sizeClasses.sub}`}
            >
              SRI LANKA&apos;S RIDE NETWORK
            </span>
          )}
        </div>
      )}
    </div>
  );
};

