import React from 'react';

interface FormaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Emblema e Isotipo oficial de FORMA (Sin letras dentro del símbolo).
 * Combina:
 * 1. Líneas sutiles de mapeo facial / visagismo áureo (arquitectura de cejas).
 * 2. Una ceja esculpida y laminada con micro-trazos pelo a pelo.
 * 3. El contorno delicado del párpado, pestañas e iluminación del arco ciliar.
 * 4. Detalles botánicos y destello central en Rose Gold (#B76E79) y Carbón (#2D2926).
 */
export const FormaLogo: React.FC<FormaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  variant = 'dark',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const wordmarkSize = {
    sm: 'text-xl tracking-[0.22em]',
    md: 'text-2xl sm:text-3xl tracking-[0.24em]',
    lg: 'text-3xl sm:text-5xl tracking-[0.25em]',
    xl: 'text-4xl sm:text-6xl tracking-[0.26em]',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Emblema simbólico detallado sin letras */}
      <div
        className={`${dimensions} relative rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-gradient-to-br from-white/15 to-white/5 border border-[#F4C2C2]/40 shadow-md'
            : 'bg-gradient-to-br from-[#FFFDFC] via-[#FDF2F4] to-[#F4C2C2]/45 border border-[#E8A598] shadow-luxury'
        }`}
      >
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[86%] h-[86%]"
          aria-label="Emblema FORMA"
        >
          {/* Doble anillo de medallón arquitectónico */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#B76E79"
            strokeWidth="1"
            strokeOpacity="0.45"
          />
          <circle
            cx="40"
            cy="40"
            r="32.5"
            stroke="#E8A598"
            strokeWidth="0.8"
            strokeDasharray="2 2.5"
            strokeOpacity="0.75"
          />

          {/* Líneas geométricas de Visagismo / Proporción Áurea (Mapeo de Cejas) */}
          <line
            x1="15"
            y1="44"
            x2="49"
            y2="18"
            stroke="#B76E79"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <line
            x1="15"
            y1="44"
            x2="66"
            y2="35"
            stroke="#B76E79"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <line
            x1="49"
            y1="16"
            x2="49"
            y2="46"
            stroke="#B76E79"
            strokeWidth="0.75"
            strokeDasharray="1.5 1.5"
            strokeOpacity="0.45"
          />

          {/* Arco superior de cúpula estética */}
          <path
            d="M17 38C19 22 28.5 13 40 13C51.5 13 61 22 63 38"
            stroke="#B76E79"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />

          {/* Detalles botánicos laterales (Hojas de olivo/salvia minimalistas) */}
          <path
            d="M14 40C11.5 36.5 12.5 32 15.5 30C15.5 33.5 15.2 37 14 40Z"
            fill="#B76E79"
            fillOpacity="0.45"
          />
          <path
            d="M66 40C68.5 36.5 67.5 32 64.5 30C64.5 33.5 64.8 37 66 40Z"
            fill="#B76E79"
            fillOpacity="0.45"
          />

          {/* CEJA ESCULPIDA PRINCIPAL (Silueta + Micro-trazos de Brow Lamination) */}
          <path
            d="M13 37.5C19.5 28.5 30.5 23.2 44.5 23.5C53.2 23.7 59.8 27.2 66.5 33.5C60.2 30.2 52.8 28.2 44.2 28.3C31.8 28.5 21.5 32.2 13 37.5Z"
            fill={isLight ? '#FDF2F4' : '#2D2926'}
          />

          {/* Trazos finos pelo a pelo (Efecto Laminado realista dentro del arco) */}
          <path
            d="M17 35L21 29.5M21.5 33.2L26 27.2M26.5 31.5L31.5 25.5M32 30.2L37 24.5M37.5 29.5L42.8 24.2M43 29.2L48.5 24.5M48.5 29.5L54 25.8M54 30.2L59 27.8"
            stroke={isLight ? '#F4C2C2' : '#2D2926'}
            strokeWidth="1.25"
            strokeLinecap="round"
          />

          {/* Iluminación del hueso de la ceja (Arco Rose Gold debajo de la ceja) */}
          <path
            d="M16 39.8C23.5 34.2 33.5 31.4 45 31.6C52.5 31.7 58.8 33.4 64 36.2"
            stroke="#B76E79"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Contorno delicado de párpado cerrado y pestañas sutiles */}
          <path
            d="M21 47.5C27.5 53.5 37.5 54.8 47.5 51.2C52.5 49.4 56.5 46.5 59.5 43"
            stroke={isLight ? '#F4C2C2' : '#2D2926'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Pestañas delicadas */}
          <path
            d="M26 50.5L24 53.5M32 52.5L30.8 56M38.5 53L38.2 56.8M45 52L46 55.5M51.5 49.5L53.5 52.5M56.5 46L59.2 48.2"
            stroke={isLight ? '#F4C2C2' : '#2D2926'}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Destello de precisión en el punto áureo del arco (x=49, y=21) */}
          <path
            d="M49 14.5L50.2 18.3L54 19.5L50.2 20.7L49 24.5L47.8 20.7L44 19.5L47.8 18.3L49 14.5Z"
            fill="#B76E79"
          />

          {/* Destello central de mirada luminosa */}
          <path
            d="M39 36.5L40.3 40.2L44 41.5L40.3 42.8L39 46.5L37.7 42.8L34 41.5L37.7 40.2L39 36.5Z"
            fill="#B76E79"
          />

          {/* Puntos de simetría áurea */}
          <circle cx="15" cy="44" r="1.4" fill="#B76E79" />
          <circle cx="64.5" cy="34.5" r="1.4" fill="#B76E79" />
          <circle cx="40" cy="64" r="1.3" fill="#E8A598" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
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
              Brow & Makeup Studio • By Eslen
            </span>
          )}
        </div>
      )}
    </div>
  );
};
