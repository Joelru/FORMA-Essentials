import { Product, BrowService, StoreSettings, Order, Appointment } from '../types';

export const OCANA_NEIGHBORHOODS = [
  'Centro',
  'Primavera',
  'El Lago',
  'Ciudadela Norte',
  'El Carmen',
  'La Piñuela',
  'Marabel',
  'Los Sauces',
  'San Agustín',
  'La Gloria',
  'Las Llanadas',
  'Acolsure',
  'Santa Clara',
  'Juan XXIII',
  'Buenos Aires',
  'Torcoroma',
  'Otro sector en Ocaña'
];

export const PRODUCT_CATEGORIES = [
  'Cuidado y Fijación de Cejas',
  'Rostro',
  'Labios',
  'Ojos',
  'Kits Recomendados por Eslen',
] as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-forma-01',
    name: 'Gel Fijador de Cejas Extra Fuerte FORMA',
    category: 'Cuidado y Fijación de Cejas',
    price: 38000,
    stock: 18,
    paused: false,
    badge: 'Recomendado por Eslen',
    image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=900&q=85',
    description:
      'Fórmula transparente de efecto laminado instantáneo durante 24 horas sin dejar residuos blancos ni sensación acartonada. Enriquecido con pantenol y biotina para cuidar cada vello.',
    benefits: [
      'Efecto Brow Lamination limpio durante todo el día en el clima de Ocaña',
      'Cero residuos blancos o descamación (Flake-Free)',
      'Cepillo aplicador de precisión incluido',
      'Enriquecido con Pantenol fortificante'
    ],
    usageTip:
      'Peina tus cejas hacia arriba en ángulo de 45° con una mínima cantidad de producto antes de aplicar cualquier sombra o lápiz. Luego presiona suavemente con el cabo del cepillo para sellar el efecto laminado.',
    clicks_count: 0,
    createdAt: '2026-11-06T10:00:00.000Z'
  },
  {
    id: 'prod-forma-02',
    name: 'Suero de Cejas y Pestañas FORMA (Brow & Lash Serum)',
    category: 'Cuidado y Fijación de Cejas',
    price: 62000,
    stock: 15,
    paused: false,
    badge: 'Recomendado por Eslen',
    image: '/forma-serum.jpg',
    description:
      'Elixir botánico concentrado oficial de FORMA Estudio & Cosmética con péptidos bio-activos, biotina, aceite de ricino prensado en frío y vitamina E. Recupera cejas despobladas y fortalece tus pestañas desde la raíz.',
    benefits: [
      'Estimula los folículos para mayor densidad y grosor en 4 a 6 semanas',
      'Ideal post-laminado para nutrir e hidratar profundamente',
      'Fórmula hipoalergénica de rápida absorción sin sensación grasa',
      'Presentación oficial FORMA con gotero dosificador de precisión'
    ],
    usageTip:
      'Aplícalo todas las noches después de desmaquillarte sobre la raíz de las cejas y pestañas limpias. La constancia durante 30 días transforma por completo el marco de tu mirada.',
    clicks_count: 0,
    createdAt: '2026-11-06T10:05:00.000Z'
  },
  {
    id: 'prod-forma-03',
    name: 'Pomada Profesional para Cejas Waterproof',
    category: 'Cuidado y Fijación de Cejas',
    price: 45000,
    stock: 14,
    paused: false,
    badge: 'Más Vendido',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',
    description:
      'Pomada cremosa de alta pigmentación y acabado aterciopelado natural. Resistente al agua, humedad y sudor, ideal para definir la cola de la ceja con máxima elegancia y simetría.',
    benefits: [
      'Fórmula 100% impermeable y de larga duración (hasta 36h)',
      'Textura sedosa que se desliza sin emplastar',
      'Subtono neutro cenizo que no oxida a rojizo',
      'Ideal para rellenar espacios vacíos con acabado empolvado'
    ],
    usageTip:
      'Toma producto con pincel biselado ultra fino, descarga el exceso en el dorso de tu mano y concentra el color de la mitad hacia la cola de la ceja. Difumina el inicio solo con lo que sobra en la brocha.',
    clicks_count: 0,
    createdAt: '2026-11-06T10:10:00.000Z'
  },
  {
    id: 'prod-forma-04',
    name: 'Kit de Diseño y Sombreado FORMA',
    category: 'Kits Recomendados por Eslen',
    price: 89000,
    stock: 9,
    paused: false,
    badge: 'Recomendado por Eslen',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85',
    description:
      'El ritual completo de estudio en casa seleccionado personalmente por Eslen. Incluye dúo de sombras minerales micro-pulverizadas, gel fijador transparente, pincel doble biselado profesional y espuma limpiadora.',
    benefits: [
      'Todo lo que necesitas para mantener tu diseño de cejas impecable',
      'Tonos universales modulables (Rubio Oscuro a Castaño Profundo)',
      'Brocha de grado profesional con cepillo spoolie',
      'Ahorras un 20% frente a comprar los productos por separado'
    ],
    usageTip:
      'Usa el tono más claro en el primer centímetro del inicio de la ceja y el tono más profundo desde el arco hasta la punta para lograr el icónico efecto Ombré de FORMA.',
    clicks_count: 0,
    createdAt: '2026-11-06T10:15:00.000Z'
  },
  {
    id: 'prod-forma-05',
    name: 'Lápiz Microblading Precisión Pelo a Pelo',
    category: 'Ojos',
    price: 34000,
    stock: 22,
    paused: false,
    badge: 'Favorito FORMA',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85',
    description:
      'Punta retráctil ultra delgada de 1.5 mm diseñada para imitar trazos reales de vello natural con precisión milimétrica. Perfecto para rutinas rápidas estilo Clean Girl.',
    benefits: [
      'Punta micro-fina de 1.5 mm para trazos hiperrealistas',
      'Cera botánica suave que no maltrata el folículo piloso',
      'Incluye cepillo difuminador en el extremo opuesto',
      'Resistente al roce y a jornadas largas'
    ],
    usageTip:
      'Con la piel completamente limpia y seca (antes de la base), realiza trazos cortos y suaves siguiendo la dirección natural del crecimiento de tus vellos.',
    clicks_count: 0,
    createdAt: '2026-11-06T10:20:00.000Z'
  },
  {
    id: 'prod-forma-06',
    name: 'Iluminador & Corrector de Arco de Ceja Rose Glow',
    category: 'Rostro',
    price: 41000,
    stock: 15,
    paused: false,
    badge: 'Más Vendido',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85',
    description:
      'Dúo cremoso de doble punta (Mate Satinado + Champagne Rose Glow) creado para limpiar el borde inferior de la ceja y aportar un efecto lifting inmediato a la mirada.',
    benefits: [
      'Doble extremo: corrector de alta cobertura + iluminador sedoso',
      'Efecto lifting visual instantáneo en el hueso de la ceja',
      'Se difumina con el dedo o brocha plana en segundos',
      'También funciona como iluminador en lagrimal y arco de cupido'
    ],
    usageTip:
      'Traza una línea fina justo debajo del arco de tu ceja con el lado mate para enmarcar, difumina hacia el párpado y finaliza con un toque del lado satinado en el punto más alto del arco.',
    clicks_count: 0,
    createdAt: '2026-11-06T10:25:00.000Z'
  }
];

export const BROW_SERVICES: BrowService[] = [
  {
    id: 'srv-01',
    name: 'Diseño de Cejas + Sombreado Semipermanente',
    duration: '45 min',
    price: 35000,
    tag: 'El Más Solicitado',
    description:
      'Mapeo facial personalizado (visagismo áureo), diseño arquitectónico según tus facciones, depilación suave de alta precisión y sombreado híbrido con efecto empolvado natural.'
  },
  {
    id: 'srv-02',
    name: 'Laminado de Cejas (Brow Lamination) + Botox Nutritivo',
    duration: '60 min',
    price: 60000,
    tag: 'Tendencia Clean Girl',
    description:
      'Alineación direccionada del vello para lograr cejas más abundantes, definidas y estilizadas hasta por 6 semanas. Incluye diseño, perfilado e hidratación profunda con keratina y vitaminas.'
  },
  {
    id: 'srv-03',
    name: 'Depilación con Hilo/Cera + Diseño de Visagismo',
    duration: '30 min',
    price: 22000,
    description:
      'Diseño simétrico respetando el grosor natural de tu ceja con técnica mixta hipoalergénica y gel calmante post-depilación de aloe y rosas.'
  },
  {
    id: 'srv-04',
    name: 'Mantenimiento & Perfilado FORMA',
    duration: '25 min',
    price: 18000,
    description:
      'Ideal para clientas frecuentes (cada 15 a 20 días) que desean conservar la estructura impecable de su diseño previo e hidratar el folículo.'
  },
  {
    id: 'srv-05',
    name: 'Experiencia FORMA (Laminado + Diseño + Sombreado)',
    duration: '75 min',
    price: 78000,
    tag: 'VIP Studio',
    description:
      'Transformación total de la mirada por Eslen: Brow Lamination, mapeo arquitectónico, sombreado semipermanente a medida, parche de colágeno en ojeras y obsequio de cepillo fijador.'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  brandName: 'FORMA',
  brandSubtitle: 'ESTUDIO & COSMÉTICA • POR ESLEN',
  ownerName: 'Eslen',
  city: 'Ocaña, Norte de Santander',
  studioAddress: 'FORMA Estudio & Cosmética — Ocaña, Norte de Santander',
  instagramUrl: 'https://instagram.com/forma.estudio',
  instagramHandle: '@forma.estudio',
  tiktokUrl: 'https://tiktok.com/@forma.estudio',
  tiktokHandle: '@forma.estudio',
  whatsappNumber: '3154829104',
  nequiNumber: '3154829104',
  daviplataNumber: '3154829104',
  announcementText: '✨ Entregas rápidas en Ocaña • Pago Contra Entrega, Nequi o Daviplata',
  bookingUrl: 'https://beautysitesbd.web.app/booking/framestudio',
  ntfyTopic: 'forma-eslen-ocana-alertas',
  notificationsEnabled: true
};

// Bases de datos vacías (en 0) para iniciar en producción limpia
export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];
