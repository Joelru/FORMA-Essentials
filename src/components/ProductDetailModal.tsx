import React from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  PackageCheck,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/format';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductModal,
    setSelectedProductModal,
    addToCart,
    updateCartQuantity,
    getProductCartQuantity,
    setIsCartOpen,
  } = useStore();

  if (!selectedProductModal) return null;

  // Always use live product state for accurate stock validation
  const product =
    products.find((p) => p.id === selectedProductModal.id) || selectedProductModal;
  const isOutOfStock = product.paused || product.stock <= 0;
  const qtyInCart = getProductCartQuantity(product.id);
  const atMaxStock = qtyInCart >= product.stock;
  const remainingStock = Math.max(0, product.stock - qtyInCart);

  const handleInitialBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOutOfStock) return;
    addToCart(product, 1, true, e.currentTarget);
  };

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOutOfStock || atMaxStock) return;
    updateCartQuantity(product.id, qtyInCart + 1, e.currentTarget);
  };

  const handleDecrement = () => {
    updateCartQuantity(product.id, qtyInCart - 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#2D2926]/65 backdrop-blur-sm animate-fadeIn"
      onClick={() => setSelectedProductModal(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative w-full max-w-3xl bg-[#FAF7F5] rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#F4C2C2] shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col md:flex-row animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-[#2D2926] text-[#2D2926] hover:text-white flex items-center justify-center shadow-md transition-colors"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Top Image Column (Compact on mobile so content is never cut off) */}
        <div className="md:w-1/2 bg-[#FDF2F4] relative h-52 sm:h-64 md:h-auto shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#2D2926] text-white text-[11px] font-semibold shadow-md">
              ✦ {product.badge}
            </span>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D2926] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <PackageCheck className="w-3.5 h-3.5 text-[#6B9080]" />
              {isOutOfStock
                ? 'Agotado'
                : product.stock === 1
                ? '¡Última unidad disponible!'
                : `${product.stock} unidades en Ocaña`}
            </span>
          </div>
        </div>

        {/* Right Details Column with Sticky Mobile Action Footer */}
        <div className="md:w-1/2 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Information Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B76E79]">
                {product.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926] mt-0.5 leading-tight">
                {product.name}
              </h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B76E79]">
                  {formatCOP(product.price)}
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
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Secreto de Aplicación por Eslen:</span>
                </div>
                <p className="text-xs text-[#2D2926]/80 italic leading-relaxed">
                  “{product.usageTip}”
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-[#2D2926]/65 pt-1">
              <HeartHandshake className="w-4 h-4 text-[#B76E79] shrink-0" />
              <span>
                Entrega rápida en Ocaña • Pago Contra Entrega, Nequi o Daviplata.
              </span>
            </div>
          </div>

          {/* Sticky Bottom Purchase Bar (Never cut off on mobile) */}
          <div className="shrink-0 bg-white border-t border-[#F4C2C2]/70 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:p-5 space-y-2.5">
            {isOutOfStock ? (
              <div className="p-3 rounded-xl bg-gray-100 text-center text-xs font-semibold text-gray-500">
                Este producto se encuentra temporalmente agotado en el estudio.
              </div>
            ) : qtyInCart === 0 ? (
              <button
                type="button"
                onClick={handleInitialBuy}
                className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 px-5 rounded-2xl shadow-luxury flex items-center justify-center gap-2.5 text-sm sm:text-base transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar • {formatCOP(product.price)}</span>
              </button>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  {/* Live Quantity Stepper [- 1 +] */}
                  <div className="flex items-center bg-[#FDF2F4] border-2 border-[#B76E79] rounded-xl p-1 shrink-0">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      aria-label={
                        qtyInCart === 1
                          ? 'Quitar producto del carrito'
                          : 'Disminuir cantidad'
                      }
                      className="w-9 h-9 rounded-lg bg-white hover:bg-[#F4C2C2]/40 text-[#2D2926] flex items-center justify-center shadow-sm active:scale-90 transition-all"
                    >
                      {qtyInCart === 1 ? (
                        <Trash2 className="w-4 h-4 text-[#B76E79]" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </button>

                    <div className="px-3.5 text-center min-w-[46px]">
                      <span className="block text-base font-bold text-[#2D2926] leading-none">
                        {qtyInCart}
                      </span>
                      <span className="block text-[9px] font-bold text-[#B76E79] uppercase">
                        {qtyInCart === 1 ? 'unidad' : 'unids'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={atMaxStock}
                      aria-label={
                        atMaxStock ? 'Stock máximo alcanzado' : 'Sumar una unidad'
                      }
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all ${
                        atMaxStock
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-[#B76E79] hover:bg-[#9A5660] text-white active:scale-90'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Direct Checkout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductModal(null);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 bg-[#2D2926] hover:bg-[#B76E79] text-white font-semibold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors"
                  >
                    <span>
                      Ir a Pagar ({formatCOP(product.price * qtyInCart, false)})
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                {/* Stock Validation Helper */}
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span
                    className={
                      atMaxStock
                        ? 'text-[#B76E79] font-semibold'
                        : 'text-[#6B9080] font-medium'
                    }
                  >
                    {product.stock === 1
                      ? '✦ Única unidad disponible en stock'
                      : atMaxStock
                      ? `✦ Alcanzaste el máximo disponible (${product.stock} uds)`
                      : `✓ En tu bolsa • Puedes agregar ${remainingStock} más`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
