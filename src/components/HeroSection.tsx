import React from 'react';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Award,
  Truck,
  Banknote,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { FormaLogo } from './FormaLogo';

export const HeroSection: React.FC = () => {
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

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F4] via-[#FAF7F5] to-[#FAF7F5] pt-8 pb-12 sm:py-16 border-b border-[#F4C2C2]/40">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4C2C2]/25 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Minimalist, Breathable Brand Presentation */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pure Symbol Mark + Location Pill */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-6">
              <FormaLogo size="lg" showWordmark={false} />
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#F4C2C2] text-xs font-medium text-[#2D2926]/75 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Estudio de Cejas & Maquillaje • Ocaña</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-semibold text-[#2D2926] leading-[1.14] tracking-tight">
              Diseño de Cejas por{' '}
              <span className="italic font-normal text-[#B76E79]">Eslen</span> &
              Maquillaje para tu Rutina.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#2D2926]/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Visagismo personalizado para realzar tu mirada y esenciales de
              maquillaje seleccionados en el estudio con entrega rápida en Ocaña.
            </p>

            {/* Two Primary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => scrollTo('catalogo')}
                className="inline-flex items-center justify-center gap-2.5 bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold px-7 py-4 rounded-2xl shadow-luxury transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
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
          </div>

          {/* Right Column: Clean Editorial Portrait Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-luxury bg-[#FDF2F4] aspect-[4/4.2]">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85"
                  alt="FORMA - Diseño de Cejas y Maquillaje por Eslen"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/70 via-transparent to-transparent" />

                {/* Minimal Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#F4C2C2]/60 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg font-bold text-[#2D2926]">
                      Visagismo & Brow Lamination
                    </p>
                    <p className="text-xs text-[#2D2926]/70">
                      Atención con cita previa en Ocaña
                    </p>
                  </div>
                  <button
                    onClick={() => scrollTo('citas-eslen')}
                    className="shrink-0 w-10 h-10 rounded-xl bg-[#B76E79] text-white flex items-center justify-center hover:bg-[#9A5660] transition-colors"
                    aria-label="Agendar cita"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
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
    </section>
  );
};
