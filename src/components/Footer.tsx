import React from 'react';
import { Instagram, MapPin, Phone, Sparkles, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { cleanPhone } from '../utils/format';
import { FormaLogo } from './FormaLogo';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const whatsappClean = cleanPhone(settings.whatsappNumber);

  return (
    <footer className="bg-[#2D2926] text-[#FAF7F5] pt-14 pb-24 md:pb-12 border-t border-[#B76E79]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          {/* Brand Column with Full Presence */}
          <div className="md:col-span-5 space-y-3.5">
            <FormaLogo size="md" variant="light" showWordmark={true} showSubtitle={true} />
            <p className="text-xs sm:text-sm text-[#FAF7F5]/75 leading-relaxed max-w-md pt-1">
              Estudio especializado en diseño arquitectónico de cejas, visagismo, laminado
              profesional y boutique de maquillaje 100% original seleccionado por{' '}
              <strong>{settings.ownerName}</strong> con entregas rápidas en Ocaña, Norte de Santander.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-[#F4C2C2]">
              <MapPin className="w-4 h-4 text-[#B76E79] shrink-0" />
              <span>{settings.studioAddress}</span>
            </div>
          </div>

          {/* Quick Links (Public Store Only — Admin Hidden) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#F4C2C2] tracking-wide">
              Explorar FORMA
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF7F5]/80">
              <li>
                <a href="#catalogo" className="hover:text-[#F4C2C2] transition-colors">
                  Catálogo de Maquillaje & Cejas
                </a>
              </li>
              <li>
                <a href="#citas-eslen" className="hover:text-[#F4C2C2] transition-colors">
                  Agendar Cita de Cejas con Eslen
                </a>
              </li>
            </ul>
          </div>

          {/* Dynamic Social Networks */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#F4C2C2] tracking-wide">
              Síguenos & Contáctanos
            </h4>
            <p className="text-xs text-[#FAF7F5]/70">
              Conoce resultados reales de cejas y tutoriales de rutina en nuestras redes oficiales:
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              {/* Dynamic Instagram Button */}
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#B76E79] text-white text-xs font-semibold transition-all border border-white/10"
              >
                <Instagram className="w-4 h-4 text-[#F4C2C2]" />
                <div>
                  <span className="block text-[10px] text-white/60">Instagram</span>
                  <span>{settings.instagramHandle}</span>
                </div>
              </a>

              {/* Dynamic TikTok Button */}
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#B76E79] text-white text-xs font-semibold transition-all border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-[#F4C2C2]" />
                <div>
                  <span className="block text-[10px] text-white/60">TikTok Oficial</span>
                  <span>{settings.tiktokHandle}</span>
                </div>
              </a>
            </div>

            {/* Dynamic WhatsApp Business */}
            <div className="pt-2">
              <a
                href={`https://wa.me/57${whatsappClean}?text=${encodeURIComponent(
                  '¡Hola Eslen! Vengo desde la web de FORMA y quiero recibir asesoría.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B9080] bg-white px-4 py-2.5 rounded-xl hover:bg-[#FDF2F4] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#6B9080]" />
                <span>WhatsApp Estudio: +57 {settings.whatsappNumber}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F5]/55">
          <p>
            © {new Date().getFullYear()} <strong>FORMA</strong> por Eslen • Ocaña, Norte de Santander, Colombia.
          </p>
          <p className="flex items-center gap-1">
            Diseñado con estética Clean Girl & Luxury Beauty <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-[#B76E79]" />
          </p>
        </div>
      </div>

      {/* Floating Social / WhatsApp Action Buttons */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-30 flex flex-col gap-2">
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Instagram ${settings.instagramHandle}`}
          className="w-11 h-11 rounded-full bg-white text-[#2D2926] hover:bg-[#B76E79] hover:text-white border border-[#F4C2C2] shadow-luxury flex items-center justify-center transition-all"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href={`https://wa.me/57${whatsappClean}?text=${encodeURIComponent(
            '¡Hola Eslen! Estoy visitando FORMA y me gustaría consultar sobre un producto o cita.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Hablar con Eslen por WhatsApp"
          className="w-11 h-11 rounded-full bg-[#6B9080] hover:bg-[#57786a] text-white shadow-luxury flex items-center justify-center transition-all"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};
