import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Cookie,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LegalModal: React.FC = () => {
  const {
    legalModalTab,
    setLegalModalTab,
    cookieConsent,
    saveCookieConsent,
    settings,
  } = useStore();

  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(
    cookieConsent ? cookieConsent.analytics : true
  );
  const [marketingEnabled, setMarketingEnabled] = useState<boolean>(
    cookieConsent ? cookieConsent.marketing : true
  );

  useEffect(() => {
    if (cookieConsent) {
      setAnalyticsEnabled(cookieConsent.analytics);
      setMarketingEnabled(cookieConsent.marketing);
    }
  }, [cookieConsent]);

  if (!legalModalTab) return null;

  const handleSaveCookiePrefs = () => {
    saveCookieConsent({
      essential: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
    });
    setLegalModalTab(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#2D2926]/65 backdrop-blur-sm animate-fadeIn"
      onClick={() => setLegalModalTab(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Información Legal, Términos y Condiciones y Política de Cookies de FORMA"
        className="relative w-full max-w-2xl bg-[#FAF7F5] rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#F4C2C2] shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 px-4 py-4 sm:px-6 bg-white border-b border-[#F4C2C2]/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center text-[#B76E79] shrink-0">
              {legalModalTab === 'terms' && <FileText className="w-4 h-4" />}
              {legalModalTab === 'privacy' && <ShieldCheck className="w-4 h-4" />}
              {legalModalTab === 'cookies' && <Cookie className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2926] leading-tight">
                Centro Legal &amp; Privacidad FORMA
              </h2>
              <p className="text-[11px] text-[#2D2926]/60">
                {settings.brandName} — Estudio &amp; Cosmética por {settings.ownerName} • {settings.city}
              </p>
            </div>
          </div>

          <button
            onClick={() => setLegalModalTab(null)}
            className="w-8 h-8 rounded-full bg-[#FDF2F4] hover:bg-[#F4C2C2] text-[#2D2926] flex items-center justify-center transition-colors shrink-0"
            aria-label="Cerrar ventana legal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="shrink-0 bg-[#FDF2F4]/70 px-4 py-2 border-b border-[#F4C2C2]/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setLegalModalTab('terms')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              legalModalTab === 'terms'
                ? 'bg-[#2D2926] text-white shadow-sm'
                : 'bg-white text-[#2D2926]/80 border border-[#F4C2C2] hover:bg-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#E8A598]" />
            <span>Términos y Condiciones</span>
          </button>

          <button
            type="button"
            onClick={() => setLegalModalTab('privacy')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              legalModalTab === 'privacy'
                ? 'bg-[#2D2926] text-white shadow-sm'
                : 'bg-white text-[#2D2926]/80 border border-[#F4C2C2] hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8A598]" />
            <span>Privacidad y Datos (Habeas Data)</span>
          </button>

          <button
            type="button"
            onClick={() => setLegalModalTab('cookies')}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              legalModalTab === 'cookies'
                ? 'bg-[#2D2926] text-white shadow-sm'
                : 'bg-white text-[#2D2926]/80 border border-[#F4C2C2] hover:bg-white'
            }`}
          >
            <Cookie className="w-3.5 h-3.5 text-[#E8A598]" />
            <span>Permisos de Cookies</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-[#2D2926]/85 leading-relaxed">
          {legalModalTab === 'terms' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  1. Identificación del Comercio y Alcance
                </h3>
                <p>
                  Bienvenida al sitio web oficial de <strong>FORMA — Estudio &amp; Cosmética por Eslen</strong>, ubicado en <strong>{settings.city}, Colombia</strong>. Al realizar un pedido en nuestra tienda virtual o solicitar una cita de diseño de cejas, aceptas los presentes Términos y Condiciones regulados por la legislación colombiana (Ley 1480 de 2011 — Estatuto del Consumidor).
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  2. Autenticidad, Precios y Disponibilidad de Stock
                </h3>
                <p>
                  Todos los productos comercializados en <strong>FORMA</strong> (geles fijadores, sueros capilares, pomadas, lápices y kits) son <strong>100% originales</strong> y seleccionados bajo curaduría profesional. Los precios están expresados en Pesos Colombianos (COP). El sistema valida automáticamente el inventario disponible en tiempo real; cada pedido confirmado reserva las unidades seleccionadas.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  3. Despachos en Ocaña y Medios de Pago
                </h3>
                <p>
                  Realizamos entregas rápidas a domicilio en el casco urbano de Ocaña, Norte de Santander. Al finalizar tu pedido, nuestro equipo se comunicará a tu número de WhatsApp registrado para coordinar la entrega y el valor del domicilio según tu barrio. Aceptamos <strong>Pago en Efectivo Contra Entrega, Nequi y Daviplata</strong>.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  4. Garantías e Higiene en Productos de Cuidado Personal
                </h3>
                <p>
                  Por razones de bioseguridad e higiene dermatológica (Art. 47 num. 7 de la Ley 1480 de 2011 sobre bienes de uso personal), los productos cosméticos y de cuidado facial/capilar <strong>no tienen cambio ni devolución una vez abiertos, destapados o rotos sus sellos de seguridad</strong>, salvo por defectos de calidad o idoneidad verificables al momento de la entrega.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  5. Políticas de Citas en Cabina con Eslen
                </h3>
                <p>
                  Las solicitudes de citas para Diseño de Cejas, Visagismo y Laminado se confirman vía WhatsApp según disponibilidad de agenda. Te agradecemos asistir puntualmente o notificar cualquier reprogramación con mínimo 4 horas de anticipación.
                </p>
              </div>
            </div>
          )}

          {legalModalTab === 'privacy' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  1. Cumplimiento de la Ley 1581 de 2012 (Habeas Data)
                </h3>
                <p>
                  En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013 de la República de Colombia, <strong>FORMA — Estudio &amp; Cosmética por Eslen</strong> informa que los datos personales suministrados voluntariamente (nombre completo, número de celular/WhatsApp, barrio y dirección de entrega en Ocaña) son tratados bajo estricta confidencialidad.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  2. Finalidad del Tratamiento de tus Datos
                </h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Coordinar el alistamiento, facturación y despacho a domicilio de tus pedidos en Ocaña.</li>
                  <li>Contactarte vía WhatsApp para confirmar la hora exacta de tus citas de cejas con Eslen.</li>
                  <li>Brindarte asesoría personalizada posventa y garantía sobre tus productos.</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">
                  3. Derechos de las Titulares (ARCO)
                </h3>
                <p>
                  Como titular de tus datos tienes derecho en todo momento a conocer, actualizar, rectificar y solicitar la supresión de tu información personal escribiendo directamente a nuestro canal oficial de WhatsApp <strong>+57 {settings.whatsappNumber}</strong>. Nunca vendemos ni compartimos tu información con terceros ajenos a la entrega de tu pedido.
                </p>
              </div>
            </div>
          )}

          {legalModalTab === 'cookies' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#2D2926]/80">
                Utilizamos cookies propias y almacenamiento local seguro para que tu experiencia de compra en <strong>FORMA</strong> sea rápida, guarde los productos de tu bolsa y recuerde tus preferencias. Puedes personalizar tus permisos a continuación:
              </p>

              {/* Essential Cookies (Always Active) */}
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#6B9080]" />
                    <h4 className="font-serif text-base font-bold text-[#2D2926]">
                      Cookies Técnicas y Esenciales (Obligatorias)
                    </h4>
                  </div>
                  <p className="text-xs text-[#2D2926]/70">
                    Necesarias para conservar los productos que agregas a tu bolsa de compras, validar el stock disponible en tiempo real y recordar tus preferencias de privacidad.
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#6B9080]/15 text-[#6B9080] text-[11px] font-bold">
                  Siempre Activas
                </span>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#2D2926]">
                    Cookies de Rendimiento y Estadísticas
                  </h4>
                  <p className="text-xs text-[#2D2926]/70">
                    Nos ayudan a conocer cuáles son los productos y servicios de cejas favoritos en Ocaña para mantener siempre stock disponible en el estudio.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B76E79]" />
                </label>
              </div>

              {/* Personalization Cookies */}
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#2D2926]">
                    Cookies deExperiencia y Personalización
                  </h4>
                  <p className="text-xs text-[#2D2926]/70">
                    Permiten recordar tus filtros de categorías y mostrarte recomendaciones curadas por Eslen según tu rutina.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={marketingEnabled}
                    onChange={(e) => setMarketingEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B76E79]" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4 bg-white border-t border-[#F4C2C2]/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {legalModalTab === 'cookies' ? (
            <>
              <button
                type="button"
                onClick={handleSaveCookiePrefs}
                className="px-5 py-3 rounded-xl border border-[#F4C2C2] text-xs font-semibold text-[#2D2926] hover:bg-[#FDF2F4] transition-colors"
              >
                Guardar mi selección
              </button>
              <button
                type="button"
                onClick={() => {
                  saveCookieConsent({
                    essential: true,
                    analytics: true,
                    marketing: true,
                  });
                  setLegalModalTab(null);
                }}
                className="px-6 py-3 rounded-xl bg-[#B76E79] hover:bg-[#9A5660] text-white text-xs sm:text-sm font-semibold shadow-luxury flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Aceptar todas las cookies</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setLegalModalTab(null)}
              className="w-full sm:w-auto sm:ml-auto px-6 py-3 rounded-xl bg-[#2D2926] hover:bg-[#B76E79] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Entendido</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
