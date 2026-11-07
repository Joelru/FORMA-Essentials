import { Order, StoreSettings } from '../types';
import { formatCOP } from './format';

export const DEFAULT_NTFY_TOPIC = 'forma-eslen-ocana-alertas';

export interface BookingRedirectEvent {
  id: string;
  source: string; // Ej: "Servicio: Laminado de Cejas" o "Botón Portada"
  createdAt: string;
}

/**
 * Envía una notificación push instantánea al celular/PC del administrador usando ntfy.sh
 * (100% gratuito, sin registro, funciona con la app móvil ntfy en Android/iOS y en navegador).
 */
export async function sendNtfyPush(params: {
  topic: string;
  title: string;
  message: string;
  priority?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  clickUrl?: string;
}): Promise<boolean> {
  const cleanTopic = (params.topic || DEFAULT_NTFY_TOPIC)
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-');

  if (!cleanTopic) return false;

  const payload = {
    topic: cleanTopic,
    title: params.title,
    message: params.message,
    priority: params.priority ?? 4,
    tags: params.tags ?? ['sparkles'],
    ...(params.clickUrl ? { click: params.clickUrl } : {}),
  };

  try {
    // Usamos POST al endpoint raíz con JSON en texto plano (CORS simple request + keepalive)
    // para que funcione incluso cuando el usuario está siendo redirigido a otra página.
    const bodyString = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([bodyString], { type: 'text/plain;charset=UTF-8' });
      const queued = navigator.sendBeacon('https://ntfy.sh', blob);
      if (queued) return true;
    }

    const res = await fetch('https://ntfy.sh', {
      method: 'POST',
      body: bodyString,
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Muestra una notificación nativa del sistema operativo / navegador si el administrador dio permiso
 */
export function showBrowserSystemNotification(title: string, body: string, url?: string): void {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      const notif = new Notification(title, {
        body,
        icon: '/forma-logo.png',
        badge: '/forma-logo.png',
      });
      if (url) {
        notif.onclick = () => {
          window.open(url, '_blank');
        };
      }
    }
  } catch {
    // Ignorar si el navegador móvil restringe el constructor directo de Notification
  }
}

/**
 * Dispara alerta inmediata cuando una clienta hace clic en "Agendar Cita" hacia la plataforma externa
 */
export function notifyOwnerBookingRedirect(
  source: string,
  settings: StoreSettings
): void {
  const topic = settings.ntfyTopic || DEFAULT_NTFY_TOPIC;
  const bookingUrl =
    settings.bookingUrl || 'https://beautysitesbd.web.app/booking/framestudio';
  const timeStr = new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const title = '📅 ¡Clienta yendo a Agendar Cita! (FORMA)';
  const message = `Una persona acaba de ir a la plataforma de citas desde "${source}" a las ${timeStr}. Entra a revisar si agenda su turno.`;

  if (settings.notificationsEnabled !== false) {
    sendNtfyPush({
      topic,
      title,
      message,
      priority: 4,
      tags: ['calendar', 'sparkles'],
      clickUrl: bookingUrl,
    });
  }
}

/**
 * Dispara alerta inmediata cuando una clienta confirma un pedido de productos en la tienda
 */
export function notifyOwnerNewOrder(
  order: Order,
  settings: StoreSettings
): void {
  const topic = settings.ntfyTopic || DEFAULT_NTFY_TOPIC;
  const itemsText = order.items
    .map((i) => `${i.quantity}x ${i.name}`)
    .join(', ');

  const title = `🛍️ ¡Nuevo Pedido ${order.id} (${formatCOP(order.total)})!`;
  const message = `Clienta: ${order.customerName}\nWhatsApp: ${order.customerPhone}\nDestino: ${order.neighborhood} (${order.address})\nPago: ${order.paymentMethod}\nProductos: ${itemsText}`;

  if (settings.notificationsEnabled !== false) {
    sendNtfyPush({
      topic,
      title,
      message,
      priority: 5,
      tags: ['shopping_cart', 'tada'],
      clickUrl: `${window.location.origin}/admin`,
    });
  }
}
