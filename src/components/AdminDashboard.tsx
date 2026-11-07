import React, { useState, useMemo } from 'react';
import {
  Lock,
  LogOut,
  BarChart3,
  ShoppingBag,
  Calendar,
  Package,
  Settings,
  Bell,
  Eye,
  TrendingUp,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  Upload,
  Link as LinkIcon,
  Save,
  Cloud,
  Sparkles,
  ArrowLeft,
  MousePointerClick
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  Product,
  ProductCategory,
  ProductBadge,
  OrderStatus,
  FirebaseCustomConfig
} from '../types';
import { PRODUCT_CATEGORIES } from '../data/seedData';
import {
  formatCOP,
  buildOrderWhatsAppUrl
} from '../utils/format';
import { getSavedFirebaseConfig, saveFirebaseCustomConfig } from '../lib/firebase';
import { FormaLogo } from './FormaLogo';
import { EXTERNAL_BOOKING_URL } from './BookingSection';
import {
  DEFAULT_NTFY_TOPIC,
  sendNtfyPush,
  showBrowserSystemNotification
} from '../utils/notifications';

const ADMIN_SESSION_KEY = 'forma_admin_auth_session_v1';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const {
    products,
    orders,
    bookingRedirects,
    settings,
    visitsCount,
    firebaseStatus,
    updateOrderStatus,
    addProduct,
    updateProduct,
    toggleProductPaused,
    deleteProduct,
    updateSettings,
    syncAllToFirebase,
    resetAllMetricsToZero,
  } = useStore();

  // Authentication state (Persist in localStorage & sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem(ADMIN_SESSION_KEY) === 'true' ||
      sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
    );
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'orders' | 'products' | 'settings'
  >('analytics');

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<string>('Todos');

  // Product CRUD Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Cuidado y Fijación de Cejas');
  const [prodPrice, setProdPrice] = useState<string>('38000');
  const [prodStock, setProdStock] = useState<string>('15');
  const [prodBadge, setProdBadge] = useState<ProductBadge>('Recomendado por Eslen');
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodBenefits, setProdBenefits] = useState('');
  const [prodUsageTip, setProdUsageTip] = useState('');
  const [productSavedMsg, setProductSavedMsg] = useState('');

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');
  const [testPushStatus, setTestPushStatus] = useState<string>('');
  const [browserPermStatus, setBrowserPermStatus] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported'
  );

  // Firebase Custom Config Form State
  const existingFb = getSavedFirebaseConfig();
  const [fbConfig, setFbConfig] = useState<FirebaseCustomConfig>({
    apiKey: existingFb?.apiKey || '',
    authDomain: existingFb?.authDomain || '',
    projectId: existingFb?.projectId || '',
    storageBucket: existingFb?.storageBucket || '',
    messagingSenderId: existingFb?.messagingSenderId || '',
    appId: existingFb?.appId || '',
  });
  const [fbSavedMsg, setFbSavedMsg] = useState('');

  // Derived KPI Metrics
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'Pendiente por Despachar'),
    [orders]
  );

  const deliveredRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'Despachado / Entregado')
        .reduce((acc, o) => acc + o.total, 0),
    [orders]
  );

  const pendingRevenue = useMemo(
    () =>
      orders
        .filter(
          (o) =>
            o.status === 'Pendiente por Despachar' || o.status === 'En Camino'
        )
        .reduce((acc, o) => acc + o.total, 0),
    [orders]
  );

  // Products ranked by clicks_count descending
  const rankedProductsByClicks = useMemo(() => {
    return [...products].sort(
      (a, b) => (b.clicks_count || 0) - (a.clicks_count || 0)
    );
  }, [products]);

  const maxClicks = useMemo(() => {
    if (rankedProductsByClicks.length === 0) return 1;
    return Math.max(1, rankedProductsByClicks[0].clicks_count || 1);
  }, [rankedProductsByClicks]);

  const totalClicksAllProducts = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.clicks_count || 0), 0);
  }, [products]);

  // Login Handler (Password strictly '12345')
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '12345') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Contraseña incorrecta. La clave de acceso del estudio es 12345.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  // Image File to Base64 Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setProdImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(String(product.price));
    setProdStock(String(product.stock));
    setProdBadge(product.badge);
    setProdImage(product.image);
    setProdDescription(product.description);
    setProdBenefits((product.benefits || []).join('\n'));
    setProdUsageTip(product.usageTip || '');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Cuidado y Fijación de Cejas');
    setProdPrice('38000');
    setProdStock('15');
    setProdBadge('Recomendado por Eslen');
    setProdImage('');
    setProdDescription('');
    setProdBenefits('');
    setProdUsageTip('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Math.max(1000, Number(prodPrice) || 0);
    const numericStock = Math.max(0, Number(prodStock) || 0);
    const benefitsArray = prodBenefits
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const finalImage =
      prodImage.trim() ||
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85';

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName.trim(),
        category: prodCategory,
        price: numericPrice,
        stock: numericStock,
        badge: prodBadge,
        image: finalImage,
        description: prodDescription.trim(),
        benefits:
          benefitsArray.length > 0
            ? benefitsArray
            : ['Producto 100% original aprobado por Eslen'],
        usageTip:
          prodUsageTip.trim() ||
          'Aplicar sobre la piel o cejas limpias siguiendo tu rutina FORMA.',
      });
      setProductSavedMsg('✓ Producto actualizado correctamente en la tienda.');
    } else {
      addProduct({
        name: prodName.trim(),
        category: prodCategory,
        price: numericPrice,
        stock: numericStock,
        paused: false,
        badge: prodBadge,
        image: finalImage,
        description: prodDescription.trim(),
        benefits:
          benefitsArray.length > 0
            ? benefitsArray
            : ['Producto 100% original aprobado por Eslen'],
        usageTip:
          prodUsageTip.trim() ||
          'Aplicar sobre la piel o cejas limpias siguiendo tu rutina FORMA.',
      });
      setProductSavedMsg('✓ Nuevo producto publicado inmediatamente en FORMA.');
    }

    resetProductForm();
    setTimeout(() => setProductSavedMsg(''), 3500);
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedMsg(
      '✓ Redes sociales y datos de FORMA actualizados en toda la tienda.'
    );
    setTimeout(() => setSettingsSavedMsg(''), 3500);
  };

  const handleSaveFirebaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbConfig.apiKey.trim() || !fbConfig.projectId.trim()) {
      saveFirebaseCustomConfig(null);
      setFbSavedMsg('Configuración local activa (se limpiaron credenciales personalizadas).');
      return;
    }
    saveFirebaseCustomConfig(fbConfig);
    const ok = await syncAllToFirebase();
    setFbSavedMsg(
      ok
        ? `✓ Conectado y sincronizado con Firebase Firestore (${fbConfig.projectId}).`
        : 'Credenciales guardadas. Recarga la página para iniciar el listener en tiempo real.'
    );
    setTimeout(() => setFbSavedMsg(''), 4000);
  };

  // RENDER LOGIN GATE IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FDF2F4] to-[#FAF7F5]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#F4C2C2] shadow-luxury p-7 sm:p-9 text-center">
          <div className="flex justify-center mb-3">
            <FormaLogo size="lg" showWordmark={true} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B76E79]">
            ACCESO EXCLUSIVO • ESLEN
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2D2926] mt-1">
            Panel de Administración
          </h1>
          <p className="text-xs sm:text-sm text-[#2D2926]/70 mt-1.5">
            Acceso exclusivo para Eslen. Gestiona pedidos en Ocaña, citas de cejas, inventario y analíticas en tiempo real.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                Contraseña de Administradora
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa la clave (12345)"
                className="w-full px-4 py-3.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79] focus:bg-white"
              />
              <p className="text-[11px] text-[#2D2926]/55 mt-1.5">
                Clave por defecto configurada: <code className="font-bold text-[#B76E79]">12345</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 px-6 rounded-xl shadow-luxury transition-all text-sm"
            >
              Ingresar al Dashboard de FORMA
            </button>
          </form>

          <button
            onClick={onBackToStore}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D2926]/65 hover:text-[#B76E79]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la tienda pública
          </button>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  const filteredOrders = orders.filter(
    (o) => orderFilter === 'Todos' || o.status === orderFilter
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Admin Header Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F4C2C2] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <FormaLogo size="sm" showWordmark={true} />
              <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F4] text-[#B76E79] border border-[#F4C2C2] text-xs font-bold">
                Panel Administrativo • Eslen
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  firebaseStatus.isConnected
                    ? 'bg-[#6B9080]/15 text-[#6B9080]'
                    : 'bg-[#FDF2F4] text-[#B76E79]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {firebaseStatus.isConnected
                  ? `Firebase Cloud (${firebaseStatus.projectId})`
                  : 'Persistencia Local Sincronizada'}
              </span>
            </div>
            <p className="text-xs text-[#2D2926]/65 mt-1">
              Monitoreo en tiempo real de visitas, clics de interés, pedidos de productos y catálogo en Ocaña.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToStore}
              className="px-4 py-2.5 rounded-xl bg-[#FDF2F4] hover:bg-[#F4C2C2]/60 text-[#2D2926] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ver Tienda Pública
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-[#2D2926] hover:bg-black text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Prominent Alert Banner for Unshipped Orders */}
        {pendingOrders.length > 0 && (
          <div className="bg-gradient-to-r from-[#2D2926] via-[#3d3431] to-[#B76E79] text-white rounded-2xl p-4 sm:p-5 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#B76E79] flex items-center justify-center shrink-0 animate-bounce">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#F4C2C2] font-bold">
                  Alerta de Despacho Inmediato • Ocaña
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  Tienes {pendingOrders.length}{' '}
                  {pendingOrders.length === 1
                    ? 'pedido nuevo sin despachar'
                    : 'pedidos nuevos sin despachar'}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-[#2D2926] hover:bg-[#FDF2F4] text-xs font-bold shadow-sm transition-colors"
            >
              Gestionar y Despachar por WhatsApp →
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#B76E79] text-white shadow-sm'
                : 'bg-white text-[#2D2926] border border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analíticas y Clics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#B76E79] text-white shadow-sm'
                : 'bg-white text-[#2D2926] border border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#2D2926] text-white text-[10px] font-bold">
                {pendingOrders.length} nuevos
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#B76E79] text-white shadow-sm'
                : 'bg-white text-[#2D2926] border border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos CRUD ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-[#B76E79] text-white shadow-sm'
                : 'bg-white text-[#2D2926] border border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Redes & Firebase</span>
          </button>

          <a
            href={settings.bookingUrl || EXTERNAL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 bg-white text-[#6B9080] border border-[#6B9080]/40 hover:bg-[#6B9080] hover:text-white transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Plataforma Externa de Citas ↗</span>
          </a>
        </div>

        {/* =========================================================
            TAB 1: ANALYTICS & REAL-TIME METRICS
           ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Visits */}
              <div className="bg-white rounded-2xl p-5 border border-[#F4C2C2]/70 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D2926]/60">
                    Visitas Totales a la Web
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#B76E79] flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2926] mt-2">
                  {visitsCount.toLocaleString('es-CO')}
                </p>
                <p className="text-[11px] text-[#6B9080] font-medium mt-1">
                  ✓ Controlado por sesión única activa
                </p>
              </div>

              {/* Total Orders & Pending */}
              <div className="bg-white rounded-2xl p-5 border border-[#F4C2C2]/70 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D2926]/60">
                    Órdenes Recibidas
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#B76E79] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2926] mt-2">
                  {orders.length}
                </p>
                <p className="text-[11px] text-[#B76E79] font-semibold mt-1">
                  {pendingOrders.length} pendientes por despachar
                </p>
              </div>

              {/* Delivered Revenue */}
              <div className="bg-white rounded-2xl p-5 border border-[#F4C2C2]/70 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D2926]/60">
                    Ingresos Entregados
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#6B9080]/15 text-[#6B9080] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#6B9080] mt-2">
                  {formatCOP(deliveredRevenue)}
                </p>
                <p className="text-[11px] text-[#2D2926]/60 mt-1">
                  + {formatCOP(pendingRevenue)} por cobrar en despacho
                </p>
              </div>

              {/* Total Product Clicks */}
              <div className="bg-white rounded-2xl p-5 border border-[#F4C2C2]/70 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D2926]/60">
                    Interacciones en Catálogo
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#B76E79] flex items-center justify-center">
                    <MousePointerClick className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2926] mt-2">
                  {totalClicksAllProducts} clics
                </p>
                <p className="text-[11px] text-[#2D2926]/60 mt-1">
                  Clics en "Detalles" y "Comprar"
                </p>
              </div>
            </div>

            {/* Live Booking Redirects Tracker + Mobile Notification Quick Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Real-time log of people clicking "Agendar Cita" */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#F4C2C2] shadow-soft space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FDF2F4] pb-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B9080]">
                      Monitoreo de Citas en Tiempo Real
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2926]">
                      Redirecciones a Plataforma de Citas ({bookingRedirects.length})
                    </h3>
                    <p className="text-xs text-[#2D2926]/65">
                      Cada vez que una clienta pulsa "Agendar Cita", queda registrado aquí y te llega una alerta al celular.
                    </p>
                  </div>
                  <a
                    href={settings.bookingUrl || EXTERNAL_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#6B9080] hover:bg-[#57786a] text-white text-xs font-semibold transition-colors"
                  >
                    Abrir Agenda Externa ↗
                  </a>
                </div>

                {bookingRedirects.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#2D2926]/60 bg-[#FAF7F5] rounded-2xl border border-[#F4C2C2]/40">
                    Aún no se han registrado clics hacia la plataforma de citas desde el último reinicio.
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                    {bookingRedirects.slice(0, 15).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2]/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-[#B76E79]/15 text-[#B76E79] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {index === 0 ? '★' : index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2D2926] truncate">
                              {item.source}
                            </p>
                            <p className="text-[10px] text-[#6B9080] font-medium">
                              Redirigida a BeautySites (framestudio)
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-[#2D2926]/65 shrink-0">
                          {new Date(item.createdAt).toLocaleString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Mobile Push Notification Setup & Instant Test Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#2D2926] to-[#3d3431] text-[#FAF7F5] rounded-3xl p-5 sm:p-6 border border-[#B76E79]/40 shadow-luxury flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B76E79]/30 border border-[#F4C2C2]/40 text-[#F4C2C2] text-[10px] font-bold uppercase tracking-wider">
                    <Bell className="w-3.5 h-3.5" />
                    Alertas al Celular 24/7
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Recibe avisos en tu celular al instante
                  </h3>
                  <p className="text-xs text-[#FAF7F5]/80 leading-relaxed">
                    Entérate en el acto cuando alguien haga un <strong>pedido de productos</strong> o cuando alguien <strong>vaya a agendar cita</strong>:
                  </p>
                  <ol className="text-xs text-[#FAF7F5]/90 space-y-1.5 list-decimal pl-4 pt-1">
                    <li>
                      Descarga gratis la app <strong>ntfy</strong> en Play Store (Android) o App Store (iPhone).
                    </li>
                    <li>
                      Pulsa el botón <strong>+</strong> y escribe tu código de canal:{' '}
                      <code className="px-2 py-0.5 rounded bg-white/15 text-[#F4C2C2] font-mono font-bold select-all">
                        {settings.ntfyTopic || DEFAULT_NTFY_TOPIC}
                      </code>
                    </li>
                    <li>
                      ¡Listo! Tu celular sonará automáticamente con cada pedido o clic a citas.
                    </li>
                  </ol>
                </div>

                <div className="space-y-2 pt-1">
                  {testPushStatus && (
                    <div className="p-2.5 rounded-xl bg-white/10 border border-[#F4C2C2]/40 text-[11px] text-[#F4C2C2] font-semibold text-center">
                      {testPushStatus}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      setTestPushStatus('Enviando notificación de prueba...');
                      const ok = await sendNtfyPush({
                        topic: settings.ntfyTopic || DEFAULT_NTFY_TOPIC,
                        title: '✨ ¡Prueba Exitosa de FORMA!',
                        message:
                          'Las alertas de nuevos pedidos y redirecciones a citas están conectadas a tu celular.',
                        priority: 5,
                        tags: ['sparkles', 'white_check_mark'],
                        clickUrl: `${window.location.origin}/admin`,
                      });
                      showBrowserSystemNotification(
                        '✨ ¡Prueba Exitosa de FORMA!',
                        'Las notificaciones están activas en este dispositivo.'
                      );
                      setTestPushStatus(
                        ok
                          ? `✓ ¡Alerta enviada al canal "${
                              settings.ntfyTopic || DEFAULT_NTFY_TOPIC
                            }"! Revisa tu app ntfy.`
                          : 'No se pudo conectar con el servidor de notificaciones.'
                      );
                      setTimeout(() => setTestPushStatus(''), 5000);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#B76E79] hover:bg-[#9A5660] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Probar Notificación a mi Celular Ahora</span>
                  </button>

                  {browserPermStatus !== 'granted' && browserPermStatus !== 'unsupported' && (
                    <button
                      type="button"
                      onClick={async () => {
                        const perm = await Notification.requestPermission();
                        setBrowserPermStatus(perm);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                    >
                      Activar también alertas en este navegador
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Clicks Ranking (Visual Bar Chart + Table) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F4C2C2] shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FDF2F4] pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">
                    Termómetro de Interés en Tiempo Real
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                    Ranking de Clics por Producto (`clicks_count`)
                  </h3>
                  <p className="text-xs text-[#2D2926]/65">
                    Descubre qué productos de FORMA llaman más la atención de tus clientas en Ocaña.
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-[#FDF2F4] text-[#B76E79] text-xs font-bold self-start">
                  Top #1: {rankedProductsByClicks[0]?.name || '—'}
                </span>
              </div>

              {/* Visual Bar Chart */}
              <div className="space-y-4">
                {rankedProductsByClicks.map((prod, idx) => {
                  const pct = Math.round(((prod.clicks_count || 0) / maxClicks) * 100);
                  return (
                    <div key={prod.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              idx === 0
                                ? 'bg-[#B76E79] text-white'
                                : idx === 1
                                ? 'bg-[#E8A598] text-[#2D2926]'
                                : 'bg-[#FDF2F4] text-[#2D2926]'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#F4C2C2]"
                          />
                          <span className="font-semibold text-[#2D2926] truncate">
                            {prod.name}
                          </span>
                          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F5] text-[#2D2926]/60 border border-[#F4C2C2]/50">
                            {prod.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[#2D2926]/60 hidden sm:inline">
                            Stock: {prod.stock}
                          </span>
                          <span className="font-mono font-bold text-sm text-[#B76E79]">
                            {prod.clicks_count || 0} clics
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-[#FDF2F4] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E8A598] to-[#B76E79] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: ORDER MANAGEMENT & WHATSAPP DISPATCH
           ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                Órdenes de Compra Recibidas
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Todos',
                    'Pendiente por Despachar',
                    'En Camino',
                    'Despachado / Entregado',
                    'Cancelado',
                  ] as const
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      orderFilter === st
                        ? 'bg-[#2D2926] text-white'
                        : 'bg-white text-[#2D2926] border border-[#F4C2C2]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#F4C2C2]">
                <ShoppingBag className="w-10 h-10 text-[#B76E79] mx-auto mb-2" />
                <p className="font-serif text-xl font-bold text-[#2D2926]">
                  No hay pedidos en este estado
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const whatsappUrl = buildOrderWhatsAppUrl(order);
                  const isPending = order.status === 'Pendiente por Despachar';
                  const isDelivered = order.status === 'Despachado / Entregado';

                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-soft ${
                        isPending
                          ? 'border-2 border-[#B76E79]'
                          : 'border-[#F4C2C2]/70'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#FDF2F4]">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-bold px-3 py-1 rounded-full bg-[#2D2926] text-white">
                              #{order.id}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                isPending
                                  ? 'bg-[#FDF2F4] text-[#B76E79] border border-[#B76E79]'
                                  : isDelivered
                                  ? 'bg-[#6B9080]/15 text-[#6B9080]'
                                  : order.status === 'Cancelado'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-xs text-[#2D2926]/60 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(order.createdAt).toLocaleString('es-CO', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2926] pt-1">
                            {order.customerName}
                          </h4>
                        </div>

                        {/* Direct WhatsApp Dispatch CTA + Status Selector */}
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#6B9080] hover:bg-[#567668] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Contactar y Despachar por WhatsApp</span>
                          </a>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs font-bold text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                          >
                            <option value="Pendiente por Despachar">
                              Pendiente por Despachar
                            </option>
                            <option value="En Camino">En Camino</option>
                            <option value="Despachado / Entregado">
                              Despachado / Entregado
                            </option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>

                      {/* Order Details Body */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 text-xs">
                        <div className="md:col-span-5 space-y-2">
                          <p className="font-bold uppercase tracking-wider text-[#B76E79] text-[10px]">
                            Datos de Entrega en Ocaña
                          </p>
                          <p className="flex items-center gap-2 text-[#2D2926]">
                            <Phone className="w-3.5 h-3.5 text-[#B76E79]" />
                            <span>WhatsApp: </span>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline text-[#B76E79]"
                            >
                              {order.customerPhone}
                            </a>
                          </p>
                          <p className="flex items-start gap-2 text-[#2D2926]">
                            <MapPin className="w-3.5 h-3.5 text-[#B76E79] shrink-0 mt-0.5" />
                            <span>
                              <strong>Barrio {order.neighborhood}:</strong> {order.address}
                            </span>
                          </p>
                          <p className="text-[#2D2926]/80">
                            <strong>Método de Pago:</strong> {order.paymentMethod}
                          </p>
                          {order.notes && (
                            <p className="p-2.5 rounded-xl bg-[#FDF2F4] text-[#2D2926]/85 italic">
                              Nota: "{order.notes}"
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-7 bg-[#FAF7F5] rounded-2xl p-4 border border-[#F4C2C2]/60 flex flex-col justify-between">
                          <div className="space-y-2">
                            <p className="font-bold uppercase tracking-wider text-[#B76E79] text-[10px]">
                              Productos Comprados
                            </p>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-1 border-b border-[#F4C2C2]/30 last:border-0"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-lg object-cover"
                                  />
                                  <span className="font-semibold text-[#2D2926]">
                                    {item.quantity}x {item.name}
                                  </span>
                                </div>
                                <span className="font-semibold text-[#2D2926]">
                                  {formatCOP(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 mt-2 border-t border-[#F4C2C2] flex items-center justify-between">
                            <span className="font-bold text-[#2D2926]">
                              Total a Cobrar:
                            </span>
                            <span className="font-serif text-2xl font-bold text-[#B76E79]">
                              {formatCOP(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: COMPLETE PRODUCT CRUD
           ========================================================= */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: Create / Edit Product Form */}
            <form
              onSubmit={handleSaveProduct}
              className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#F4C2C2] shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B76E79]">
                    Gestión de Catálogo FORMA
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                    {editingProductId ? 'Editar Producto' : 'Agregar Producto Nuevo'}
                  </h3>
                </div>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="text-xs font-semibold text-[#B76E79] underline"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              {productSavedMsg && (
                <div className="p-3 rounded-xl bg-[#6B9080]/15 border border-[#6B9080] text-xs font-semibold text-[#2D2926]">
                  {productSavedMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ej. Gel Fijador de Cejas Extra Fuerte FORMA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Categoría *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs sm:text-sm"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Etiqueta Especial
                  </label>
                  <select
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value as ProductBadge)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs sm:text-sm"
                  >
                    <option value="Recomendado por Eslen">Recomendado por Eslen</option>
                    <option value="Más Vendido">Más Vendido</option>
                    <option value="Favorito FORMA">Favorito FORMA</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="">Sin etiqueta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Precio en COP *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-sm"
                  />
                </div>
              </div>

              {/* Image URL or Device Upload (Base64) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2D2926]">
                  Imagen del Producto (Pegar URL o Subir desde tu celular/PC)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-[#B76E79] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>

                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FDF2F4] hover:bg-[#F4C2C2]/50 text-[#B76E79] text-xs font-semibold border border-[#F4C2C2] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir foto desde mi dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                {prodImage && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={prodImage}
                      alt="Vista previa"
                      className="w-14 h-14 rounded-xl object-cover border border-[#F4C2C2]"
                    />
                    <span className="text-[11px] text-[#6B9080] font-medium">
                      ✓ Imagen cargada lista para publicar
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Descripción del Producto *
                </label>
                <textarea
                  required
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Describe por qué este producto es ideal..."
                  className="w-full p-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Beneficios (1 por línea)
                </label>
                <textarea
                  rows={2}
                  value={prodBenefits}
                  onChange={(e) => setProdBenefits(e.target.value)}
                  placeholder={'Larga duración 24h\nSin residuos blancos'}
                  className="w-full p-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Modo de uso / Recomendación de Eslen
                </label>
                <textarea
                  rows={2}
                  value={prodUsageTip}
                  onChange={(e) => setProdUsageTip(e.target.value)}
                  placeholder="Consejo profesional de aplicación por Eslen..."
                  className="w-full p-3 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 px-5 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {editingProductId ? 'Guardar Cambios' : 'Publicar Producto en Tienda'}
                </span>
              </button>
            </form>

            {/* Right: Inventory List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                  Inventario Actual ({products.length} productos)
                </h3>
              </div>

              <div className="space-y-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl p-4 border border-[#F4C2C2]/70 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className={`w-16 h-16 rounded-xl object-cover border border-[#F4C2C2] shrink-0 ${
                          prod.paused ? 'grayscale opacity-60' : ''
                        }`}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
                            {prod.category}
                          </span>
                          {prod.badge && (
                            <span className="px-2 py-0.2 rounded-full bg-[#FDF2F4] text-[#B76E79] text-[10px] font-bold">
                              {prod.badge}
                            </span>
                          )}
                          {prod.paused && (
                            <span className="px-2 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                              Pausado / Agotado
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-lg font-bold text-[#2D2926]">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#2D2926]/70 mt-0.5">
                          <span className="font-bold text-[#2D2926]">
                            {formatCOP(prod.price)}
                          </span>
                          <span>•</span>
                          <span>Stock: {prod.stock}</span>
                          <span>•</span>
                          <span className="text-[#B76E79] font-semibold">
                            {prod.clicks_count || 0} clics
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => startEditProduct(prod)}
                        className="px-3 py-2 rounded-xl bg-[#FDF2F4] hover:bg-[#F4C2C2] text-[#2D2926] text-xs font-semibold flex items-center gap-1"
                        title="Editar producto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => toggleProductPaused(prod.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                          prod.paused
                            ? 'bg-[#6B9080] text-white'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                        title={
                          prod.paused ? 'Reactivar producto' : 'Pausar (Marcar Agotado)'
                        }
                      >
                        {prod.paused ? (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Activar</span>
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Pausar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Eliminar definitivamente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: SOCIAL NETWORKS & FIREBASE CLOUD CONFIG
           ========================================================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Store & Social Links Form */}
            <form
              onSubmit={handleSaveStoreSettings}
              className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#F4C2C2] shadow-soft space-y-4"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B76E79]">
                  Actualización Instantánea
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                  Redes Sociales y Contacto FORMA
                </h3>
                <p className="text-xs text-[#2D2926]/65">
                  Los cambios se reflejan al instante en la cabecera, botones flotantes y pie de página.
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 rounded-xl bg-[#6B9080]/15 border border-[#6B9080] text-xs font-semibold text-[#2D2926]">
                  {settingsSavedMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Enlace de Instagram (`URL`)
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.instagramUrl}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                    }
                    placeholder="https://instagram.com/forma.essentials"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Usuario de Instagram
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.instagramHandle}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        instagramHandle: e.target.value,
                      })
                    }
                    placeholder="@forma.essentials"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Enlace de TikTok (`URL`)
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.tiktokUrl}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })
                    }
                    placeholder="https://tiktok.com/@forma.essentials"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Usuario de TikTok
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.tiktokHandle}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        tiktokHandle: e.target.value,
                      })
                    }
                    placeholder="@forma.essentials"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    WhatsApp Principal (10 dígitos)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        whatsappNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Número Nequi
                  </label>
                  <input
                    type="text"
                    value={settingsForm.nequiNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, nequiNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Número Daviplata
                  </label>
                  <input
                    type="text"
                    value={settingsForm.daviplataNumber}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        daviplataNumber: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Dirección / Ubicación del Estudio en Ocaña
                </label>
                <input
                  type="text"
                  value={settingsForm.studioAddress}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, studioAddress: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Texto Cinta Superior de Anuncio
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcementText: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FDF2F4] border border-[#F4C2C2] space-y-2.5">
                <label className="block text-xs font-bold text-[#B76E79]">
                  🔔 Código de Canal de Alertas al Celular (App ntfy)
                </label>
                <input
                  type="text"
                  value={settingsForm.ntfyTopic || DEFAULT_NTFY_TOPIC}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      ntfyTopic: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '-'),
                    })
                  }
                  placeholder="forma-eslen-ocana-alertas"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F4C2C2] text-xs font-mono font-bold text-[#2D2926]"
                />
                <p className="text-[11px] text-[#2D2926]/70">
                  Suscríbete a este código en la app gratuita <strong>ntfy</strong> (Android / iOS) para recibir notificaciones push instantáneas cada vez que pidan un producto o vayan a agendar cita.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 px-5 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Configuración de Redes y Estudio</span>
              </button>
            </form>

            {/* Firebase Cloud Firestore Connection Panel */}
            <form
              onSubmit={handleSaveFirebaseConfig}
              className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#F4C2C2] shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B9080]">
                    Base de Datos Cloud + LocalStorage
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                    Conexión Firebase Firestore
                  </h3>
                </div>
                <Cloud className="w-7 h-7 text-[#B76E79]" />
              </div>

              <p className="text-xs text-[#2D2926]/70 leading-relaxed">
                FORMA cuenta con persistencia híbrida: guarda todo al instante en{' '}
                <code>localStorage</code> (con sincronización entre pestañas) y se conecta en
                tiempo real a <strong>Firebase Cloud Firestore</strong> mediante variables{' '}
                <code>.env</code> o ingresando tus credenciales aquí:
              </p>

              {fbSavedMsg && (
                <div className="p-3 rounded-xl bg-[#6B9080]/15 border border-[#6B9080] text-xs font-semibold text-[#2D2926]">
                  {fbSavedMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Firebase API Key
                  </label>
                  <input
                    type="text"
                    value={fbConfig.apiKey}
                    onChange={(e) =>
                      setFbConfig({ ...fbConfig, apiKey: e.target.value })
                    }
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={fbConfig.projectId}
                    onChange={(e) =>
                      setFbConfig({ ...fbConfig, projectId: e.target.value })
                    }
                    placeholder="forma-essentials-ocana"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={fbConfig.authDomain}
                    onChange={(e) =>
                      setFbConfig({ ...fbConfig, authDomain: e.target.value })
                    }
                    placeholder="forma-essentials.firebaseapp.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={fbConfig.appId}
                    onChange={(e) =>
                      setFbConfig({ ...fbConfig, appId: e.target.value })
                    }
                    placeholder="1:123456789:web:abcdef"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#F4C2C2] text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2D2926] hover:bg-black text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#F4C2C2]" />
                <span>Guardar y Sincronizar con Firebase Cloud</span>
              </button>

              {/* Reset Metrics & Database to Zero for Clean Launch */}
              <div className="pt-4 border-t border-[#F4C2C2]/60 space-y-2">
                <p className="text-xs font-bold text-[#2D2926]">
                   Producción Limpia (Iniciar Contadores desde 0)
                </p>
                <p className="text-[11px] text-[#2D2926]/65">
                  Reinicia a <strong>0</strong> el contador de visitas, los clics de todos los
                  productos (`clicks_count = 0`), los pedidos de prueba y las citas tanto en el
                  navegador como en Firebase Firestore.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await resetAllMetricsToZero();
                    setFbSavedMsg(
                      '✓ Contadores de clics, visitas, pedidos y citas reiniciados en 0 (Local + Firebase).'
                    );
                    setTimeout(() => setFbSavedMsg(''), 4000);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FDF2F4] hover:bg-[#F4C2C2]/60 text-[#B76E79] border border-[#E8A598] text-xs font-bold transition-colors"
                >
                  Reiniciar Clics, Visitas, Pedidos y Citas en 0
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
