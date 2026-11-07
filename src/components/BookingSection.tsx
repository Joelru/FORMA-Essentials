import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  User,
  Phone,
  ShieldCheck,
  Award,
  Heart,
  MessageCircle
} from 'lucide-react';
import { BROW_SERVICES } from '../data/seedData';
import { AppointmentTimeSlot, Appointment } from '../types';
import { useStore } from '../context/StoreContext';
import { formatCOP, isValidColombianPhone, cleanPhone } from '../utils/format';

export const BookingSection: React.FC = () => {
  const { createAppointment, settings } = useStore();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(BROW_SERVICES[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<AppointmentTimeSlot>(
    'Tarde (2:00 PM - 6:30 PM)'
  );
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedAppointment, setSubmittedAppointment] = useState<Appointment | null>(null);

  const selectedService =
    BROW_SERVICES.find((s) => s.id === selectedServiceId) || BROW_SERVICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (customerName.trim().length < 3) {
      setErrorMsg('Por favor ingresa tu nombre completo para agendar tu cita.');
      return;
    }

    if (!isValidColombianPhone(customerPhone)) {
      setErrorMsg(
        'Ingresa un número de WhatsApp válido de 10 dígitos en Colombia (ej. 3154829104).'
      );
      return;
    }

    if (!preferredDate) {
      setErrorMsg('Por favor selecciona la fecha deseada para tu cita.');
      return;
    }

    const created = createAppointment({
      customerName,
      customerPhone: cleanPhone(customerPhone),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      preferredDate,
      preferredTimeSlot,
      notes,
    });

    setSubmittedAppointment(created);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  return (
    <section
      id="citas-eslen"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#FDF2F4] via-[#FAF7F5] to-[#FDF2F4] border-t border-[#F4C2C2]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#F4C2C2] text-[#B76E79] text-xs font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            Estudio Especializado en Ocaña • FORMA
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2926]">
            Agenda tu Cita de Cejas con{' '}
            <span className="italic text-[#B76E79]">Eslen</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#2D2926]/75 leading-relaxed">
            Tus cejas son el marco arquitectónico de tu rostro. En{' '}
            <strong className="text-[#2D2926]">FORMA Studio</strong> trabajamos bajo diagnóstico de
            visagismo personalizado para realzar tu expresión natural sin diseños rígidos ni artificiales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Eslen Profile + Interactive Service Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eslen Specialist Profile Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F4C2C2]/70 shadow-soft flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85"
                  alt="Eslen - Especialista en Diseño de Cejas FORMA"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#E8A598] shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold shadow">
                  Brow Artist
                </span>
              </div>

              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                    Eslen — Fundadora de FORMA
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FDF2F4] text-[#B76E79] border border-[#F4C2C2]">
                    Visagismo & Brow Lamination
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2D2926]/75 mt-2 leading-relaxed">
                  Especialista en diseño anatómico de cejas, sombreado híbrido semipermanente y
                  recuperación capilar de cejas. Cabina con protocolos de bioseguridad clínica y
                  productos hipoalergénicos de alta gama en Ocaña.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#2D2926]/80 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#6B9080]" />
                    Bioseguridad 100% Esterilizada
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#B76E79]" />
                    Mapeo Facial Personalizado
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-[#B76E79]" />
                    Acabado Clean Girl Natural
                  </span>
                </div>
              </div>
            </div>

            {/* Service Selector List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2926]">
                  1. Elige tu Ritual de Cejas
                </h3>
                <span className="text-xs text-[#B76E79] font-semibold">
                  Haz clic en un servicio para seleccionarlo
                </span>
              </div>

              <div className="space-y-3">
                {BROW_SERVICES.map((service) => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
                        isSelected
                          ? 'bg-white border-2 border-[#B76E79] shadow-luxury'
                          : 'bg-white/80 hover:bg-white border-[#F4C2C2]/60 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-[#B76E79] bg-[#B76E79] text-white'
                                : 'border-[#E8A598]'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2D2926]">
                                {service.name}
                              </h4>
                              {service.tag && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F4] text-[#B76E79] border border-[#F4C2C2] text-[10px] font-bold uppercase tracking-wider">
                                  {service.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#2D2926]/70 mt-1 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#2D2926]/70 bg-[#FAF7F5] px-2.5 py-1 rounded-lg border border-[#F4C2C2]/40">
                              <Clock className="w-3.5 h-3.5 text-[#B76E79]" />
                              <span>Duración estimada: {service.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-serif text-xl sm:text-2xl font-bold text-[#B76E79]">
                            {formatCOP(service.price, false)}
                          </span>
                          <span className="block text-[10px] text-[#2D2926]/50 font-semibold">
                            COP
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Request Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4C2C2] shadow-luxury sticky top-24">
              {submittedAppointment ? (
                <div className="space-y-5 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#6B9080] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#6B9080]/15 text-[#6B9080] text-xs font-bold uppercase tracking-wider">
                    Solicitud Recibida • #{submittedAppointment.id}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926]">
                    ¡Solicitud Enviada a Eslen!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2D2926]/75 leading-relaxed">
                    Hola <strong>{submittedAppointment.customerName}</strong>, tu solicitud para{' '}
                    <strong className="text-[#B76E79]">{submittedAppointment.serviceName}</strong>{' '}
                    el día <strong>{submittedAppointment.preferredDate}</strong> en la jornada de la{' '}
                    <strong>{submittedAppointment.preferredTimeSlot}</strong> ya está en el panel de{' '}
                    <strong>FORMA Studio</strong>.
                  </p>

                  <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F4C2C2] text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#2D2926]/60">Servicio:</span>
                      <span className="font-semibold text-[#2D2926] text-right">
                        {submittedAppointment.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D2926]/60">Duración y Valor:</span>
                      <span className="font-semibold text-[#B76E79]">
                        {submittedAppointment.serviceDuration} •{' '}
                        {formatCOP(submittedAppointment.servicePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D2926]/60">WhatsApp registrado:</span>
                      <span className="font-semibold text-[#2D2926]">
                        {submittedAppointment.customerPhone}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/57${cleanPhone(
                      settings.whatsappNumber
                    )}?text=${encodeURIComponent(
                      `¡Hola Eslen! ✨ Acabo de solicitar una cita en FORMA (#${submittedAppointment.id}) para *${submittedAppointment.serviceName}* el día ${submittedAppointment.preferredDate} (${submittedAppointment.preferredTimeSlot}). Mi nombre es ${submittedAppointment.customerName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#6B9080] hover:bg-[#58796b] text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Adelantar confirmación por WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSubmittedAppointment(null)}
                    className="w-full py-3 rounded-xl border border-[#F4C2C2] text-xs font-semibold text-[#2D2926] hover:bg-[#FDF2F4] transition-colors"
                  >
                    Agendar otra cita
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">
                      Reserva en 30 Segundos
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2D2926] mt-0.5">
                      2. Datos de tu Cita
                    </h3>
                  </div>

                  {/* Selected Service Banner */}
                  <div className="bg-[#FDF2F4] border border-[#F4C2C2] rounded-2xl p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
                      Servicio Seleccionado:
                    </p>
                    <p className="font-serif text-lg font-bold text-[#2D2926]">
                      {selectedService.name}
                    </p>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-[#2D2926]/70">
                        Duración: {selectedService.duration}
                      </span>
                      <span className="font-bold text-[#B76E79]">
                        {formatCOP(selectedService.price)}
                      </span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                      Tu Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Laura Sofía Vergel"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                      Tu WhatsApp (10 dígitos en Colombia) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        placeholder="Ej. 3169081122"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                        Fecha Deseada *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                        Franja Horaria Preferida *
                      </label>
                      <select
                        value={preferredTimeSlot}
                        onChange={(e) =>
                          setPreferredTimeSlot(e.target.value as AppointmentTimeSlot)
                        }
                        className="w-full px-3 py-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                      >
                        <option value="Mañana (8:30 AM - 12:00 PM)">
                          Mañana (8:30 AM - 12:00 PM)
                        </option>
                        <option value="Tarde (2:00 PM - 6:30 PM)">
                          Tarde (2:00 PM - 6:30 PM)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                      Hora aproximada o comentario opcional
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Preferiblemente a las 4:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-4 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Solicitar Cita con Eslen</span>
                  </button>

                  <p className="text-[11px] text-center text-[#2D2926]/60">
                    Sin cobros anticipados. Eslen confirmará tu cupo directamente a tu WhatsApp.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
