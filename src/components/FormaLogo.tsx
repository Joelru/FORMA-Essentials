import React from 'react';

interface FormaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Marca tipográfica pura de FORMA (sin icono/logo gráfico).
 */
export const FormaLogo: React.FC<FormaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  variant = 'dark',
  className = '',
}) => {
  if (!showWordmark) return null;

  const wordmarkSize = {
    sm: 'text-xl tracking-[0.22em]',
    md: 'text-2xl sm:text-4xl tracking-[0.24em]',
    lg: 'text-3xl sm:text-5xl tracking-[0.25em]',
    xl: 'text-4xl sm:text-6xl tracking-[0.26em]',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <span
        className={`font-serif font-bold leading-none ${wordmarkSize} ${
          isLight ? 'text-white' : 'text-[#2D2926]'
        }`}
      >
        FORMA
      </span>
      {showSubtitle && (
        <span
          className={`text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-semibold mt-1 ${
            isLight ? 'text-[#F4C2C2]' : 'text-[#B76E79]'
          }`}
        >
          Diseño de Cejas & Maquillaje • Por Eslen
        </span>
      )}
    </div>
  );
};
