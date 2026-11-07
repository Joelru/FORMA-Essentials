export type ProductCategory =
  | 'Cuidado y Fijación de Cejas'
  | 'Rostro'
  | 'Labios'
  | 'Ojos'
  | 'Kits Recomendados por Eslen';

export type ProductBadge =
  | 'Recomendado por Eslen'
  | 'Más Vendido'
  | 'Favorito FORMA'
  | 'Nuevo'
  | '';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // En COP (ej. 38000)
  stock: number;
  paused: boolean; // Si está pausado / agotado manualmente desde Admin
  badge: ProductBadge;
  image: string;
  description: string;
  benefits: string[];
  usageTip: string; // Modo de uso sugerido por Eslen
  clicks_count: number; // Tracking silencioso de interés
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'Efectivo Contra Entrega' | 'Nequi' | 'Daviplata';

export type OrderStatus =
  | 'Pendiente por Despachar'
  | 'En Camino'
  | 'Despachado / Entregado'
  | 'Cancelado';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // ej. ORD-1024
  customerName: string;
  customerPhone: string; // 10 dígitos Colombia
  neighborhood: string; // Barrio en Ocaña
  address: string; // Dirección exacta + punto de referencia
  paymentMethod: PaymentMethod;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  isNew?: boolean;
}

export interface BrowService {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  tag?: string;
}

export type AppointmentTimeSlot = 'Mañana (8:30 AM - 12:00 PM)' | 'Tarde (2:00 PM - 6:30 PM)';

export type AppointmentStatus = 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';

export interface Appointment {
  id: string; // ej. CITA-204
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  preferredDate: string;
  preferredTimeSlot: AppointmentTimeSlot;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  isNew?: boolean;
}

export interface StoreSettings {
  brandName: string;
  brandSubtitle: string;
  ownerName: string;
  city: string;
  studioAddress: string;
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  tiktokHandle: string;
  whatsappNumber: string; // 10 dígitos sin +57, ej: 3150000000
  nequiNumber: string;
  daviplataNumber: string;
  announcementText: string;
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
