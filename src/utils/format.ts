import { Order, Appointment } from '../types';

export function formatCOP(value: number, includeSuffix = true): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return includeSuffix ? `${formatted} COP` : formatted;
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isValidColombianPhone(phone: string): boolean {
  const digits = cleanPhone(phone);
  return digits.length === 10 && digits.startsWith('3');
}

export function buildOrderWhatsAppUrl(order: Order): string {
  const digits = cleanPhone(order.customerPhone);
  const phoneWithCountry = digits.startsWith('57') ? digits : `57${digits}`;
  const productsText = order.items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(', ');
  const totalFormatted = new Intl.NumberFormat('es-CO').format(order.total);
  const fullAddress = `${order.neighborhood} - ${order.address}`;

  const message = `¡Hola ${order.customerName}! Te escribimos de la tienda oficial de Eslen (FORMA). Hemos recibido tu pedido #${order.id} por un valor de $${totalFormatted} (${productsText}). Confirmamos tu dirección en ${fullAddress} para coordinar el despacho.`;

  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
}

export function buildAppointmentWhatsAppUrl(appointment: Appointment): string {
  const digits = cleanPhone(appointment.customerPhone);
  const phoneWithCountry = digits.startsWith('57') ? digits : `57${digits}`;
  const priceFormatted = new Intl.NumberFormat('es-CO').format(appointment.servicePrice);

  const message = `¡Hola ${appointment.customerName}! ✨ Soy Eslen de FORMA en Ocaña. Recibí tu solicitud de cita (#${appointment.id}) para el servicio de *${appointment.serviceName}* ($${priceFormatted} COP) el día *${appointment.preferredDate}* en la jornada de la *${appointment.preferredTimeSlot}*. Te escribo para confirmar tu hora exacta en agenda.`;

  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
}

export function playNotificationChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(587.33, now, 0.25); // D5
    playTone(880, now + 0.16, 0.45); // A5
  } catch {
    // Ignorar si el navegador bloquea el audio antes de interacción
  }
}
