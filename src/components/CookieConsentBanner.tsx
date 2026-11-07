import React from 'react';
import { Cookie, Settings2, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CookieConsentBanner: React.FC = () => {
  const { cookieConsent, saveCookieConsent, setLegalModalTab } = useStore();

  // Hide banner once user has accepted or configured preferences
  if (cookieConsent !== null) return null;

  return (
    <aside
      aria-label="Aviso de permisos de cookies y términos legales"
      className="fixed bottom-[4.4rem] md:bottom-5 left-3 right-3 md:left-6 md:right-auto md:max-w-md z-40 bg-[#2D2926]/95 backdrop-blur-md text-[#FAF7F5] rounded-2xl p-4 sm:p-5 border border-[#B76E79]/60 shadow-2xl animate-slideUp"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#B76E79]/25 border border-[#B76E79] flex items-center justify-center shrink-0 text-[#F4C2C2] mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
            Privacidad, Cookies &amp; Términos FORMA
          </h3>
          <p className="text-[11px] sm:text-xs text-[#FAF7F5]/80 mt-1 leading-relaxed">
            Usamos cookies propias para guardar tu bolsa de compras, asegurar el stock en tiempo real y mejorar tu experiencia en Ocaña. Al continuar, aceptas nuestros{' '}
            <button
              type="button"
              onClick={() => setLegalModalTab('terms')}
              className="text-[#F4C2C2] underline font-semibold hover:text-white"
            >
              Términos y Condiciones
            </button>{' '}
            y{' '}
            <button
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="text-[#F4C2C2] underline font-semibold hover:text-white"
            >
              Política de Datos
            </button>
            .
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                saveCookieConsent({
                  essential: true,
                  analytics: true,
                  marketing: true,
                })
              }
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#B76E79] hover:bg-[#9A5660] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Aceptar todas</span>
            </button>

            <button
              type="button"
              onClick={() =>
                saveCookieConsent({
                  essential: true,
                  analytics: false,
                  marketing: false,
                })
              }
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F5] text-xs font-medium border border-white/15 transition-colors"
            >
              Solo esenciales
            </button>

            <button
              type="button"
              onClick={() => setLegalModalTab('cookies')}
              className="px-3 py-2 rounded-xl text-[#F4C2C2] hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Configurar</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
