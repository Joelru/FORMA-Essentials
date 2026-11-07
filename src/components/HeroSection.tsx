import React from 'react';
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
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EXTERNAL_BOOKING_URL } from './BookingSection';

export const HeroSection: React.FC = () => {
  const { settings, trackBookingRedirect } = useStore();
  const bookingUrl = settings.bookingUrl || EXTERNAL_BOOKING_URL;

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
      title: 'Envíos en Ocaña',
      desc: 'Entrega el mismo día',
    },
    {
      icon: Banknote,
      title: 'Contra Entrega',
      desc: 'Efectivo, Nequi o Daviplata',
    },
  ];

  const marqueeItems = [
    'DISEÑO ARQUITECTÓNICO DE CEJAS POR ESLEN',
    'AGENDA TU CITA ONLINE EN SEGUNDOS',
    'CUIDADO DE CEJAS, PESTAÑAS & ROSTRO',
    'VISAGISMO ÁUREO & BROW LAMINATION',
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
              {/* Main Editorial Visual Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 sm:border-4 border-white shadow-luxury bg-[#2D2926] aspect-[4/3.6] sm:aspect-[16/11]">
                <img
                  src="/hero-brows.jpg"
                  alt="Diseño Profesional de Cejas, Laminado y Visagismo por Eslen en Ocaña"
                  className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-700 hover:scale-105"
                  fetchPriority="high"
                />
                {/* Editorial Gradient Overlay so visual + minimal title blend like a luxury campaign */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/90 via-[#2D2926]/25 to-transparent" />

                {/* Top Floating Badges */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-[11px] font-bold tracking-wider shadow-sm">
                    <MapPin className="w-3 h-3 text-[#B76E79]" />
                    {settings.city}
                  </span>

                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingRedirect('Portada (Insignia Agenda Abierta)')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D2926]/90 backdrop-blur-md text-white border border-[#F4C2C2]/40 text-[11px] font-semibold shadow-sm hover:bg-[#B76E79] transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#6B9080] animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-[#6B9080] -ml-3.5" />
                    <span>Agenda Abierta</span>
                  </a>
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
                    {/* Eslen's Real Photo Avatar */}
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
                        <span>✦ Visagismo &amp; Laminado</span>
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
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingRedirect('Botón Principal Portada (Agendar Cita)')}
                className="animate-cta-loop inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#B76E79] via-[#9A5660] to-[#B76E79] text-white font-bold px-6 py-4 rounded-2xl text-sm sm:text-base border border-white/25"
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span>Agendar Cita con Eslen</span>
                <ExternalLink className="w-4 h-4 shrink-0 opacity-90" />
              </a>

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
                ✦ Ver precios de Cejas y Laminado ↓
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
