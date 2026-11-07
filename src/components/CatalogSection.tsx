import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  Eye,
  Sparkles,
  Check,
  PackageCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES } from '../data/seedData';
import { Product } from '../types';
import { formatCOP } from '../utils/format';

export const CatalogSection: React.FC = () => {
  const { products, addToCart, openProductDetail, setIsCartOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    if (product.paused || product.stock <= 0) return;
    // addToCart automatically increments clicks_count when shouldTrackClick=true
    addToCart(product, 1, true);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1400);
  };

  return (
    <section id="catalogo" className="py-12 sm:py-16 bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F4] border border-[#F4C2C2] text-[#B76E79] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Oficial • FORMA
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2926]">
            Maquillaje & Cuidado de Cejas
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#2D2926]/70">
            Seleccionados por Eslen para lograr fijación, pigmentación limpia y cuidado real todos los días.
          </p>
        </div>

        {/* Search & Dynamic Category Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-[#B76E79] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o categoría (ej. Gel fijador, pomada, suero, kit...)"
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-[#F4C2C2] text-sm text-[#2D2926] placeholder:text-[#2D2926]/45 focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#F4C2C2]/50 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2D2926]/50 hover:text-[#2D2926]"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Category Pills (Mobile-First) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start md:justify-center">
            <button
              onClick={() => setSelectedCategory('Todos')}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === 'Todos'
                  ? 'bg-[#B76E79] text-white shadow-sm'
                  : 'bg-white text-[#2D2926]/80 border border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
              }`}
            >
              Todos ({products.length})
            </button>
            {PRODUCT_CATEGORIES.map((category) => {
              const count = products.filter((p) => p.category === category).length;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#B76E79] text-white shadow-sm'
                      : 'bg-white text-[#2D2926]/80 border border-[#F4C2C2]/70 hover:bg-[#FDF2F4]'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F4C2C2]/60 p-10 text-center max-w-md mx-auto shadow-sm">
            <Sparkles className="w-10 h-10 text-[#B76E79] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-semibold text-[#2D2926]">
              No encontramos productos con ese filtro
            </h3>
            <p className="text-xs sm:text-sm text-[#2D2926]/65 mt-1">
              Intenta con otra palabra clave o explora todas las categorías de FORMA.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#B76E79] text-white text-xs font-semibold hover:bg-[#9A5660] transition-colors"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.paused || product.stock <= 0;
              const isRecentlyAdded = addedId === product.id;

              return (
                <article
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#F4C2C2]/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Square Product Image Container */}
                  <div className="relative aspect-square w-full bg-[#FDF2F4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => openProductDetail(product)}
                      className={`w-full h-full object-cover object-center cursor-pointer group-hover:scale-105 transition-transform duration-500 ${
                        isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''
                      }`}
                    />

                    {/* Top Left Optional Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm ${
                          product.badge === 'Recomendado por Eslen'
                            ? 'bg-[#2D2926] text-[#FDF2F4]'
                            : product.badge === 'Más Vendido'
                            ? 'bg-[#B76E79] text-white'
                            : 'bg-white/95 text-[#B76E79] border border-[#F4C2C2]'
                        }`}
                      >
                        ✦ {product.badge}
                      </span>
                    )}

                    {/* Stock Indicator Pill */}
                    <div className="absolute bottom-3 left-3">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2D2926]/90 text-white text-[11px] font-semibold">
                          <AlertCircle className="w-3 h-3 text-[#F4C2C2]" />
                          Agotado Temporalmente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#2D2926] text-[11px] font-medium shadow-sm">
                          <PackageCheck className="w-3.5 h-3.5 text-[#6B9080]" />
                          {product.stock} disponibles
                        </span>
                      )}
                    </div>

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={() => openProductDetail(product)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/95 hover:bg-[#2D2926] text-[#2D2926] hover:text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B76E79]">
                        {product.category}
                      </p>
                      <h3
                        onClick={() => openProductDetail(product)}
                        className="font-serif text-xl font-bold text-[#2D2926] mt-1 cursor-pointer hover:text-[#B76E79] transition-colors line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#2D2926]/70 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#FDF2F4] flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#2D2926]/50">
                          Precio Oficial
                        </span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-[#2D2926]">
                          {formatCOP(product.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                            isOutOfStock
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : isRecentlyAdded
                              ? 'bg-[#6B9080] text-white'
                              : 'bg-[#B76E79] hover:bg-[#9A5660] text-white active:scale-95'
                          }`}
                        >
                          {isRecentlyAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>¡Agregado!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Agregar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {isRecentlyAdded && (
                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="mt-2 w-full text-center text-xs font-semibold text-[#6B9080] hover:underline"
                      >
                        Ver mi bolsa y finalizar pedido →
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
