import React, { useState, useEffect, useCallback } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { BookingSection } from './components/BookingSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

function checkIsAdminUrl(): boolean {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.endsWith('/admin') ||
    hash === '#admin' ||
    hash === '#/admin'
  );
}

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'store' | 'admin'>(() =>
    checkIsAdminUrl() ? 'admin' : 'store'
  );

  useEffect(() => {
    document.title =
      activeView === 'admin'
        ? 'FORMA | Panel de Administración'
        : 'FORMA — Diseño de Cejas & Maquillaje por Eslen | Ocaña';
  }, [activeView]);

  useEffect(() => {
    const syncViewFromUrl = () => {
      setActiveView(checkIsAdminUrl() ? 'admin' : 'store');
    };
    window.addEventListener('popstate', syncViewFromUrl);
    window.addEventListener('hashchange', syncViewFromUrl);
    return () => {
      window.removeEventListener('popstate', syncViewFromUrl);
      window.removeEventListener('hashchange', syncViewFromUrl);
    };
  }, []);

  const handleSetView = useCallback((view: 'store' | 'admin') => {
    setActiveView(view);
    if (view === 'admin') {
      window.history.pushState(null, '', '/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', '/');
    }
  }, []);

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#2D2926]">
        <Navbar activeView={activeView} setActiveView={handleSetView} />

        {activeView === 'store' ? (
          <main className="flex-1">
            <HeroSection />
            <CatalogSection />
            <BookingSection />
          </main>
        ) : (
          <main className="flex-1">
            <AdminDashboard onBackToStore={() => handleSetView('store')} />
          </main>
        )}

        <Footer />

        {/* Interactive Modals & Drawers */}
        <ProductDetailModal />
        <CartDrawer />
      </div>
    </StoreProvider>
  );
};

export default App;
