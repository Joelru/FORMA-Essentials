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
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EXTERNAL_BOOKING_URL } from './BookingSection';

export const HeroSection: React.FC = () => {
  const { settings } = useStore();
  const bookingUrl = settings.bookingUrl || EXTERNAL_BOOKING_URL;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: 'Productos 100% Originales',
      desc: 'Fórmulas dermatológicas seguras',
    },
    {
      icon: Award,
      title: 'Aprobados por Eslen',
      desc: 'Curaduría experta de cabina',
    },
    {
      icon: Truck,
      title: 'Entregas Rápidas en Ocaña',
      desc: 'Despachos ágiles a tu barrio',
    },
    {
      icon: Banknote,
      title: 'Pago Contra Entrega o Transferencia',
      desc: 'Efectivo, Nequi o Daviplata',
    },
  ];

  const marqueeItems = [
    'DISEÑO ARQUITECTÓNICO DE CEJAS POR ESLEN',
    'BOUTIQUE DE MAQUILLAJE 100% ORIGINAL',
    'VISAGISMO ÁUREO & BROW LAMINATION',
    'ENTREGAS EL MISMO DÍA EN OCAÑA',
    'PAGO CONTRA ENTREGA • NEQUI • DAVIPLATA',
  ];

  return (
    <section
      aria-label="Portada principal FORMA por Eslen en Ocaña"
      className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F4] via-[#FAF7F5] to-[#FAF7F5] pt-6 sm:pt-12"
    >
      {/* Subtle Luxury Ambient Glows & Architectural Curves */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4C2C2]/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-80 h-80 rounded-full bg-[#E8A598]/20 blur-3xl" />

      {/* Delicate Rose Gold Architectural Contour Lines in Background */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.18]"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-100 180 C 320 40, 820 340, 1540 120"
          stroke="#B76E79"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <path
          d="M-100 520 C 420 680, 980 360, 1540 560"
          stroke="#E8A598"
          strokeWidth="1.5"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Location & Specialty Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#F4C2C2] shadow-sm mb-5">
              <MapPin className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#2D2926]">
                {settings.city} • Brow Bar &amp; Boutique
              </span>
            </div>

            {/* Editorial Magazine H1 */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#2D2926] leading-[1.12] tracking-tight">
              El arte de enmarcar tu mirada,{' '}
              <span className="italic font-normal text-[#B76E79] underline decoration-[#F4C2C2] underline-offset-4">
                esculpido por Eslen
              </span>
              .
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-[#2D2926]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Especialistas en <strong>diseño anatómico de cejas, visagismo y laminado profesional</strong> en Ocaña, junto a una selección exclusiva de maquillaje, fijadores y sueros que{' '}
              <strong className="text-[#2D2926] font-semibold">Eslen</strong> utiliza en cabina para tu rutina diaria.
            </p>

            {/* Two-Pillar Editorial Highlights */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-medium text-[#2D2926]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 border border-[#F4C2C2]/70 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B76E79]" />
                Diagnóstico de Visagismo Personalizado
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 border border-[#F4C2C2]/70 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6B9080]" />
                Cosmética Original con Envío Hoy
              </span>
            </div>

            {/* Primary High-Contrast CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => scrollTo('catalogo')}
                className="inline-flex items-center justify-center gap-2.5 bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold px-7 py-4 rounded-2xl shadow-luxury transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>Comprar Maquillaje</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FDF2F4] text-[#2D2926] font-semibold px-7 py-4 rounded-2xl border-2 border-[#E8A598] shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4 text-[#B76E79]" />
                <span>Agendar Cita de Cejas</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B76E79]" />
              </a>
            </div>

            {/* Social Proof & Founder Pill with Eslen's Real Photo */}
            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-[#2D2926]/75">
              <button
                type="button"
                onClick={() => scrollTo('citas-eslen')}
                className="flex items-center gap-2.5 bg-white/95 hover:bg-white pl-1.5 pr-3.5 py-1.5 rounded-full border border-[#F4C2C2]/80 shadow-sm transition-all"
              >
                <img
                  src="/eslen-profile.jpg"
                  alt="Eslen — Fundadora de FORMA"
                  className="w-7 h-7 rounded-full object-cover border border-[#B76E79]"
                />
                <span className="font-semibold text-[#2D2926]">
                  Por Eslen
                </span>
                <span className="text-[#B76E79]">•</span>
                <div className="flex text-[#B76E79]" aria-label="Calificación 4.9 de 5 estrellas">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3 h-3 fill-[#B76E79]" />
                  ))}
                </div>
                <span className="font-semibold text-[#2D2926]">4.9/5</span>
              </button>

              <div className="flex items-center gap-1 text-[#6B9080] font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>Domicilios rápidos en el casco urbano</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Luxury Card with Realistic Sculpted Eyebrows + Eslen Mini Portrait */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-luxury bg-[#FDF2F4] aspect-[4/4.2]">
                <img
                  src="/hero-brows.jpg"
                  alt="Diseño Profesional de Cejas, Laminado y Visagismo por Eslen en Ocaña"
                  className="w-full h-full object-cover object-center"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/80 via-[#2D2926]/10 to-transparent" />

                {/* Floating Top Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-[11px] sm:text-xs font-semibold tracking-wider shadow-sm">
                    ✦ Miradas Reales por Eslen
                  </span>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-[#6B9080] hover:bg-[#58796b] text-white text-[11px] font-semibold shadow-sm transition-colors"
                  >
                    Agenda Abierta ↗
                  </a>
                </div>

                {/* Bottom Overlay Caption with Eslen's Avatar */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-lg border border-[#F4C2C2]/60">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="/eslen-profile.jpg"
                        alt="Eslen — Especialista en Cejas FORMA"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#B76E79] shrink-0 shadow-sm"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B76E79] font-bold truncate">
                          ESLEN • BROW ARTIST
                        </p>
                        <p className="font-serif text-base sm:text-lg font-bold text-[#2D2926] truncate">
                          Visagismo, Laminado &amp; Boutique
                        </p>
                        <p className="text-[11px] text-[#2D2926]/70 truncate">
                          Reserva tu cita online o conoce los rituales
                        </p>
                      </div>
                    </div>
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-10 h-10 rounded-xl bg-[#B76E79] text-white flex items-center justify-center hover:bg-[#9A5660] transition-colors"
                      aria-label="Reservar cita con Eslen en plataforma oficial"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Ribbon */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="bg-white/90 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-[#F4C2C2]/50 shadow-soft flex items-start gap-2.5 sm:gap-3 transition-all"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center shrink-0 text-[#B76E79]">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-sans text-xs sm:text-sm font-semibold text-[#2D2926] leading-snug">
                    {badge.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#2D2926]/65 mt-0.5">
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
      <div className="relative pt-2 sm:pt-4">
        {/* Architectural Layered Silk Wave SVG */}
        <div className="relative w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-10 sm:h-16"
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
        <div className="bg-[#2D2926] py-3.5 border-b border-[#B76E79]/40 overflow-hidden relative">
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
        <div className="bg-luxury-silk pt-7 pb-2 flex flex-col items-center justify-center relative">
          <button
            onClick={() => scrollTo('catalogo')}
            className="group inline-flex flex-col items-center gap-1.5 focus:outline-none"
            aria-label="Explorar colección de maquillaje FORMA"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B76E79]">
              Colección Seleccionada por Eslen
            </span>
            <div className="w-9 h-9 rounded-full bg-white border border-[#E8A598] shadow-soft flex items-center justify-center text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-white transition-all">
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
