import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract Emblem: Educational Book + Writing Quill + Audio Arc + Academic Shield */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Base rounded shield / seal background */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="10"
            className="fill-red-600 dark:fill-red-700 transition-colors"
          />
          {/* Inner subtle glow */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="10"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Open Book Wings (Academic knowledge base) */}
          <path
            d="M9 30C14 28 18 29 22 32C26 29 30 28 35 30V18C30 16 26 17 22 20C18 17 14 16 9 18V30Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* Central Ascending Quill / Nib (Writing precision) */}
          <path
            d="M22 8L25.5 17.5L22 25L18.5 17.5L22 8Z"
            fill="#1E293B"
            className="dark:fill-slate-950"
          />
          <circle cx="22" cy="18" r="1.2" fill="#E11D48" />

          {/* Audio soundwave arcs on the right (Listening comprehension) */}
          <path
            d="M29 11C31.5 13 33 16 33 19.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M32.5 8.5C36 11.5 38 15.5 38 20"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />

          {/* Stylized academic checkmark / crest tick */}
          <path
            d="M17 24L20 27L27 20"
            stroke="#DC2626"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 font-black tracking-tight">
            <span className={`font-extrabold ${textSize} text-slate-900 dark:text-white`}>
              IELTS
            </span>
            <span className={`font-extrabold ${textSize} text-red-600 dark:text-red-500`}>
              PRACTICE
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 mt-0.5">
            HUB <span className="text-red-600 dark:text-red-500 font-normal">●</span> PREP SUITE
          </span>
        </div>
      )}
    </div>
  );
};
