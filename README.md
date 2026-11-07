# FORMA Essentials — Estudio de Diseño de Cejas por Eslen & Makeup Boutique (Ocaña)

Aplicación web integral **Mobile-First** (**E-commerce + Sistema de Reserva de Citas + Panel de Administración con Analíticas en Tiempo Real y Firebase Cloud**) diseñada bajo el concepto **"Clean Girl / Luxury Beauty Studio"** para **FORMA Essentials** por **Eslen** en Ocaña, Norte de Santander, Colombia.

---

## ✨ Características Principales

### 1. Identidad Visual & UI/UX (Mobile-First)
- **Marca Principal:** **FORMA** (*FORMA Essentials • Brow & Makeup Studio by Eslen*).
- **Paleta Luxury:** Blanco Hueso / Alabastro (`#FAF7F5`), Rosa Pastel Ultra Suave (`#FDF2F4`), Blush (`#F4C2C2` / `#E8A598`), Rose Gold Profundo (`#B76E79`), Gris Carbón Oscuro (`#2D2926`) y Verde Salvia (`#6B9080`).
- **Tipografía Editorial:** *Cormorant Garamond / Playfair Display* (Títulos Serif) + *Plus Jakarta Sans* (UI & Cuerpo).
- **Navegación Móvil Fija (Bottom Bar):** Acceso rápido con un pulgar a *Tienda*, *Citas Eslen*, *Carrito* y *Panel Admin*.

### 2. Frontend Público (Vista Clienta)
- **Hero Section & Propuesta de Valor:** Doble llamado a la acción (*"Explorar Maquillaje"* y *"Agendar Cita de Cejas"*) + Cinta de Confianza (*Productos 100% Originales, Aprobados por Eslen, Entregas Rápidas en Ocaña, Pago Contra Entrega o Transferencia*).
- **Catálogo E-Commerce con Tracking Silencioso de Interés (`clicks_count`):**
  - Filtro por categorías dinámicas y buscador en tiempo real.
  - Cada clic en *"Ver Detalles"* o *"Agregar"* incrementa automáticamente el contador `clicks_count` del producto en tiempo real.
- **Carrito Slide-Over & Checkout para Ocaña:**
  - Validación de celular/WhatsApp colombiano (10 dígitos).
  - Selector de barrios de Ocaña (*Centro, Primavera, El Lago, Ciudadela Norte, El Carmen, La Piñuela*, etc.) + dirección y punto de referencia.
  - Métodos de pago: *Efectivo Contra Entrega*, *Nequi* y *Daviplata*.
  - Generación de código único de orden (`#ORD-XXXX`), descuento automático de inventario y alerta sonora/visual para el administrador.
- **Agendamiento de Citas con Eslen:**
  - Perfil profesional de Eslen + selector interactivo de servicios de cejas con duración y precio en COP.
  - Envío directo a la pestaña **"Citas Solicitadas"** en el Panel Admin.

### 3. Dashboard Administrativo (`/admin` o `#admin` — Clave: `12345`)
- **Analíticas en Tiempo Real:** Contador de visitas por sesión, KPIs de ingresos en COP y **Ranking de Clics por Producto** con gráfico de barras visual.
- **Gestión de Pedidos y Despacho por WhatsApp:** Alerta de pedidos pendientes y botón directo **"Contactar y Despachar por WhatsApp"** con mensaje pre-estructurado automático.
- **Gestión de Citas de Cejas:** Confirmación en un clic vía WhatsApp.
- **CRUD Completo de Productos:** Crear, editar, pausar (marcar agotado) o eliminar productos con soporte para pegar URL de imagen o subir fotografía desde el dispositivo (Base64).
- **Configuración de Redes Sociales y Firebase Cloud:** Edición en tiempo real de enlaces de Instagram, TikTok, WhatsApp y conexión directa con **Firebase Cloud Firestore**.

---

## 🚀 Instalación y Ejecución Local

```bash
npm install
npm run dev
```
*(Clave de acceso al Panel Admin: **`12345`**)*
