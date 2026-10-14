import React from 'react';

interface MajmaahLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const MajmaahLogo: React.FC<MajmaahLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  inverted = false,
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }[size];

  const titleSizes = {
    sm: 'text-xs font-bold',
    md: 'text-sm font-extrabold',
    lg: 'text-lg font-black',
    xl: 'text-xl font-black',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Institutional Crest Icon */}
      <div
        className={`${iconDimensions} relative rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 shadow-sm border ${
          inverted
            ? 'bg-white/10 border-white/20 text-[#C4B688]'
            : 'bg-[#46523B] border-[#A08D52]/40 text-[#A08D52]'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Subtle Outer Ring */}
          <circle
            cx="24"
            cy="24"
            r="21"
            stroke={inverted ? '#C4B688' : '#A08D52'}
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.7"
          />
          {/* Inner Golden Ring */}
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke={inverted ? '#FAF9F6' : '#A08D52'}
            strokeWidth="1.5"
          />

          {/* Golden Palm Frond / Emblem Rays */}
          <path
            d="M24 10C24 10 27 15 27 20C27 25 24 28 24 28C24 28 21 25 21 20C21 15 24 10 24 10Z"
            fill={inverted ? '#C4B688' : '#A08D52'}
            opacity="0.85"
          />
          <path
            d="M24 13C26 15 30 18 29 23C28 26 24 28 24 28C24 28 20 26 19 23C18 18 22 15 24 13Z"
            fill={inverted ? '#FAF9F6' : '#C4B688'}
            opacity="0.7"
          />

          {/* Academic Book / Foundation */}
          <path
            d="M16 29C19 28 22 28.5 24 30C26 28.5 29 28 32 29V35C29 34 26 34.5 24 36C22 34.5 19 34 16 35V29Z"
            fill={inverted ? '#C4B688' : '#A08D52'}
          />

          {/* Central Academic Minaret Star */}
          <circle cx="24" cy="11.5" r="1.5" fill={inverted ? '#FAF9F6' : '#FAF9F6'} />
          <path
            d="M24 8L25 10L27 10.5L25.5 12L26 14L24 13L22 14L22.5 12L21 10.5L23 10L24 8Z"
            fill={inverted ? '#FAF9F6' : '#A08D52'}
            transform="scale(0.65) translate(13, 0)"
          />
        </svg>
      </div>

      {/* Institutional Typography */}
      <div className="flex flex-col text-right leading-tight min-w-0">
        <span
          className={`tracking-tight truncate ${titleSizes} ${
            inverted ? 'text-white' : 'text-[#46523B]'
          }`}
        >
          جامعة المجمعة
        </span>
        {showSubtitle && (
          <span
            className={`text-[11px] font-bold tracking-normal truncate ${
              inverted ? 'text-[#C4B688]' : 'text-[#A08D52]'
            }`}
          >
            الكلية التطبيقية
          </span>
        )}
      </div>
    </div>
  );
};
