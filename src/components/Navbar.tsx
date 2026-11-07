import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Calendar,
  Instagram,
  MapPin,
  Bell,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormaLogo } from './FormaLogo';
import { EXTERNAL_BOOKING_URL } from './BookingSection';

interface NavbarProps {
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  const {
    cartCount,
    isCartBumping,
    setIsCartOpen,
    settings,
    latestAlert,
    dismissAlert,
  } = useStore();

  const bookingUrl = settings.bookingUrl || EXTERNAL_BOOKING_URL;

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
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F4C2C2] animate-pulse shrink-0" />
            <p className="font-medium tracking-wide text-[11px] sm:text-xs text-[#FDF2F4] line-clamp-1">
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

      {/* Live Floating Toast Alert ONLY visible inside /admin */}
      {activeView === 'admin' && latestAlert && (
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
                  onClick={dismissAlert}
                  className="text-xs text-[#F4C2C2] font-semibold hover:text-white"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#F4C2C2]/40 transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Left: Navigation Links (Desktop) */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-4 text-sm font-medium text-[#2D2926]/80"
          >
            {/* Highlighted Animated Booking CTA in Header */}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-nav-cta bg-[#FDF2F4] hover:bg-[#B76E79] text-[#9A5660] hover:text-white border border-[#B76E79]/60 px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Cita con Eslen</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <button
              onClick={() => scrollToSection('catalogo')}
              className="hover:text-[#B76E79] transition-colors flex items-center gap-1.5 px-2 py-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <span>Tienda de Maquillaje</span>
            </button>
          </nav>

          {/* Center: Prominent FORMA Brand Identity */}
          <button
            onClick={() => {
              setActiveView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left md:text-center group focus:outline-none min-w-0"
            aria-label="Inicio FORMA — Estudio & Cosmética por Eslen"
          >
            <FormaLogo size="md" showWordmark={true} showSubtitle={true} />
          </button>

          {/* Right: Socials & Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram FORMA"
              className="hidden sm:flex w-9 h-9 rounded-full bg-[#FDF2F4] border border-[#F4C2C2]/60 items-center justify-center text-[#2D2926] hover:bg-[#B76E79] hover:text-white transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Cart Trigger Button */}
            <button
              data-cart-target="true"
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-2 bg-[#2D2926] hover:bg-[#B76E79] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95 ${
                isCartBumping ? 'animate-cart-bump ring-4 ring-[#F4C2C2]' : ''
              }`}
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4 h-4 text-[#F4C2C2]" />
              <span className="hidden sm:inline">Mi Bolsa</span>
              <span
                className={`min-w-[20px] h-5 px-1 rounded-full bg-white text-[#2D2926] text-xs font-bold flex items-center justify-center transition-transform ${
                  isCartBumping ? 'scale-125 bg-[#FDF2F4] text-[#B76E79]' : ''
                }`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-First Bottom Fixed Bar with Highlighted Animated Center "Agendar Cita" CTA */}
      {activeView === 'store' && (
        <nav
          aria-label="Navegación móvil inferior"
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-lg border-t border-[#F4C2C2]/60 px-3 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(45,41,38,0.08)]"
        >
          <div className="grid grid-cols-3 gap-2 items-center max-w-sm mx-auto">
            <button
              onClick={() => scrollToSection('catalogo')}
              className="flex flex-col items-center justify-center py-1 rounded-xl text-[#2D2926]/85 hover:text-[#B76E79] transition-colors"
            >
              <Sparkles className="w-5 h-5 text-[#B76E79]" />
              <span className="text-[11px] font-medium mt-0.5">Tienda</span>
            </button>

            {/* Center Prominent Animated Booking Button on Mobile */}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-cta-loop flex flex-col items-center justify-center py-2 px-2 rounded-2xl bg-gradient-to-r from-[#B76E79] to-[#9A5660] text-white shadow-luxury"
            >
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[11px] font-bold tracking-wide">Agendar Cita</span>
              </div>
            </a>

            <button
              data-cart-target="true"
              onClick={() => setIsCartOpen(true)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl text-[#2D2926]/85 hover:text-[#B76E79] transition-colors ${
                isCartBumping ? 'animate-cart-bump' : ''
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#B76E79]" />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#B76E79] text-white text-[10px] font-bold flex items-center justify-center shadow-sm ${
                      isCartBumping ? 'scale-125 ring-2 ring-[#F4C2C2]' : ''
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium mt-0.5">Mi Bolsa</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};
