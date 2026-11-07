import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
  PackageCheck,
  HeartHandshake
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/format';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductModal,
    setSelectedProductModal,
    addToCart,
    setIsCartOpen,
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(1);
    setAddedSuccess(false);
  }, [selectedProductModal]);

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const isOutOfStock = product.paused || product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    // Note: click was already tracked when opening modal, but if user clicks Agregar al Carrito we also track interest
    addToCart(product, quantity, true);
    setAddedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2D2926]/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#FAF7F5] rounded-3xl border border-[#F4C2C2] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-[#2D2926] text-[#2D2926] hover:text-white flex items-center justify-center shadow-md transition-colors"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Column */}
        <div className="md:w-1/2 bg-[#FDF2F4] relative aspect-square md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#2D2926] text-white text-xs font-semibold shadow-md">
              ✦ {product.badge}
            </span>
          )}
        </div>

        {/* Right Details Column */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B76E79]">
              {product.category}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926] mt-1">
              {product.name}
            </h2>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-[#B76E79]">
                {formatCOP(product.price)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B9080] bg-[#6B9080]/10 px-2.5 py-1 rounded-full">
                <PackageCheck className="w-3.5 h-3.5" />
                {isOutOfStock ? 'Agotado' : `${product.stock} unidades en Ocaña`}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#2D2926]/80 leading-relaxed">
            {product.description}
          </p>

          {/* Benefits List */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2926]">
                Beneficios Destacados:
              </h4>
              <ul className="space-y-1.5">
                {product.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#2D2926]/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#6B9080] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eslen's Secret Tip Box */}
          {product.usageTip && (
            <div className="bg-[#FDF2F4] border border-[#F4C2C2] rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B76E79] mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Secreto de Aplicación por Eslen (FORMA Studio):</span>
              </div>
              <p className="text-xs text-[#2D2926]/80 italic leading-relaxed">
                “{product.usageTip}”
              </p>
            </div>
          )}

          {/* Quantity Selector + CTA */}
          {!isOutOfStock ? (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#F4C2C2] bg-white rounded-xl px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg hover:bg-[#FDF2F4] flex items-center justify-center text-[#2D2926]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-[#2D2926]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-7 h-7 rounded-lg hover:bg-[#FDF2F4] flex items-center justify-center text-[#2D2926]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3 px-5 rounded-xl shadow-luxury flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Agregar • {formatCOP(product.price * quantity, false)}
                  </span>
                </button>
              </div>

              {addedSuccess && (
                <div className="bg-[#6B9080]/15 border border-[#6B9080] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2D2926]">
                    ✓ Producto añadido a tu bolsa FORMA
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProductModal(null);
                      setIsCartOpen(true);
                    }}
                    className="text-xs font-bold text-[#6B9080] underline"
                  >
                    Ir a Pagar →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-100 text-center text-xs font-semibold text-gray-500">
              Este producto se encuentra temporalmente agotado en el estudio.
            </div>
          )}

          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#2D2926]/60">
            <HeartHandshake className="w-4 h-4 text-[#B76E79]" />
            <span>
              Entrega rápida en Ocaña • Pago Contra Entrega, Nequi o Daviplata.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
