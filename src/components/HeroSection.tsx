import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Award,
  Truck,
  Banknote,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ExternalLink,
  Store,
  Instagram
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { settings, openBookingModal } = useStore();

  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-rotate every 6 seconds unless paused by hover/touch
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: '100% Originales',
      desc: 'Cosmética dermatológica',
    },
    {
      icon: Award,
      title: 'Curado por Eslen',
      desc: 'Calidad de estudio',
    },
    {
      icon: Truck,
      title: 'Domicilio Gratis',
      desc: 'En Ocaña desde las 5 PM',
    },
    {
      icon: Banknote,
      title: 'Contra Entrega',
      desc: 'Efectivo o Nequi',
    },
  ];

  const marqueeItems = [
    'DISEÑO DE CEJAS BY ESLEN • REALZA TU MIRADA',
    'AGENDA TU CITA ONLINE EN SEGUNDOS',
    'DEPILACIÓN EN CERA O GILLETTE & PIGMENTACIÓN',
    'CUIDADO DE CEJAS, PESTAÑAS & ROSTRO',
    'ENTREGAS RÁPIDAS EN OCAÑA',
  ];

  return (
    <section
      aria-label="Portada visual FORMA por Eslen en Ocaña"
      className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F4] via-[#FAF7F5] to-[#FAF7F5] pt-3 sm:pt-8"
    >
      {/* Subtle Luxury Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4C2C2]/35 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -left-24 w-80 h-80 rounded-full bg-[#E8A598]/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative pb-8 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* =========================================================
              1. VISUAL-FIRST SHOWCASE (First on Mobile, Right/Dominant on Desktop)
             ========================================================= */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Slide Selector Header (Tabs + Controls) */}
              <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveSlide(0)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                      activeSlide === 0
                        ? 'bg-[#2D2926] text-[#FAF7F5] shadow-sm ring-2 ring-[#B76E79]/40'
                        : 'bg-white/80 text-[#2D2926]/70 hover:bg-white border border-[#F4C2C2]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A598]" />
                    <span>Estudio Cejas Eslen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSlide(1)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                      activeSlide === 1
                        ? 'bg-[#B76E79] text-white shadow-sm ring-2 ring-[#F4C2C2]'
                        : 'bg-white/80 text-[#2D2926]/70 hover:bg-white border border-[#F4C2C2]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FDF2F4] animate-pulse" />
                    <span>Aliado Castiel Vanity</span>
                  </button>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-[#F4C2C2] text-[#2D2926] flex items-center justify-center transition-all shadow-xs active:scale-95"
                    aria-label="Diapositiva anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-[#F4C2C2] text-[#2D2926] flex items-center justify-center transition-all shadow-xs active:scale-95"
                    aria-label="Diapositiva siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Editorial Visual Frame with 2 Rotating Slides */}
              <div
                className="relative rounded-3xl overflow-hidden border-2 sm:border-4 border-white shadow-luxury bg-[#2D2926] aspect-[4/3.6] sm:aspect-[16/11]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* =========================================================
                    SLIDE 0: FORMA & ESLEN BROW STUDIO
                   ========================================================= */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    activeSlide === 0
                      ? 'opacity-100 z-10 pointer-events-auto'
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src="/hero-brows.jpg"
                    alt="Diseño de Cejas, Depilación y Pigmentación Semipermanente by Eslen en Ocaña"
                    className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-700 hover:scale-105"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/90 via-[#2D2926]/25 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-[11px] font-bold tracking-wider shadow-sm">
                      <MapPin className="w-3 h-3 text-[#B76E79]" />
                      {settings.city}
                    </span>

                    <button
                      type="button"
                      onClick={() => openBookingModal()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D2926]/90 backdrop-blur-md text-white border border-[#F4C2C2]/40 text-[11px] font-semibold shadow-sm hover:bg-[#B76E79] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#6B9080] animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-[#6B9080] -ml-3.5" />
                      <span>Agenda Abierta</span>
                    </button>
                  </div>

                  {/* Floating Product Mini-Card (Top-Right / Side Visual Accent on Tablet/Desktop) */}
                  <button
                    type="button"
                    onClick={() => scrollTo('catalogo')}
                    className="hidden sm:flex absolute top-16 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2 pr-3.5 shadow-xl border border-[#F4C2C2] items-center gap-2.5 text-left group hover:scale-105 transition-all"
                  >
                    <img
                      src="/forma-serum.jpg"
                      alt="Suero de Cejas y Pestañas FORMA"
                      className="w-11 h-11 rounded-xl object-cover border border-[#F4C2C2]"
                    />
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-[#B76E79]">
                        FAVORITO EN TIENDA
                      </span>
                      <span className="block font-serif text-sm font-bold text-[#2D2926] group-hover:text-[#B76E79]">
                        Brow &amp; Lash Serum
                      </span>
                      <span className="block text-[10px] text-[#6B9080] font-semibold">
                        Ver en catálogo →
                      </span>
                    </div>
                  </button>

                  {/* Bottom Visual Campaign Overlay: Eslen Portrait + Visual Title */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src="/eslen-profile.jpg"
                          alt="Eslen — Especialista en Diseño de Cejas FORMA"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#F4C2C2] shadow-lg"
                        />
                        <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#B76E79] text-white text-[9px] font-bold shadow">
                          Eslen
                        </span>
                      </div>

                      <div className="min-w-0 text-white">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#F4C2C2] font-bold uppercase tracking-[0.18em]">
                          <span>✦ Diseño de Cejas by Eslen</span>
                        </div>
                        <p className="font-serif text-xl sm:text-3xl font-bold leading-tight text-white drop-shadow-sm">
                          Miradas reales, esculpidas a tu medida.
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#FAF7F5]/90">
                          <div className="flex text-[#F4C2C2]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#F4C2C2]" />
                            ))}
                          </div>
                          <span className="font-semibold">4.9/5</span>
                          <span className="opacity-80">• +450 clientas en Ocaña</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =========================================================
                    SLIDE 1: CASTIEL VANITY BOUTIQUE ALIADA (PUNTO FÍSICO REAL)
                   ========================================================= */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    activeSlide === 1
                      ? 'opacity-100 z-10 pointer-events-auto'
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Ambient Blurred Background (Matches store tones, eliminates empty bars) */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src="/castiel-vanity.png"
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover blur-2xl scale-125 opacity-35 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#2D2926]/90 via-[#2D2926]/50 to-[#2D2926]/90" />
                  </div>

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-[11px] font-bold tracking-wider shadow-sm pointer-events-auto">
                      <Store className="w-3.5 h-3.5 text-[#B76E79]" />
                      Local Físico Aliado
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D2926]/90 backdrop-blur-md text-[#F4C2C2] border border-[#F4C2C2]/40 text-[11px] font-semibold shadow-sm pointer-events-auto">
                      <Truck className="w-3.5 h-3.5 text-[#6B9080]" />
                      <span>Domicilio Gratis 5 PM</span>
                    </span>
                  </div>

                  {/* =========================================================
                      DESKTOP & TABLET VIEW (Side-by-Side Split Showcase)
                     ========================================================= */}
                  <div className="hidden sm:flex relative z-10 w-full h-full items-center justify-between p-4 pt-14 lg:p-6 lg:pt-16 gap-5 lg:gap-7">
                    {/* Left: Framed Real Storefront Photo */}
                    <div className="h-full w-[44%] lg:w-[40%] flex items-center justify-center shrink-0">
                      <div className="relative h-full max-h-[95%] w-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-[#2D2926]/80 group">
                        <img
                          src="/castiel-vanity.png"
                          alt="Entrada oficial de la boutique Castiel Vanity en Ocaña - Calle 11 # 15-52"
                          className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <a
                            href="https://maps.app.goo.gl/M7gwtHiJPgDxpkte8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2D2926]/90 hover:bg-[#B76E79] backdrop-blur-md border border-[#F4C2C2]/40 text-[10px] font-bold text-[#FAF7F5] transition-colors"
                          >
                            <span>Calle 11 # 15-52 • San Agustín</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right: Editorial Story & Information Block */}
                    <div className="flex-1 flex flex-col justify-between text-left text-white space-y-2 lg:space-y-3 py-1">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] lg:text-xs text-[#F4C2C2] font-bold uppercase tracking-[0.18em]">
                          <Sparkles className="w-3.5 h-3.5 text-[#E8A598]" />
                          <span>Espacio Comercial Aliado</span>
                        </div>
                        <h3 className="font-serif text-2xl lg:text-3xl font-bold leading-tight text-white drop-shadow-sm mt-0.5">
                          Castiel Vanity Boutique
                        </h3>
                        <p className="text-[11px] lg:text-xs text-[#FAF7F5]/85 line-clamp-2 leading-relaxed mt-1">
                          Visita su hermosa boutique de cosmética y skincare en San Agustín, o pide sus productos directamente con entrega gratis en FORMA.
                        </p>
                      </div>

                      {/* Detail Cards */}
                      <div className="space-y-1.5 lg:space-y-2">
                        <a
                          href="https://maps.app.goo.gl/M7gwtHiJPgDxpkte8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-2.5 p-2 lg:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-[#F4C2C2]/40 text-white transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-[#B76E79]/40 border border-[#F4C2C2]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <MapPin className="w-3.5 h-3.5 text-[#F4C2C2]" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[9px] uppercase tracking-wider text-[#F4C2C2] font-bold">
                                Dirección Física en Ocaña
                              </span>
                              <span className="block text-xs font-semibold truncate text-[#FAF7F5]">
                                Calle 11 # 15-52, Barrio San Agustín
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 text-[10px] text-[#F4C2C2] font-bold underline decoration-[#F4C2C2]/60 group-hover:text-white flex items-center gap-1">
                            <span>Ver en Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </a>

                        <div className="flex items-center gap-2.5 p-2 lg:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
                          <div className="w-7 h-7 rounded-lg bg-[#6B9080]/40 border border-[#6B9080]/40 flex items-center justify-center shrink-0">
                            <Truck className="w-3.5 h-3.5 text-[#6B9080]" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[9px] uppercase tracking-wider text-[#6B9080] font-bold">
                              Envíos FORMA
                            </span>
                            <span className="block text-xs font-semibold truncate text-[#FAF7F5]">
                              Domicilio GRATIS en Ocaña a partir de las 5:00 PM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Call to Actions */}
                      <div className="pt-1 flex items-center gap-2.5">
                        <a
                          href="https://www.instagram.com/castielvanity"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9A5660] hover:brightness-110 text-white text-xs font-bold shadow-md transition-all active:scale-95 group"
                        >
                          <Instagram className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                          <span>@castielvanity</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>

                        <button
                          type="button"
                          onClick={() => scrollTo('catalogo')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20 active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#F4C2C2]" />
                          <span>Ver Catálogo FORMA</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      MOBILE VIEW (Full-Bleed Visual with Lower Overlay)
                     ========================================================= */}
                  <div className="sm:hidden relative z-10 w-full h-full flex flex-col justify-between overflow-hidden">
                    {/* Centered Storefront Image */}
                    <div className="absolute inset-0 flex items-center justify-center pt-10 pb-16">
                      <img
                        src="/castiel-vanity.png"
                        alt="Boutique Castiel Vanity en Ocaña - Calle 11 # 15-52"
                        className="h-full w-auto max-w-full object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* Gradient Overlay for bottom text legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2D2926] via-[#2D2926]/90 to-transparent pointer-events-none" />

                    {/* Mobile Bottom Content Overlay */}
                    <div className="relative mt-auto p-3.5 pb-3 text-white z-20 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#F4C2C2] font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-[#E8A598]" />
                            <span>Espacio Aliado</span>
                          </div>
                          <h3 className="font-serif text-lg font-bold leading-tight text-white truncate drop-shadow-sm">
                            Castiel Vanity Boutique
                          </h3>
                        </div>

                        {/* Direct Instagram Action Button on Mobile */}
                        <a
                          href="https://www.instagram.com/castielvanity"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B76E79] text-white text-[11px] font-bold shadow-md active:scale-95"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span>Instagram</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </a>
                      </div>

                      {/* Compact Address + Delivery Pill */}
                      <div className="flex items-center justify-between text-[10px] text-[#FAF7F5]/90 pt-0.5">
                        <a
                          href="https://maps.app.goo.gl/M7gwtHiJPgDxpkte8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 truncate font-medium hover:underline text-[#FAF7F5] bg-white/10 px-2 py-0.5 rounded-lg border border-white/15"
                        >
                          <MapPin className="w-3 h-3 text-[#F4C2C2] shrink-0" />
                          <span>Calle 11 # 15-52 (Maps ↗)</span>
                        </a>
                        <span className="font-bold text-[#6B9080] shrink-0 ml-2">
                          🛵 Domicilio Gratis 5 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Slide Indicator Progress Dots */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveSlide(0)}
                    aria-label="Ir a diapositiva 1: Estudio Cejas"
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeSlide === 0 ? 'w-6 bg-[#FAF7F5]' : 'w-2 bg-[#FAF7F5]/40 hover:bg-[#FAF7F5]/70'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveSlide(1)}
                    aria-label="Ir a diapositiva 2: Aliado Castiel Vanity"
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeSlide === 1 ? 'w-6 bg-[#B76E79]' : 'w-2 bg-[#FAF7F5]/40 hover:bg-[#FAF7F5]/70'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              2. CONCISE ACTION & BOOKING FOCUS (Direct & Easy Access)
             ========================================================= */}
          <div className="order-2 lg:order-1 lg:col-span-5 text-center lg:text-left space-y-4 sm:space-y-5">
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F4C2C2] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2D2926]">
                Brow Studio &amp; Beauty Boutique
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-bold text-[#2D2926] leading-[1.12]">
              Diseño de Cejas por{' '}
              <span className="italic font-normal text-[#B76E79] underline decoration-[#F4C2C2] underline-offset-4">
                Eslen
              </span>{' '}
              &amp; Cuidado Esencial.
            </h1>

            <p className="text-xs sm:text-sm text-[#2D2926]/75 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Reserva tu cita de cejas en segundos o recibe hoy mismo en Ocaña los productos de cuidado para cejas, pestañas y rostro que Eslen recomienda.
            </p>

            {/* Primary CTAs — "Agendar Cita" is #1 with Continuous Subtle Loop Animation */}
            <div className="pt-1 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="animate-cta-loop inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#B76E79] via-[#9A5660] to-[#B76E79] text-white font-bold px-6 py-4 rounded-2xl text-sm sm:text-base border border-white/25"
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span>Agendar Cita con Eslen</span>
                <ArrowRight className="w-4 h-4 shrink-0 opacity-90" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('catalogo')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FDF2F4] text-[#2D2926] font-semibold px-6 py-3.5 sm:py-4 rounded-2xl border-2 border-[#E8A598] shadow-sm transition-all active:scale-95 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4 text-[#B76E79]" />
                <span>Ver Productos de Cuidado</span>
                <ArrowRight className="w-4 h-4 text-[#B76E79]" />
              </button>
            </div>

            {/* Quick Service Pills linking to Booking / Rituals */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <button
                type="button"
                onClick={() => scrollTo('citas-eslen')}
                className="text-[11px] font-semibold text-[#B76E79] hover:text-[#2D2926] bg-white/90 px-3 py-1.5 rounded-full border border-[#F4C2C2] transition-colors"
              >
                ✦ Ver precios de Diseño de Cejas ↓
              </button>
              <button
                type="button"
                onClick={() => scrollTo('catalogo')}
                className="text-[11px] font-semibold text-[#2D2926]/75 hover:text-[#B76E79] bg-white/90 px-3 py-1.5 rounded-full border border-[#F4C2C2] transition-colors"
              >
                ✦ Pago Contra Entrega en Ocaña
              </button>
            </div>
          </div>
        </div>

        {/* Compact Visual Trust Strip */}
        <div className="mt-7 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="bg-white/90 hover:bg-white rounded-2xl p-3 sm:p-3.5 border border-[#F4C2C2]/50 shadow-soft flex items-center gap-2.5 transition-all"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center shrink-0 text-[#B76E79]">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-sans text-xs font-bold text-[#2D2926] leading-tight truncate">
                    {badge.title}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-[#2D2926]/65 truncate">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          PREMIUM EDITORIAL TRANSITION BRIDGE (HERO -> SHOPPING)
         ========================================================= */}
      <div className="relative">
        <div className="relative w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-8 sm:h-12"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,40 C320,95 620,0 960,50 C1200,85 1350,35 1440,20 L1440,100 L0,100 Z"
              fill="#FDF2F4"
              opacity="0.7"
            />
            <path
              d="M0,65 C380,15 760,95 1120,40 C1280,15 1380,45 1440,60 L1440,100 L0,100 Z"
              fill="#2D2926"
            />
            <path
              d="M0,65 C380,15 760,95 1120,40 C1280,15 1380,45 1440,60"
              fill="none"
              stroke="#B76E79"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Luxury Rose-Gold & Charcoal Infinite Ribbon */}
        <div className="bg-[#2D2926] py-3 border-b border-[#B76E79]/40 overflow-hidden relative">
          <div className="animate-marquee flex items-center">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 mx-3 text-[11px] sm:text-xs font-semibold tracking-[0.24em] text-[#FAF7F5]/90 uppercase shrink-0"
              >
                <span>{item}</span>
                <span className="text-[#E8A598] text-sm">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Central Transition Medallion into Store */}
        <div className="bg-luxury-silk pt-5 pb-1 flex flex-col items-center justify-center relative">
          <button
            onClick={() => scrollTo('catalogo')}
            className="group inline-flex flex-col items-center gap-1 focus:outline-none"
            aria-label="Explorar catálogo de productos FORMA"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B76E79]">
              Catálogo Seleccionado por Eslen
            </span>
            <div className="w-8 h-8 rounded-full bg-white border border-[#E8A598] shadow-soft flex items-center justify-center text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-white transition-all">
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
