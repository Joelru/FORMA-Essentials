import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { BookingSection } from './components/BookingSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'store' | 'admin'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.endsWith('/admin') || hash === '#admin') {
      return 'admin';
    }
    return 'store';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setActiveView('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetView = (view: 'store' | 'admin') => {
    setActiveView(view);
    if (view === 'admin') {
      window.history.replaceState(null, '', '#admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

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

        <Footer onOpenAdmin={() => handleSetView('admin')} />

        {/* Interactive Modals & Drawers */}
        <ProductDetailModal />
        <CartDrawer />
      </div>
    </StoreProvider>
  );
};

export default App;
