import React from 'react';
import {
  MapPin,
  Instagram,
  Truck,
  Sparkles,
  ExternalLink,
  Store,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface PartnerBannerProps {
  onExploreCatalog?: () => void;
}

export const PartnerBanner: React.FC<PartnerBannerProps> = ({ onExploreCatalog }) => {
  const handleScrollToCatalog = () => {
    if (onExploreCatalog) {
      onExploreCatalog();
    } else {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Espacio comercial aliado Castiel Vanity en Ocaña"
      className="py-12 sm:py-16 bg-[#FAF7F5] relative overflow-hidden"
    >
      {/* Subtle Ambient Decorative Glows */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#F4C2C2]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#E8A598]/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Editorial Container Card */}
        <div className="bg-gradient-to-br from-white via-[#FDF2F4]/50 to-white rounded-3xl sm:rounded-[2.5rem] border border-[#F4C2C2]/70 shadow-luxury overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Visual Column (Storefront / Reference Photo) */}
            <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden bg-[#2D2926]">
              <img
                src="/castiel-vanity.png"
                alt="Fachada y boutique oficial de Castiel Vanity en Ocaña - Calle 11 # 15-52"
                className="w-full h-full object-cover sm:object-contain object-center scale-100 hover:scale-105 transition-transform duration-700 bg-[#2D2926]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/85 via-[#2D2926]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#2D2926]/40" />

              {/* Floating Reference Tag */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-xs font-bold shadow-sm">
                  <Store className="w-3.5 h-3.5 text-[#B76E79]" />
                  Local Físico en Ocaña
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2D2926]/85 backdrop-blur-md text-[#F4C2C2] text-[10px] font-semibold uppercase tracking-wider">
                  Foto de referencia
                </span>
              </div>

              {/* Mobile overlay headline for depth */}
              <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
                <p className="text-[11px] uppercase tracking-widest text-[#F4C2C2] font-semibold">
                  Alianza Comercial • Ocaña
                </p>
                <h3 className="font-serif text-2xl font-bold leading-tight drop-shadow-sm">
                  Castiel Vanity
                </h3>
              </div>
            </div>

            {/* Content & Details Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* Partner Header Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F4] border border-[#F4C2C2] text-[#B76E79] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Espacio Comercial Aliado
                  </span>
                  <span className="text-xs text-[#2D2926]/60">
                    Ocaña, Norte de Santander
                  </span>
                </div>

                {/* Main Headline */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D2926] leading-tight">
                  Conoce el local físico de{' '}
                  <span className="text-[#B76E79] italic">Castiel Vanity</span>
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#2D2926]/75 leading-relaxed">
                  Para quienes aman descubrir y probar productos de belleza y cuidado de la piel en persona, 
                  los invitamos a visitar la boutique física de nuestros amigos de{' '}
                  <strong className="text-[#2D2926]">Castiel Vanity</strong> en Ocaña. 
                  Encuentra cosmética de alta calidad o recíbela cómodamente en tu puerta a través de{' '}
                  <strong className="text-[#B76E79]">FORMA Essentials</strong>.
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
                  {/* Location Card */}
                  <a
                    href="https://maps.app.goo.gl/M7gwtHiJPgDxpkte8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-white hover:bg-[#FDF2F4] border border-[#F4C2C2]/60 hover:border-[#B76E79] shadow-sm flex items-start gap-3 transition-all group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] group-hover:bg-[#B76E79] border border-[#F4C2C2] text-[#B76E79] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-[#2D2926]">Dirección Boutique</h4>
                        <ExternalLink className="w-2.5 h-2.5 text-[#B76E79] opacity-70 group-hover:opacity-100" />
                      </div>
                      <p className="text-xs text-[#2D2926]/75 mt-0.5 font-medium leading-snug">
                        Calle 11 # 15-52, Barrio San Agustín
                      </p>
                      <span className="text-[11px] text-[#B76E79] font-medium underline">Ver ubicación en Google Maps ↗</span>
                    </div>
                  </a>

                  {/* Delivery Benefit Highlight */}
                  <div className="p-3.5 rounded-2xl bg-[#FDF2F4]/80 border border-[#B76E79]/30 shadow-sm flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2D2926] text-[#F4C2C2] flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#2D2926]">Domicilio GRATIS</h4>
                        <span className="px-1.5 py-0.5 rounded-md bg-[#6B9080] text-white text-[9px] font-bold tracking-wide">
                          5:00 PM
                        </span>
                      </div>
                      <p className="text-xs text-[#2D2926]/75 mt-0.5 font-medium leading-snug">
                        Pide en FORMA y recibe gratis en Ocaña a partir de las 5 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="pt-2 border-t border-[#F4C2C2]/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Direct Instagram Link to Castiel Vanity */}
                <a
                  href="https://www.instagram.com/castielvanity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2D2926] to-[#3E3834] hover:from-[#B76E79] hover:to-[#9A5660] text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 group"
                >
                  <Instagram className="w-4 h-4 text-[#F4C2C2] group-hover:text-white transition-colors" />
                  <span>Seguir @castielvanity en Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Secondary Button to Browse Catalog */}
                <button
                  type="button"
                  onClick={handleScrollToCatalog}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#FDF2F4] text-[#2D2926] border border-[#F4C2C2] text-xs sm:text-sm font-semibold transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#B76E79]" />
                  <span>Explorar Productos en FORMA</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
