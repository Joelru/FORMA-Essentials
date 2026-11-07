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
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormaLogo } from './FormaLogo';

export const HeroSection: React.FC = () => {
  const { settings } = useStore();

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
      desc: 'Curaduría experta de estudio',
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
    'FORMA • ESTUDIO & COSMÉTICA',
    'DISEÑO PROFESIONAL DE CEJAS POR ESLEN',
    'MAQUILLAJE 100% ORIGINAL',
    'VISAGISMO & LAMINADO DE CEJAS',
    'ENTREGAS RÁPIDAS EN OCAÑA',
    'PAGO CONTRA ENTREGA • NEQUI • DAVIPLATA',
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F4] via-[#FAF7F5] to-[#FAF7F5] pt-6 sm:pt-12">
      {/* Subtle Luxury Ambient Glows & Architectural Curves (Pure SVG/CSS, Zero Lag) */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4C2C2]/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-80 h-80 rounded-full bg-[#E8A598]/20 blur-3xl" />

      {/* Delicate Rose Gold Architectural Contour Lines in Background */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.18]"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="none"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Full Brand Presence & Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#F4C2C2] shadow-sm mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2D2926]">
                ESTUDIO &amp; COSMÉTICA • {settings.city.toUpperCase()}
              </span>
            </div>

            {/* Prominent FORMA Official Seal + Typographic Header */}
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5">
              <FormaLogo size="xl" showWordmark={false} />
              <div>
                <span className="block font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[0.18em] text-[#2D2926] leading-none">
                  FORMA
                </span>
                <span className="block text-xs sm:text-sm uppercase tracking-[0.28em] text-[#B76E79] font-semibold mt-2">
                  ESTUDIO &amp; COSMÉTICA • POR ESLEN
                </span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-semibold text-[#2D2926] leading-[1.18] mt-4">
              Diseño Profesional de Cejas por{' '}
              <span className="italic font-normal text-[#B76E79] underline decoration-[#F4C2C2] underline-offset-4">
                Eslen
              </span>{' '}
              &amp; Maquillaje Seleccionado para tu Rutina.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#2D2926]/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Bienvenida a <strong className="text-[#2D2926] font-semibold">FORMA</strong>.
              Un espacio dedicado a realzar tu belleza natural en Ocaña donde la arquitectura
              de tu mirada se une con los productos de maquillaje, fijación e hidratación que Eslen utiliza y recomienda en su estudio.
            </p>

            {/* Primary High-Contrast CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => scrollTo('catalogo')}
                className="inline-flex items-center justify-center gap-2.5 bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold px-7 py-4 rounded-2xl shadow-luxury transition-all transform hover:-translate-y-0.5 active:scale-98 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explorar Maquillaje</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('citas-eslen')}
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FDF2F4] text-[#2D2926] font-semibold px-7 py-4 rounded-2xl border-2 border-[#E8A598] shadow-sm transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4 text-[#B76E79]" />
                <span>Agendar Cita de Cejas</span>
              </button>
            </div>

            {/* Social Proof Pill */}
            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#2D2926]/75">
              <div className="flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-full border border-[#F4C2C2]/60">
                <div className="flex text-[#B76E79]">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#B76E79]" />
                  ))}
                </div>
                <span className="font-semibold text-[#2D2926] ml-1">4.9/5</span>
                <span>• +450 clientas felices en Ocaña</span>
              </div>
              <div className="flex items-center gap-1 text-[#6B9080] font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>Despachos el mismo día en el casco urbano</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Luxury Card with Realistic Sculpted Eyebrows */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-luxury bg-[#FDF2F4] aspect-[4/4.3]">
                <img
                  src="/hero-brows.jpg"
                  alt="FORMA por Eslen - Diseño Profesional de Cejas y Laminado"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/80 via-[#2D2926]/10 to-transparent" />

                {/* Floating Top Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-xs font-semibold tracking-wider shadow-sm">
                    ✨ ESTUDIO &amp; COSMÉTICA
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#6B9080] text-white text-[11px] font-semibold shadow-sm">
                    Agenda Abierta
                  </span>
                </div>

                {/* Bottom Overlay Caption */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#F4C2C2]/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#B76E79] font-bold">
                        ARQUITECTURA DE MIRADA • FORMA
                      </p>
                      <p className="font-serif text-lg font-bold text-[#2D2926]">
                        Visagismo, Laminado de Cejas &amp; Maquillaje
                      </p>
                      <p className="text-xs text-[#2D2926]/70 mt-0.5">
                        Atención personalizada por Eslen en Ocaña, N. de S.
                      </p>
                    </div>
                    <button
                      onClick={() => scrollTo('citas-eslen')}
                      className="shrink-0 w-10 h-10 rounded-xl bg-[#B76E79] text-white flex items-center justify-center hover:bg-[#9A5660] transition-colors"
                      aria-label="Ir a agendar cita"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
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
                className="bg-white/90 hover:bg-white rounded-2xl p-4 border border-[#F4C2C2]/50 shadow-soft flex items-start gap-3 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center shrink-0 text-[#B76E79]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-[#2D2926] leading-snug">
                    {badge.title}
                  </h3>
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
      <div className="relative pt-4">
        {/* Architectural Layered Silk Wave SVG */}
        <div className="relative w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-10 sm:h-16"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
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
            aria-label="Explorar colección FORMA"
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
