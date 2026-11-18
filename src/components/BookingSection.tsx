import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  ArrowUpRight,
  MapPin,
  Droplets,
  Info,
  ChevronDown
} from 'lucide-react';
import { BROW_SERVICES } from '../data/seedData';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/format';

export const BookingSection: React.FC = () => {
  const { openBookingModal } = useStore();
  const [showCareGuide, setShowCareGuide] = useState(false);

  return (
    <section
      id="citas-eslen"
      aria-label="Estudio de Cejas by Eslen y Reserva de Citas Online en FORMA"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#FDF2F4] via-[#FAF7F5] to-[#FDF2F4] border-t border-[#F4C2C2]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#F4C2C2] text-[#B76E79] text-xs font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            Cabina Especializada en Ocaña • FORMA Studio
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2926]">
            Diseño de Cejas by{' '}
            <span className="italic text-[#B76E79]">Eslen</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#2D2926]/75 leading-relaxed">
            Realza tu mirada en <strong className="text-[#2D2926]">FORMA</strong> con diseño
            personalizado de cejas, depilación en cera o con Gillette y pigmentación
            semipermanente. Elige el servicio que prefieras y reserva tu turno al instante.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait Card of Eslen */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F4C2C2] shadow-luxury">
              <div className="relative aspect-[4/4.3] w-full bg-[#FDF2F4] overflow-hidden">
                <img
                  src="/eslen-profile.jpg"
                  alt="Eslen — Fundadora y Especialista en Diseño de Cejas de FORMA Estudio & Cosmética en Ocaña"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/85 via-[#2D2926]/15 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-xs font-bold tracking-wider shadow-sm">
                    ✦ Brow Artist &amp; Fundadora
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#6B9080] text-white text-[11px] font-semibold shadow-sm">
                    Ocaña, N. de S.
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#F4C2C2] font-bold">
                    ATENCIÓN PERSONALIZADA EN CABINA
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mt-0.5">
                    Eslen — FORMA Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF7F5]/90 mt-1 leading-relaxed">
                    Especialista en diseño personalizado de cejas, depilación en cera o Gillette y
                    pigmentación semipermanente. Realza tu mirada.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 gap-2.5 text-xs text-[#2D2926]/85 font-medium">
                  <div className="flex items-center gap-2.5 bg-[#FAF7F5] px-3.5 py-2.5 rounded-xl border border-[#F4C2C2]/50">
                    <ShieldCheck className="w-4 h-4 text-[#6B9080] shrink-0" />
                    <span>Garantía de 4 días a partir de la realización del servicio</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF7F5] px-3.5 py-2.5 rounded-xl border border-[#F4C2C2]/50">
                    <Award className="w-4 h-4 text-[#B76E79] shrink-0" />
                    <span>Depilación en cera o con Gillette según tu preferencia</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF7F5] px-3.5 py-2.5 rounded-xl border border-[#F4C2C2]/50">
                    <Heart className="w-4 h-4 text-[#B76E79] shrink-0" />
                    <span>Pigmentación semipermanente con duración de 5 a 15 días</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="animate-cta-loop w-full bg-gradient-to-r from-[#B76E79] via-[#9A5660] to-[#B76E79] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm sm:text-base transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Agendar Cita con Eslen</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Menu of 5 Services + Collapsible Care Guide */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">
                  Menú Oficial de Servicios • Ocaña
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926]">
                  Diseño de Cejas by Eslen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B76E79] hover:text-[#9A5660] underline underline-offset-4 self-start sm:self-auto"
              >
                <span>Ver horarios disponibles</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {BROW_SERVICES.map((service) => (
                <article
                  key={service.id}
                  onClick={() => openBookingModal(service.id)}
                  className="cursor-pointer group bg-white hover:bg-[#FDF2F4]/40 rounded-2xl p-4 sm:p-5 border border-[#F4C2C2]/70 hover:border-[#B76E79] shadow-soft hover:shadow-luxury transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2D2926] group-hover:text-[#B76E79] transition-colors">
                          {service.name}
                        </h4>
                        {service.tag && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F4] text-[#B76E79] border border-[#F4C2C2] text-[10px] font-bold uppercase tracking-wider">
                            ✦ {service.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[#2D2926]/75 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D2926]/70 bg-[#FAF7F5] px-2.5 py-1 rounded-lg border border-[#F4C2C2]/40">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                          <span>{service.duration}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B9080]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Cabina FORMA Ocaña</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-[#FDF2F4] flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="font-serif text-xl sm:text-2xl font-bold text-[#B76E79]">
                          {formatCOP(service.price, false)}
                        </span>
                        <span className="text-[10px] text-[#2D2926]/50 font-semibold ml-1 sm:ml-0 sm:block">
                          COP
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openBookingModal(service.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D2926] group-hover:bg-[#B76E79] text-white text-xs font-semibold transition-colors shadow-sm"
                      >
                        <span>Reservar</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Compact Collapsible Guarantee & Aftercare Info */}
            <div className="bg-white rounded-2xl border border-[#F4C2C2]/80 shadow-soft overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCareGuide((prev) => !prev)}
                className="w-full px-4 py-3.5 sm:px-5 flex items-center justify-between gap-3 text-left hover:bg-[#FDF2F4]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Info className="w-4 h-4 text-[#B76E79] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#2D2926] truncate">
                    Nota de Duración (5–15 días), Garantía (4 días) y Cuidados Posteriores
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#B76E79] shrink-0 transition-transform ${
                    showCareGuide ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showCareGuide && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#FDF2F4] space-y-3 text-xs text-[#2D2926]/80">
                  <p className="leading-relaxed">
                    <strong className="text-[#B76E79]">Nota:</strong> La duración habitual del diseño
                    de cejas varía entre <strong>5 y 15 días</strong>, dependiendo del tipo de piel y
                    los cuidados posteriores. Por este motivo, la{' '}
                    <strong>garantía ofrecida es de 4 días</strong> a partir de la realización del
                    servicio.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2]/60 flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Primeras 24 horas:</strong> El pigmento se adhiere a tu piel, así que
                        no toques ni mojes la zona.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2]/60 flex items-start gap-2.5">
                      <Droplets className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Después de 24h:</strong> Si sudas o te mojas, seca a toques suaves
                        con toalla seca; no frotes al lavar ni uses productos oleosos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Callout Box */}
            <div className="bg-[#2D2926] text-[#FAF7F5] rounded-3xl p-5 sm:p-6 border border-[#B76E79]/40 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <img
                  src="/eslen-profile.jpg"
                  alt="Eslen FORMA"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#B76E79] shrink-0 hidden sm:block"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#F4C2C2] font-bold">
                    AGENDA ONLINE 24/7 • FORMA STUDIO
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                    ¿Lista para realzar tu mirada con Eslen?
                  </h4>
                  <p className="text-xs text-[#FAF7F5]/75 mt-0.5">
                    Selecciona tu servicio, día y horario disponible en segundos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto shrink-0 bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold px-6 py-3.5 rounded-2xl shadow-luxury inline-flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Agendar Mi Cita</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
