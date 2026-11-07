import React, { useId } from 'react';

interface FormaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Sello / Logo Oficial de FORMA ("FORMA • ESTUDIO & COSMÉTICA").
 * Recreado en SVG vectorial de alta precisión a partir del diseño oficial:
 * - Anillo circular en acabado Rose Gold metálico
 * - Arco superior curvo: "FORMA" en tipografía Serif
 * - Arco inferior curvo: "ESTUDIO & COSMÉTICA"
 * - Estrellas de 4 puntas y puntos de equilibrio laterales
 * - Centro: Ceja perfilada con 3 micro-cortes iniciales + línea de párpado con pestañas curvas
 */
export const FormaLogo: React.FC<FormaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  variant = 'dark',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');

  const dimensions = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
  }[size];

  const wordmarkSize = {
    sm: 'text-xl tracking-[0.2em]',
    md: 'text-2xl sm:text-3xl tracking-[0.22em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.24em]',
    xl: 'text-4xl sm:text-5xl tracking-[0.26em]',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Sello Circular Oficial FORMA */}
      <div
        className={`${dimensions} relative rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-[#FAF7F5] shadow-md'
            : 'bg-gradient-to-br from-[#FFFDFC] via-[#FAF7F5] to-[#FDF2F4] shadow-luxury'
        }`}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="Logo FORMA Estudio & Cosmética"
        >
          <defs>
            {/* Gradiente Rose Gold Metálico */}
            <linearGradient
              id={`rg-${uid}`}
              x1="15"
              y1="15"
              x2="185"
              y2="185"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#D79E92" />
              <stop offset="35%" stopColor="#B76E79" />
              <stop offset="68%" stopColor="#E3B1A6" />
              <stop offset="100%" stopColor="#9C5962" />
            </linearGradient>

            {/* Trayectoria curva superior para "FORMA" */}
            <path
              id={`topArc-${uid}`}
              d="M 34,100 A 66,66 0 1,1 166,100"
              fill="none"
            />

            {/* Trayectoria curva inferior para "ESTUDIO & COSMÉTICA" */}
            <path
              id={`bottomArc-${uid}`}
              d="M 27,100 A 73,73 0 1,0 173,100"
              fill="none"
            />
          </defs>

          {/* Círculo Exterior Rose Gold */}
          <circle
            cx="100"
            cy="100"
            r="93"
            stroke={`url(#rg-${uid})`}
            strokeWidth="4.2"
          />
          <circle
            cx="100"
            cy="100"
            r="89"
            stroke={`url(#rg-${uid})`}
            strokeWidth="0.9"
            strokeOpacity="0.45"
          />

          {/* Texto Curvo Superior: FORMA */}
          <text
            fill={`url(#rg-${uid})`}
            fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
            fontSize="24"
            fontWeight="600"
            letterSpacing="6px"
          >
            <textPath
              href={`#topArc-${uid}`}
              startOffset="50%"
              textAnchor="middle"
            >
              FORMA
            </textPath>
          </text>

          {/* Texto Curvo Inferior: ESTUDIO & COSMÉTICA */}
          <text
            fill={`url(#rg-${uid})`}
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="13.5"
            fontWeight="500"
            letterSpacing="3.4px"
          >
            <textPath
              href={`#bottomArc-${uid}`}
              startOffset="50%"
              textAnchor="middle"
            >
              ESTUDIO &amp; COSMÉTICA
            </textPath>
          </text>

          {/* Estrella 4 puntas Izquierda + Punto Izquierdo */}
          <path
            d="M44 66 L46 72.5 L52.5 74.5 L46 76.5 L44 83 L42 76.5 L35.5 74.5 L42 72.5 Z"
            fill={`url(#rg-${uid})`}
          />
          <circle cx="38" cy="100" r="3.8" fill={`url(#rg-${uid})`} />

          {/* Estrella 4 puntas Derecha + Punto Derecho */}
          <path
            d="M156 66 L158 72.5 L164.5 74.5 L158 76.5 L156 83 L154 76.5 L147.5 74.5 L154 72.5 Z"
            fill={`url(#rg-${uid})`}
          />
          <circle cx="162" cy="100" r="3.8" fill={`url(#rg-${uid})`} />

          {/* CEJA SUPERIOR ESCULPIDA (Con los 3 cortes iniciales a la izquierda y arco suave) */}
          <path
            d="M62 99 C60 95, 60.5 90, 62 86.5 L63.8 92.8 C63.5 88.5, 64.2 85, 65.8 82.5 L67.2 89.2 C67.2 85.2, 68.2 82.2, 70 80 C84 68.5, 103 63, 121 67.5 C128 69.2, 134 72.8, 138.5 77 C131 74.2, 121.5 72.8, 111 74.2 C95.5 76.2, 79 84.5, 65.5 98.5 C64.2 99.8, 62.8 100.2, 62 99 Z"
            fill={`url(#rg-${uid})`}
          />

          {/* LÍNEA DE PÁRPADO INFERIOR Y PESTAÑAS LARGAS CURVADAS */}
          {/* Línea principal del párpado */}
          <path
            d="M57 122.5 C69 115.5, 81 119.5, 95 119.5 C113.5 119.5, 129 109.5, 139.5 92.5 C132 112.5, 115.5 124.2, 95.5 123.5 C81.5 123, 69 118, 57 122.5 Z"
            fill={`url(#rg-${uid})`}
          />

          {/* Abanico de pestañas individuales curvadas (de izquierda a derecha) */}
          <g
            stroke={`url(#rg-${uid})`}
            strokeWidth="1.65"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M75 119.5 C74.5 123.5, 75.5 126.5, 77 128.5" />
            <path d="M78.5 120.2 C78.2 124.8, 79.5 128.2, 81.5 130.5" />
            <path d="M82 120.8 C82 125.8, 83.5 129.8, 86 132" />
            <path d="M85.8 121.2 C86.2 126.5, 88 130.5, 90.8 133" />
            <path d="M89.5 121.5 C90.2 127, 92.5 131, 95.8 133.5" />
            <path d="M93.5 121.6 C94.8 127.2, 97.5 131.2, 101 133.5" />
            <path d="M97.5 121.5 C99.2 127, 102.5 131, 106.5 133" />
            <path d="M101.8 121 C104 126.5, 107.8 130.2, 112.2 132" />
            <path d="M106 120.2 C108.8 125.5, 113 129, 118 130.5" />
            <path d="M110.2 119 C113.8 124, 118.5 127.2, 124 128.2" />
            <path d="M114.5 117.4 C118.8 122, 124 124.8, 129.8 125" />
            <path d="M119 115.2 C123.8 119.5, 129.5 121.5, 135.5 121" />
            <path d="M123.5 112.4 C128.8 116, 135 117.5, 141.2 116" />
            <path d="M128 109 C133.8 112, 140.2 112.5, 146.5 110.2" />
            <path d="M132.2 104.8 C138.2 107, 144.2 106.8, 150 103.8" />
          </g>
        </svg>
      </div>

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
