import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  CheckCircle2,
  User,
  Phone,
  FileText,
  MessageCircle,
  ShieldCheck
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

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    bookingPreselectedServiceId,
    closeBookingModal,
    appointments,
    blockedSlots,
    settings,
    createAppointment,
  } = useStore();

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

  useEffect(() => {
    if (bookingPreselectedServiceId) {
      setSelectedServiceId(bookingPreselectedServiceId);
    }
  }, [bookingPreselectedServiceId]);

  useEffect(() => {
    if (isBookingModalOpen) {
      setFormError('');
    }
  }, [isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  const selectedService =
    BROW_SERVICES.find((s) => s.id === selectedServiceId) || BROW_SERVICES[0];
  const isDayBlocked = blockedSlots.includes(`${preferredDate}|ALL_DAY`);

  const getSlotStatus = (
    dateStr: string,
    slot: string
  ): 'available' | 'booked' | 'blocked' | 'past' => {
    if (
      blockedSlots.includes(`${dateStr}|ALL_DAY`) ||
      blockedSlots.includes(`${dateStr}|${slot}`)
    ) {
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

  const handleClose = () => {
    closeBookingModal();
    setTimeout(() => {
      if (confirmedAppointment) {
        setConfirmedAppointment(null);
      }
    }, 250);
  };

  const handleDateChange = (nextDate: string) => {
    setPreferredDate(nextDate);
    setFormError('');
    if (preferredTimeSlot && getSlotStatus(nextDate, preferredTimeSlot) !== 'available') {
      setPreferredTimeSlot('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#2D2926]/65 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Agendar cita de cejas con Eslen en FORMA"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#FAF7F5] rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#F4C2C2] shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col animate-slideUp"
      >
        {/* Sticky Header */}
        <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-4 bg-white border-b border-[#F4C2C2]/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/eslen-profile.jpg"
              alt="Eslen FORMA"
              className="w-10 h-10 rounded-xl object-cover border border-[#F4C2C2] shrink-0"
            />
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D2926] leading-tight truncate">
                {confirmedAppointment ? '¡Cita Confirmada!' : 'Agendar Cita con Eslen'}
              </h2>
              <p className="text-[11px] text-[#2D2926]/60 truncate">
                Diseño de Cejas by Eslen • Cabina FORMA Ocaña
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar reserva de cita"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FDF2F4] hover:bg-[#F4C2C2] text-[#2D2926] flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Body */}
        {confirmedAppointment ? (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-6 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#6B9080] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#6B9080]/15 text-[#6B9080] text-xs font-bold uppercase tracking-wider">
                Cita Solicitada • #{confirmedAppointment.id}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926] mt-2">
                ¡Te esperamos, {confirmedAppointment.customerName.split(' ')[0]}!
              </h3>
              <p className="text-xs sm:text-sm text-[#2D2926]/75 mt-1.5 max-w-md mx-auto leading-relaxed">
                Eslen ya recibió la notificación de tu cita y te escribirá a tu WhatsApp{' '}
                <strong>{confirmedAppointment.customerPhone}</strong> para confirmar cualquier
                detalle.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2] text-left text-xs space-y-2">
              <div className="flex justify-between gap-3 border-b border-[#FDF2F4] pb-2">
                <span className="text-[#2D2926]/60">Servicio:</span>
                <span className="font-bold text-[#2D2926] text-right">
                  {confirmedAppointment.serviceName}
                </span>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#FDF2F4] pb-2">
                <span className="text-[#2D2926]/60">Fecha y Hora:</span>
                <span className="font-bold text-[#B76E79] text-right">
                  {formatReadableDate(confirmedAppointment.preferredDate)} (
                  {confirmedAppointment.preferredDate}) • {confirmedAppointment.preferredTimeSlot}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#2D2926]/60">Valor del servicio:</span>
                <span className="font-serif text-lg font-bold text-[#2D2926]">
                  {formatCOP(confirmedAppointment.servicePrice)}
                </span>
              </div>
            </div>

            <div className="bg-[#FDF2F4] rounded-2xl p-3.5 border border-[#F4C2C2]/70 text-left text-[11px] text-[#2D2926]/80 leading-relaxed">
              <strong className="text-[#B76E79]">Recuerda para después de tu cita:</strong> durante
              las primeras 24 horas no toques ni mojes la zona; si sudas o te mojas, seca a toques
              suaves sin frotar ni aplicar productos oleosos. Garantía de 4 días.
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <a
                href={`https://wa.me/57${cleanPhone(
                  settings.whatsappNumber
                )}?text=${encodeURIComponent(
                  `¡Hola Eslen! Acabo de agendar mi cita #${confirmedAppointment.id} en FORMA para "${confirmedAppointment.serviceName}" el día ${confirmedAppointment.preferredDate} a las ${confirmedAppointment.preferredTimeSlot}. Mi nombre es ${confirmedAppointment.customerName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#6B9080] hover:bg-[#57786a] text-white font-semibold py-3.5 px-5 rounded-2xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="py-3.5 px-5 rounded-2xl border border-[#F4C2C2] bg-white text-xs sm:text-sm font-semibold text-[#2D2926] hover:bg-[#FDF2F4] transition-colors"
              >
                Volver a FORMA
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              {/* 1. Service Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                  1. Servicio de Diseño de Cejas *
                </label>
                <select
                  value={selectedService.id}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#F4C2C2] text-xs sm:text-sm font-semibold text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                >
                  {BROW_SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} — {formatCOP(srv.price, false)}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#2D2926]/65 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B9080] shrink-0" />
                  <span>{selectedService.duration}</span>
                </p>
              </div>

              {/* 2. Date Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-[#2D2926]">
                    2. Selecciona el Día *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={preferredDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    aria-label="Elegir fecha en calendario"
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#F4C2C2] text-xs font-semibold text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
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
                        className={`shrink-0 min-w-[70px] px-2.5 py-2 rounded-xl border text-center transition-all ${
                          active
                            ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-sm'
                            : dayBlocked
                            ? 'bg-gray-100 text-gray-400 border-gray-200'
                            : 'bg-white text-[#2D2926] border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
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

              {/* 3. Time Slots */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2D2926]">
                  3. Horarios Disponibles ({formatReadableDate(preferredDate)}) *
                </label>

                {isDayBlocked ? (
                  <div className="p-3.5 rounded-xl bg-white border border-[#F4C2C2] text-center text-xs text-[#2D2926]/70">
                    Eslen bloqueó este día en su agenda. Por favor elige otra fecha arriba.
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
                            className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition-all text-center ${
                              selected
                                ? 'bg-[#B76E79] text-white border-[#B76E79] shadow-sm ring-2 ring-[#F4C2C2]'
                                : disabled
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                : 'bg-white text-[#2D2926] border-[#F4C2C2]/80 hover:border-[#B76E79] hover:bg-[#FDF2F4]'
                            }`}
                          >
                            <span className="block">{slot}</span>
                            {status === 'booked' && (
                              <span className="block text-[9px] font-semibold">Ocupado</span>
                            )}
                            {status === 'blocked' && (
                              <span className="block text-[9px] font-semibold">No disp.</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {STUDIO_TIME_SLOTS.every(
                      (slot) => getSlotStatus(preferredDate, slot) !== 'available'
                    ) && (
                      <p className="text-[11px] font-semibold text-[#B76E79]">
                        No quedan horarios disponibles para esta fecha. Selecciona otro día arriba.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* 4. Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Nombre y apellido *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#B76E79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Laura Martínez"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Celular / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B76E79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Notas adicionales (Opcional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#B76E79] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Primera vez, piel sensible, etc."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 bg-white border-t border-[#F4C2C2]/60 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting || isDayBlocked}
                className={`w-full font-bold py-3.5 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm sm:text-base transition-all ${
                  isSubmitting || isDayBlocked
                    ? 'bg-[#B76E79]/60 text-white cursor-not-allowed'
                    : 'bg-[#B76E79] hover:bg-[#9A5660] text-white active:scale-95'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  {isSubmitting
                    ? 'Reservando tu cita...'
                    : `Confirmar Cita • ${formatCOP(selectedService.price)}`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
