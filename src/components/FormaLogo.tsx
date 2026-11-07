import React from 'react';

interface FormaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Isotipo oficial de FORMA (Sin letras en el símbolo).
 * Representa la arquitectura de la mirada y el visagismo:
 * - Un arco de ceja estilizado en proporción áurea
 * - La curva sutil del párpado / contorno femenino en línea continua (One-Line Art)
 * - Un destello central que simboliza precisión, brillo y estética Clean Girl
 */
export const FormaLogo: React.FC<FormaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  variant = 'dark',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  const wordmarkSize = {
    sm: 'text-lg tracking-[0.22em]',
    md: 'text-2xl tracking-[0.26em]',
    lg: 'text-3xl tracking-[0.28em]',
    xl: 'text-4xl tracking-[0.3em]',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Isotipo puro sin letras */}
      <div
        className={`${dimensions} relative rounded-full flex items-center justify-center shrink-0 ${
          isLight
            ? 'bg-white/10 border border-[#F4C2C2]/30'
            : 'bg-[#FDF2F4] border border-[#E8A598]/60 shadow-sm'
        }`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[72%] h-[72%]"
          aria-label="Símbolo FORMA"
        >
          {/* Arco arquitectónico exterior sutil (Proporción Áurea) */}
          <path
            d="M12 34C12 20.7452 20.9543 10 32 10C43.0457 10 52 20.7452 52 34"
            stroke="#E8A598"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Trazo principal: Ceja orgánica esculpida (Visagismo FORMA) */}
          <path
            d="M10 31.5C15.5 24.5 24.5 20.5 34.5 21C41.5 21.3 47.5 24.2 54 29.5C48.2 26.8 41.8 25.2 34.2 25.2C24.8 25.2 16.8 27.6 10 31.5Z"
            fill={isLight ? '#F4C2C2' : '#2D2926'}
          />

          {/* Curva delicada inferior del párpado / contorno facial */}
          <path
            d="M16 38.5C21.5 43.2 28.5 44.5 36.5 42.2C41.5 40.8 45.8 38.2 49 35"
            stroke="#B76E79"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Destello de luz / punto focal de la mirada */}
          <path
            d="M32 30L33.4 33.6L37 35L33.4 36.4L32 40L30.6 36.4L27 35L30.6 33.6L32 30Z"
            fill="#B76E79"
          />

          {/* Gota/Punto de simetría en el arco superior */}
          <circle cx="38.5" cy="17.5" r="1.5" fill="#B76E79" />
        </svg>
      </div>

      {showWordmark && (
        <span
          className={`font-serif font-semibold ${wordmarkSize} ${
            isLight ? 'text-white' : 'text-[#2D2926]'
          }`}
        >
          FORMA
        </span>
      )}
    </div>
  );
};
