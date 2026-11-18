import React, { useState, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  CheckCircle2,
  MapPin,
  Droplets,
  Info,
  User,
  Phone,
  FileText,
  MessageCircle,
  ArrowDown
} from 'lucide-react';
import { BROW_SERVICES, STUDIO_TIME_SLOTS } from '../data/seedData';
import { useStore } from '../context/StoreContext';
import { Appointment } from '../types';
import { formatCOP, isValidColombianPhone, cleanPhone } from '../utils/format';

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function slotToMinutes(slot: string): number {
  const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const mins = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function formatReadableDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export const BookingSection: React.FC = () => {
  const { appointments, blockedSlots, settings, createAppointment } = useStore();
  const formRef = useRef<HTMLDivElement | null>(null);

  const todayStr = useMemo(() => toLocalDateString(new Date()), []);

  const upcomingDays = useMemo(() => {
    const days: { dateStr: string; label: string; subLabel: string }[] = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const dateStr = toLocalDateString(d);
      const weekday = d.toLocaleDateString('es-CO', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthShort = d.toLocaleDateString('es-CO', { month: 'short' });
      days.push({
        dateStr,
        label: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : weekday.replace('.', ''),
        subLabel: `${dayNum} ${monthShort.replace('.', '')}`,
      });
    }
    return days;
  }, []);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(BROW_SERVICES[0].id);
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes() + 15;
    const lastSlotMins = slotToMinutes(STUDIO_TIME_SLOTS[STUDIO_TIME_SLOTS.length - 1]);
    return nowMins >= lastSlotMins && upcomingDays[1]
      ? upcomingDays[1].dateStr
      : todayStr;
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const selectedService = useMemo(
    () => BROW_SERVICES.find((s) => s.id === selectedServiceId) || BROW_SERVICES[0],
    [selectedServiceId]
  );

  const isDayBlocked = blockedSlots.includes(`${preferredDate}|ALL_DAY`);

  const getSlotStatus = (dateStr: string, slot: string): 'available' | 'booked' | 'blocked' | 'past' => {
    if (blockedSlots.includes(`${dateStr}|ALL_DAY`) || blockedSlots.includes(`${dateStr}|${slot}`)) {
      return 'blocked';
    }
    const isBooked = appointments.some(
      (a) =>
        a.status !== 'Cancelada' &&
        a.preferredDate === dateStr &&
        a.preferredTimeSlot === slot
    );
    if (isBooked) return 'booked';

    if (dateStr === todayStr) {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes() + 15;
      if (slotToMinutes(slot) <= nowMins) {
        return 'past';
      }
    }
    return 'available';
  };

  const handleSelectServiceAndScroll = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setConfirmedAppointment(null);
    setFormError('');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleDateChange = (nextDate: string) => {
    setPreferredDate(nextDate);
    setFormError('');
    if (preferredTimeSlot && getSlotStatus(nextDate, preferredTimeSlot) !== 'available') {
      setPreferredTimeSlot('');
    }
  };

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');

    if (!preferredDate || preferredDate < todayStr) {
      setFormError('Por favor selecciona una fecha válida a partir de hoy.');
      return;
    }

    if (isDayBlocked) {
      setFormError('Este día no tiene turnos disponibles. Por favor elige otra fecha.');
      return;
    }

    if (!preferredTimeSlot || getSlotStatus(preferredDate, preferredTimeSlot) !== 'available') {
      setFormError('Por favor selecciona un horario disponible para tu cita.');
      return;
    }

    const trimmedName = customerName.trim();
    if (trimmedName.length < 3 || !trimmedName.includes(' ')) {
      setFormError('Por favor ingresa tu nombre y apellido completo.');
      return;
    }

    if (!isValidColombianPhone(customerPhone)) {
      setFormError(
        'Ingresa un número de celular/WhatsApp válido en Colombia (10 dígitos comenzando por 3).'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createAppointment({
        customerName: trimmedName,
        customerPhone: cleanPhone(customerPhone),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.duration,
        preferredDate,
        preferredTimeSlot,
        notes,
      });

      setConfirmedAppointment(created);
      setPreferredTimeSlot('');
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'No pudimos registrar tu cita en este momento. Intenta de nuevo.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Agenda Directa en FORMA • Ocaña
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2926]">
            Diseño de Cejas by{' '}
            <span className="italic text-[#B76E79]">Eslen</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#2D2926]/75 leading-relaxed">
            Realza tu mirada en <strong className="text-[#2D2926]">FORMA</strong> con diseño
            personalizado de cejas, depilación en cera o con Gillette y pigmentación
            semipermanente. Elige tu servicio, selecciona tu horario disponible y agenda en segundos
            sin salir de la página.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait of Eslen + Official Guarantee & Aftercare Guide */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F4C2C2] shadow-luxury">
              {/* Real Portrait of Eslen */}
              <div className="relative aspect-[4/4.2] w-full bg-[#FDF2F4] overflow-hidden">
                <img
                  src="/eslen-profile.jpg"
                  alt="Eslen — Fundadora y Especialista en Diseño de Cejas de FORMA Estudio & Cosmética en Ocaña"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/85 via-[#2D2926]/15 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#2D2926] text-xs font-bold tracking-wider shadow-sm">
                    ✦ Brow Artist &amp; Fundadora
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#6B9080] text-white text-[11px] font-semibold shadow-sm">
                    Ocaña, N. de S.
                  </span>
                </div>

                {/* Bottom Overlay Identity */}
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

              {/* Studio Highlights & Quick Scroll CTA */}
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
                    <span>Pigmentación semipermanente con duración habitual de 5 a 15 días</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="animate-cta-loop w-full bg-gradient-to-r from-[#B76E79] via-[#9A5660] to-[#B76E79] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Ir a Elegir Día y Hora</span>
                  <ArrowDown className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Official Note & Aftercare Guide Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F4C2C2] shadow-soft space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#FDF2F4] border border-[#F4C2C2]/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B76E79]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Nota de Duración y Garantía</span>
                </div>
                <p className="text-xs text-[#2D2926]/85 leading-relaxed">
                  La duración habitual del diseño de cejas varía entre <strong>5 y 15 días</strong>,
                  dependiendo del tipo de piel y los cuidados posteriores. Por este motivo, la{' '}
                  <strong>garantía ofrecida es de 4 días</strong> a partir de la realización del
                  servicio.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-serif text-lg font-bold text-[#2D2926]">
                  Cuidados Posteriores
                </h4>
                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#F4C2C2]/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] text-[#B76E79] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2D2926]">Primeras 24 horas</p>
                    <p className="text-[11px] text-[#2D2926]/75 leading-relaxed mt-0.5">
                      Durante las primeras 24 horas el pigmento se adhiere a tu piel, así que no
                      toques ni mojes la zona.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#F4C2C2]/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] text-[#B76E79] flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2D2926]">Secado y rutina facial</p>
                    <p className="text-[11px] text-[#2D2926]/75 leading-relaxed mt-0.5">
                      Si te sudas o te mojas, seca a toques suaves con una toalla completamente
                      seca, y posterior a estas 24 horas no frotes tus cejas cuando laves tu rostro
                      ni apliques productos oleosos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Step 1 (Services Menu) + Step 2 (Integrated Booking Form) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">
                Paso 1 • Menú Oficial de Servicios
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926]">
                Elige tu Diseño de Cejas by Eslen
              </h3>
            </div>

            <div className="space-y-3">
              {BROW_SERVICES.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <article
                    key={service.id}
                    onClick={() => handleSelectServiceAndScroll(service.id)}
                    className={`cursor-pointer group rounded-2xl p-4 sm:p-5 border transition-all ${
                      isSelected
                        ? 'bg-[#FDF2F4]/80 border-2 border-[#B76E79] shadow-luxury'
                        : 'bg-white hover:bg-[#FDF2F4]/40 border-[#F4C2C2]/70 hover:border-[#B76E79] shadow-soft'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2D2926] group-hover:text-[#B76E79] transition-colors">
                            {service.name}
                          </h4>
                          {service.tag && (
                            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#B76E79] border border-[#F4C2C2] text-[10px] font-bold uppercase tracking-wider">
                              ✦ {service.tag}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#2D2926]/75 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2D2926]/75 bg-white px-2.5 py-1 rounded-lg border border-[#F4C2C2]/50">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                            <span>{service.duration}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B9080]">
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

                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm ${
                            isSelected
                              ? 'bg-[#B76E79] text-white'
                              : 'bg-[#2D2926] group-hover:bg-[#B76E79] text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Seleccionado</span>
                            </>
                          ) : (
                            <span>Reservar este</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Step 2: Native Booking Form inside FORMA */}
            <div
              id="reserva-form"
              ref={formRef}
              className="scroll-mt-24 bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F4C2C2] shadow-luxury"
            >
              {confirmedAppointment ? (
                <div className="space-y-5 text-center py-3">
                  <div className="w-14 h-14 rounded-full bg-[#6B9080] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#6B9080]/15 text-[#6B9080] text-xs font-bold uppercase tracking-wider">
                      Cita Solicitada • #{confirmedAppointment.id}
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926] mt-2">
                      ¡Te esperamos en cabina, {confirmedAppointment.customerName.split(' ')[0]}!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#2D2926]/75 mt-1.5 max-w-md mx-auto leading-relaxed">
                      Eslen ya recibió la notificación de tu reserva. Tu turno quedó separado y te
                      escribiremos a tu WhatsApp <strong>{confirmedAppointment.customerPhone}</strong>{' '}
                      para confirmar cualquier detalle.
                    </p>
                  </div>

                  <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F4C2C2] text-left text-xs space-y-2 max-w-lg mx-auto">
                    <div className="flex justify-between gap-3 border-b border-[#F4C2C2]/40 pb-2">
                      <span className="text-[#2D2926]/60">Servicio:</span>
                      <span className="font-bold text-[#2D2926] text-right">
                        {confirmedAppointment.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-[#F4C2C2]/40 pb-2">
                      <span className="text-[#2D2926]/60">Fecha y Hora:</span>
                      <span className="font-bold text-[#B76E79] text-right">
                        {formatReadableDate(confirmedAppointment.preferredDate)} ({confirmedAppointment.preferredDate}) •{' '}
                        {confirmedAppointment.preferredTimeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#2D2926]/60">Valor del servicio:</span>
                      <span className="font-serif text-lg font-bold text-[#2D2926]">
                        {formatCOP(confirmedAppointment.servicePrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                    <a
                      href={`https://wa.me/57${cleanPhone(
                        settings.whatsappNumber
                      )}?text=${encodeURIComponent(
                        `¡Hola Eslen! Acabo de agendar mi cita #${confirmedAppointment.id} en FORMA para "${confirmedAppointment.serviceName}" el día ${confirmedAppointment.preferredDate} a las ${confirmedAppointment.preferredTimeSlot}. Mi nombre es ${confirmedAppointment.customerName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#6B9080] hover:bg-[#57786a] text-white font-semibold py-3.5 px-5 rounded-2xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirmar por WhatsApp con Eslen</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setConfirmedAppointment(null)}
                      className="py-3.5 px-5 rounded-2xl border border-[#F4C2C2] text-xs sm:text-sm font-semibold text-[#2D2926] hover:bg-[#FDF2F4] transition-colors"
                    >
                      Agendar otra cita
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitAppointment} className="space-y-5">
                  <div className="border-b border-[#FDF2F4] pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">
                        Paso 2 • Reserva Directa en FORMA
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-[#2D2926]">
                        Elige Día, Hora y tus Datos
                      </h4>
                    </div>
                    <div className="px-3.5 py-2 rounded-2xl bg-[#FDF2F4] border border-[#F4C2C2] text-right shrink-0">
                      <span className="block text-[10px] font-bold uppercase text-[#B76E79]">
                        Servicio Elegido
                      </span>
                      <span className="text-xs font-bold text-[#2D2926]">
                        {formatCOP(selectedService.price)}
                      </span>
                    </div>
                  </div>

                  {/* Selected Service Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#F4C2C2]/70 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
                        Estás agendando:
                      </p>
                      <p className="font-serif text-base sm:text-lg font-bold text-[#2D2926] truncate">
                        {selectedService.name}
                      </p>
                    </div>
                    <span className="font-serif text-lg sm:text-xl font-bold text-[#B76E79] shrink-0">
                      {formatCOP(selectedService.price, false)}
                    </span>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                      {formError}
                    </div>
                  )}

                  {/* Date Picker: Quick Days + Calendar Input */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-[#2D2926]">
                        1. Selecciona el Día *
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={preferredDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        aria-label="Elegir otra fecha en calendario"
                        className="px-2.5 py-1 rounded-lg bg-[#FAF7F5] border border-[#F4C2C2] text-xs font-semibold text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                      />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {upcomingDays.map((day) => {
                        const active = preferredDate === day.dateStr;
                        const dayBlocked = blockedSlots.includes(`${day.dateStr}|ALL_DAY`);
                        return (
                          <button
                            type="button"
                            key={day.dateStr}
                            onClick={() => handleDateChange(day.dateStr)}
                            className={`shrink-0 min-w-[74px] px-3 py-2 rounded-2xl border text-center transition-all ${
                              active
                                ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-sm'
                                : dayBlocked
                                ? 'bg-gray-100 text-gray-400 border-gray-200'
                                : 'bg-[#FAF7F5] text-[#2D2926] border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
                            }`}
                          >
                            <span className="block text-[10px] font-bold uppercase tracking-wider opacity-85">
                              {day.label}
                            </span>
                            <span className="block text-xs font-bold mt-0.5">{day.subLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#2D2926]">
                      2. Horarios Disponibles ({formatReadableDate(preferredDate)}) *
                    </label>

                    {isDayBlocked ? (
                      <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#F4C2C2] text-center text-xs text-[#2D2926]/70">
                        Eslen bloqueó este día en su agenda. Por favor selecciona otra fecha arriba.
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {STUDIO_TIME_SLOTS.map((slot) => {
                            const status = getSlotStatus(preferredDate, slot);
                            const disabled = status !== 'available';
                            const selected = preferredTimeSlot === slot && !disabled;

                            return (
                              <button
                                type="button"
                                key={slot}
                                disabled={disabled}
                                onClick={() => {
                                  setPreferredTimeSlot(slot);
                                  setFormError('');
                                }}
                                className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                                  selected
                                    ? 'bg-[#B76E79] text-white border-[#B76E79] shadow-sm ring-2 ring-[#F4C2C2]'
                                    : disabled
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                    : 'bg-[#FAF7F5] text-[#2D2926] border-[#F4C2C2]/80 hover:border-[#B76E79] hover:bg-[#FDF2F4]'
                                }`}
                              >
                                <span className="block">{slot}</span>
                                {status === 'booked' && (
                                  <span className="block text-[9px] font-semibold no-underline">
                                    Ocupado
                                  </span>
                                )}
                                {status === 'blocked' && (
                                  <span className="block text-[9px] font-semibold no-underline">
                                    No disp.
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {STUDIO_TIME_SLOTS.every(
                          (slot) => getSlotStatus(preferredDate, slot) !== 'available'
                        ) && (
                          <p className="text-[11px] font-semibold text-[#B76E79] pt-1">
                            No quedan horarios disponibles para esta fecha. Selecciona otro día arriba.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Customer Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#2D2926] mb-1">
                        Nombre y apellido completo *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ej. Laura Martínez"
                          className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2D2926] mb-1">
                        Celular / WhatsApp (10 dígitos) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          maxLength={10}
                          autoComplete="tel"
                          value={customerPhone}
                          onChange={(e) =>
                            setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                          placeholder="Ej. 3154829104"
                          className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D2926] mb-1">
                      Notas adicionales (Opcional)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Primera vez, piel sensible, etc."
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isDayBlocked}
                    className={`w-full font-bold py-4 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm sm:text-base transition-all ${
                      isSubmitting || isDayBlocked
                        ? 'bg-[#B76E79]/60 text-white cursor-not-allowed'
                        : 'bg-[#B76E79] hover:bg-[#9A5660] text-white active:scale-95'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      {isSubmitting
                        ? 'Reservando tu cita...'
                        : `Confirmar Cita con Eslen • ${formatCOP(selectedService.price)}`}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
