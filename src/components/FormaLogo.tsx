import React from 'react';

interface FormaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Logo Oficial de FORMA:
 * Utiliza exactamente el isotipo Rose Gold (ceja perfilada + pestañas curvas) con fondo transparente
 * extraído de la imagen oficial de la marca (/forma-logo.png).
 */
export const FormaLogo: React.FC<FormaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  variant = 'dark',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-9 h-8',
    md: 'w-12 h-10 sm:w-14 sm:h-12',
    lg: 'w-16 h-14 sm:w-20 sm:h-18',
    xl: 'w-24 h-20 sm:w-28 sm:h-24',
  }[size];

  const wordmarkSize = {
    sm: 'text-xl tracking-[0.2em]',
    md: 'text-2xl sm:text-3xl tracking-[0.22em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.24em]',
    xl: 'text-4xl sm:text-5xl tracking-[0.26em]',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Isotipo Oficial Rose Gold (Ceja + Pestañas sin círculo exterior) */}
      <img
        src="/forma-logo.png"
        alt="Logo FORMA"
        className={`${dimensions} object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_6px_rgba(183,110,121,0.18)]`}
      />

      {showWordmark && (
        <div className="flex flex-col text-left">
          <span
            className={`font-serif font-bold leading-none ${wordmarkSize} ${
              isLight ? 'text-white' : 'text-[#2D2926]'
            }`}
          >
            FORMA
          </span>
          {showSubtitle && (
            <span
              className={`text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-semibold mt-1 ${
                isLight ? 'text-[#F4C2C2]' : 'text-[#B76E79]'
              }`}
            >
              Estudio &amp; Cosmética • Por Eslen
            </span>
          )}
        </div>
      )}
    </div>
  );
};
