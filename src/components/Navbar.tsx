import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Calendar,
  Lock,
  Instagram,
  MapPin,
  Bell
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  const {
    cartCount,
    setIsCartOpen,
    settings,
    orders,
    appointments,
    latestAlert,
    dismissAlert,
  } = useStore();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pendiente por Despachar'
  ).length;
  const pendingAppointmentsCount = appointments.filter(
    (a) => a.status === 'Pendiente'
  ).length;
  const totalAdminAlerts = pendingOrdersCount + pendingAppointmentsCount;

  const scrollToSection = (id: string) => {
    if (activeView !== 'store') {
      setActiveView('store');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#2D2926] text-[#FAF7F5] text-xs py-2 px-4 border-b border-[#B76E79]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 mx-auto md:mx-0 text-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F4C2C2] animate-pulse" />
            <p className="font-medium tracking-wide text-[11px] sm:text-xs text-[#FDF2F4]">
              {settings.announcementText}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#F4C2C2]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E8A598]" />
              {settings.city}
            </span>
            <span>•</span>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              IG: {settings.instagramHandle}
            </a>
            <span>•</span>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok: {settings.tiktokHandle}
            </a>
          </div>
        </div>
      </div>

      {/* Live Floating Toast Alert for New Order / Appointment */}
      {latestAlert && (
        <div className="fixed top-16 right-4 z-50 max-w-sm bg-[#2D2926] text-[#FAF7F5] rounded-2xl p-4 shadow-2xl border border-[#B76E79] animate-bounce">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B76E79] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-[#F4C2C2] font-semibold">
                Notificación en Tiempo Real
              </p>
              <p className="font-serif text-base font-semibold text-white mt-0.5">
                {latestAlert.title}
              </p>
              <p className="text-xs text-[#FAF7F5]/80 truncate">{latestAlert.subtitle}</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    dismissAlert();
                    setActiveView('admin');
                  }}
                  className="text-xs font-semibold text-[#F4C2C2] underline hover:text-white"
                >
                  Abrir Panel Admin →
                </button>
                <button
                  onClick={dismissAlert}
                  className="text-xs text-[#FAF7F5]/60 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#F4C2C2]/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2D2926]/80">
            <button
              onClick={() => scrollToSection('catalogo')}
              className="hover:text-[#B76E79] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              Tienda de Maquillaje
            </button>
            <button
              onClick={() => scrollToSection('citas-eslen')}
              className="hover:text-[#B76E79] transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-[#B76E79]" />
              Agendar Cita con Eslen
            </button>
          </nav>

          {/* Center: Prominent FORMA Brand Identity */}
          <button
            onClick={() => {
              setActiveView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left md:text-center group focus:outline-none"
          >
            <div className="flex items-center md:justify-center gap-2">
              <span className="font-serif text-2xl sm:text-4xl font-bold tracking-[0.22em] text-[#2D2926] group-hover:text-[#B76E79] transition-colors">
                FORMA
              </span>
              <span className="inline-block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] px-2 py-0.5 rounded-full bg-[#FDF2F4] text-[#B76E79] border border-[#F4C2C2]/60">
                Essentials
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#2D2926]/65 font-medium -mt-0.5">
              Brow & Makeup Studio • By {settings.ownerName}
            </p>
          </button>

          {/* Right: Socials, Admin & Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram FORMA Essentials"
              className="hidden sm:flex w-9 h-9 rounded-full bg-[#FDF2F4] border border-[#F4C2C2]/60 items-center justify-center text-[#2D2926] hover:bg-[#B76E79] hover:text-white transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Admin Studio Button */}
            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
              className={`relative px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 border ${
                activeView === 'admin'
                  ? 'bg-[#2D2926] text-white border-[#2D2926]'
                  : 'bg-[#FDF2F4] text-[#2D2926] border-[#F4C2C2] hover:border-[#B76E79]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="hidden sm:inline">
                {activeView === 'admin' ? 'Ver Tienda' : 'Panel Admin'}
              </span>
              {totalAdminAlerts > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-[#B76E79] text-white text-[10px] font-bold rounded-full animate-pulse">
                  {totalAdminAlerts}
                </span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#B76E79] hover:bg-[#9A5660] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Bolsa</span>
              <span className="w-5 h-5 rounded-full bg-white text-[#2D2926] text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-First Bottom Fixed Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-lg border-t border-[#F4C2C2]/60 px-2 py-1.5 shadow-[0_-4px_20px_rgba(45,41,38,0.06)]">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            onClick={() => scrollToSection('catalogo')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              activeView === 'store' ? 'text-[#B76E79]' : 'text-[#2D2926]/70'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-0.5">Tienda</span>
          </button>

          <button
            onClick={() => scrollToSection('citas-eslen')}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[#2D2926]/80 hover:text-[#B76E79] transition-colors"
          >
            <Calendar className="w-5 h-5 text-[#B76E79]" />
            <span className="text-[11px] font-medium mt-0.5">Citas Eslen</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[#2D2926]/80 hover:text-[#B76E79] transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#B76E79] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium mt-0.5">Carrito</span>
          </button>

          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              activeView === 'admin'
                ? 'bg-[#FDF2F4] text-[#B76E79] font-semibold'
                : 'text-[#2D2926]/70'
            }`}
          >
            <div className="relative">
              <Lock className="w-5 h-5" />
              {totalAdminAlerts > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#B76E79] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalAdminAlerts}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium mt-0.5">Admin</span>
          </button>
        </div>
      </nav>
    </>
  );
};
