import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Wallet,
  FileText,
  Sparkles,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OCANA_NEIGHBORHOODS } from '../data/seedData';
import { PaymentMethod, Order } from '../types';
import { formatCOP, isValidColombianPhone, cleanPhone } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    products,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    createOrder,
    settings,
    setLegalModalTab,
  } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState(OCANA_NEIGHBORHOODS[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo Contra Entrega');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      if (step === 'confirmed') {
        setStep('cart');
        setConfirmedOrder(null);
      }
    }, 300);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError('Tu bolsa está vacía. Agrega al menos un producto.');
      return;
    }

    // Validate live stock before creating order
    for (const item of cart) {
      const liveProd = products.find((p) => p.id === item.product.id);
      if (!liveProd || liveProd.paused || liveProd.stock <= 0) {
        setFormError(
          `El producto "${item.product.name}" se acaba de agotar. Por favor revísalo en tu bolsa.`
        );
        return;
      }
      if (item.quantity > liveProd.stock) {
        updateCartQuantity(liveProd.id, liveProd.stock);
        setFormError(
          `Ajustamos "${liveProd.name}" a ${liveProd.stock} unidad(es), que es el máximo disponible en stock.`
        );
        return;
      }
    }

    const trimmedName = customerName.trim();
    if (trimmedName.length < 3 || !trimmedName.includes(' ')) {
      setFormError('Por favor ingresa tu nombre y apellido para el despacho.');
      return;
    }

    if (!isValidColombianPhone(customerPhone)) {
      setFormError(
        'Ingresa un número de celular/WhatsApp válido en Colombia (10 dígitos comenzando por 3, ej: 3154829104).'
      );
      return;
    }

    if (address.trim().length < 6) {
      setFormError(
        'Por favor escribe tu dirección exacta en Ocaña y un punto de referencia para el domiciliario.'
      );
      return;
    }

    if (!acceptedTerms) {
      setFormError(
        'Debes aceptar los Términos y Condiciones y la Política de Tratamiento de Datos para continuar.'
      );
      return;
    }

    const created = createOrder({
      customerName: trimmedName,
      customerPhone: cleanPhone(customerPhone),
      neighborhood,
      address,
      paymentMethod,
      notes,
    });

    setConfirmedOrder(created);
    setStep('confirmed');
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setNotes('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#2D2926]/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Bolsa de compras y checkout FORMA"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Full width on mobile (pl-0), side drawer on desktop (sm:pl-10), using 100dvh so mobile bars never cut it off */}
      <div className="fixed inset-y-0 right-0 w-full max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <div className="pointer-events-auto w-full sm:w-screen sm:max-w-md h-[100dvh] max-h-[100dvh] bg-[#FAF7F5] shadow-2xl sm:border-l border-[#F4C2C2] flex flex-col justify-between overflow-hidden">
          {/* Compact Drawer Header (shrink-0) */}
          <div className="shrink-0 px-4 py-3.5 sm:p-5 bg-white border-b border-[#F4C2C2]/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center text-[#B76E79] shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D2926] leading-tight truncate">
                  {step === 'cart' && 'Tu Bolsa FORMA'}
                  {step === 'checkout' && 'Datos de Entrega en Ocaña'}
                  {step === 'confirmed' && '¡Pedido Confirmado!'}
                </h2>
                <p className="text-[11px] text-[#2D2926]/60 truncate">
                  {step === 'cart' && 'Cosmética 100% original seleccionada por Eslen'}
                  {step === 'checkout' && 'Completa tus datos para coordinar el envío'}
                  {step === 'confirmed' && 'Ya notificamos al estudio de Eslen'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FDF2F4] hover:bg-[#F4C2C2] text-[#2D2926] flex items-center justify-center transition-colors shrink-0"
              aria-label="Cerrar bolsa de compras"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:p-5 space-y-3.5">
                {cart.length === 0 ? (
                  <div className="text-center py-14 px-4">
                    <div className="w-16 h-16 rounded-full bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center mx-auto mb-4 text-[#B76E79]">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                      Tu bolsa está vacía
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2D2926]/65 mt-1.5 max-w-xs mx-auto">
                      Explora los geles fijadores, pomadas, sueros y kits de maquillaje de{' '}
                      <strong>FORMA</strong>.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 px-6 py-3 rounded-xl bg-[#B76E79] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#9A5660] transition-all"
                    >
                      Explorar Catálogo
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => {
                    const liveProd =
                      products.find((p) => p.id === product.id) || product;
                    const atMaxStock = quantity >= liveProd.stock;

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#F4C2C2]/60 shadow-soft flex gap-3 items-center"
                      >
                        <img
                          src={liveProd.image}
                          alt={liveProd.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#FDF2F4] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79] truncate">
                            {liveProd.category}
                          </p>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#2D2926] line-clamp-1">
                            {liveProd.name}
                          </h4>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs font-semibold text-[#2D2926]/85">
                              {formatCOP(liveProd.price, false)} c/u
                            </p>
                            <p className="text-xs font-bold text-[#B76E79]">
                              {formatCOP(liveProd.price * quantity, false)}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="inline-flex items-center border border-[#F4C2C2] rounded-lg bg-[#FAF7F5]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(liveProd.id, quantity - 1)
                                }
                                aria-label="Disminuir cantidad"
                                className="w-7 h-7 flex items-center justify-center text-[#2D2926] hover:bg-[#FDF2F4] rounded-l-lg"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-[#2D2926]">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                disabled={atMaxStock}
                                onClick={(e) =>
                                  updateCartQuantity(
                                    liveProd.id,
                                    quantity + 1,
                                    e.currentTarget
                                  )
                                }
                                aria-label="Aumentar cantidad"
                                className={`w-7 h-7 flex items-center justify-center rounded-r-lg ${
                                  atMaxStock
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-[#2D2926] hover:bg-[#FDF2F4]'
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {atMaxStock && (
                              <span className="text-[10px] font-semibold text-[#B76E79] truncate">
                                Máx. ({liveProd.stock})
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => removeFromCart(liveProd.id)}
                              className="text-xs text-[#2D2926]/45 hover:text-red-500 p-1 transition-colors ml-auto"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="shrink-0 px-4 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 bg-white border-t border-[#F4C2C2]/60 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#2D2926]/70">
                      <span>Despacho en Ocaña (Casco Urbano)</span>
                      <span className="font-semibold text-[#6B9080]">
                        Coordinado al confirmar
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#FDF2F4]">
                      <span className="text-sm font-semibold text-[#2D2926]">
                        Subtotal a Pagar
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#B76E79]">
                        {formatCOP(cartTotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base"
                  >
                    <span>Continuar con el Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM (Mobile-Optimized, Never Cut Off) */}
          {step === 'checkout' && (
            <form
              onSubmit={handleConfirmOrder}
              className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden"
            >
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3.5 sm:p-5 space-y-3.5">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B76E79] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al resumen de mi bolsa
                </button>

                {/* Order Mini Summary */}
                <div className="bg-[#FDF2F4] border border-[#F4C2C2] rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#B76E79] font-bold">
                      Total de tu Orden FORMA
                    </p>
                    <p className="text-xs text-[#2D2926]/75">
                      {cart.reduce((a, b) => a + b.quantity, 0)} producto(s) seleccionados
                    </p>
                  </div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#2D2926] shrink-0">
                    {formatCOP(cartTotal)}
                  </span>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {formError}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Nombre y apellido completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Valentina Quintero"
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                {/* Colombian Phone 10 Digits */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Celular / WhatsApp (10 dígitos) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      autoComplete="tel"
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="Ej. 3154829104"
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                  <p className="text-[11px] text-[#2D2926]/55 mt-1">
                    Te escribiremos por WhatsApp para coordinar la entrega de tu pedido.
                  </p>
                </div>

                {/* Barrio in Ocaña */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Barrio en Ocaña *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    >
                      {OCANA_NEIGHBORHOODS.map((barrio) => (
                        <option key={barrio} value={barrio}>
                          {barrio}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Exact Address + Reference Point */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Dirección exacta y punto de referencia *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Calle 11 # 14-32 Edif. Mirador Apto 302 (Frente a droguería)"
                    className="w-full p-2.5 sm:p-3 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                {/* Payment Method (Responsive grid so text is never cut off on small screens) */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Método de Pago Preferido *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        'Efectivo Contra Entrega',
                        'Nequi',
                        'Daviplata',
                      ] as PaymentMethod[]
                    ).map((method) => {
                      const active = paymentMethod === method;
                      return (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all flex sm:flex-col items-center justify-center gap-2 sm:gap-1 ${
                            active
                              ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-sm'
                              : 'bg-white text-[#2D2926] border-[#F4C2C2] hover:bg-[#FDF2F4]'
                          }`}
                        >
                          <Wallet className="w-3.5 h-3.5 text-[#E8A598] shrink-0" />
                          <span className="leading-tight">{method}</span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod !== 'Efectivo Contra Entrega' && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] text-xs text-[#2D2926]">
                      <span className="font-bold text-[#B76E79]">
                        Cuenta oficial {paymentMethod} FORMA:{' '}
                      </span>
                      <span className="font-mono font-bold">
                        {paymentMethod === 'Nequi'
                          ? settings.nequiNumber
                          : settings.daviplataNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Notas adicionales (Opcional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Entregar después de las 5:00 PM"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#F4C2C2] text-base sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                {/* Legal Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#B76E79] text-[#B76E79] focus:ring-[#B76E79]"
                    />
                    <span className="text-[11px] text-[#2D2926]/75 leading-relaxed">
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModalTab('terms')}
                        className="font-semibold text-[#B76E79] underline"
                      >
                        Términos y Condiciones
                      </button>{' '}
                      y la{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModalTab('privacy')}
                        className="font-semibold text-[#B76E79] underline"
                      >
                        Política de Tratamiento de Datos
                      </button>{' '}
                      de FORMA para gestionar mi pedido en Ocaña.
                    </span>
                  </label>
                </div>
              </div>

              {/* Sticky Bottom Confirm Button (Always visible on mobile) */}
              <div className="shrink-0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 bg-white border-t border-[#F4C2C2]/60">
                <button
                  type="submit"
                  className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 sm:py-4 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Confirmar Pedido • {formatCOP(cartTotal)}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ELEGANT CONFIRMATION VIEW */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4">
              <div className="bg-[#6B9080]/15 border-2 border-[#6B9080] rounded-3xl p-5 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6B9080] text-white flex items-center justify-center mx-auto mb-2.5 shadow-md">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-white text-[#6B9080] text-xs font-bold tracking-wider uppercase">
                  Orden Registrada • #{confirmedOrder.id}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2926] mt-2">
                  ¡Gracias por tu compra, {confirmedOrder.customerName.split(' ')[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-[#2D2926]/75 mt-1.5 leading-relaxed">
                  Tu pedido ha quedado en estado{' '}
                  <strong className="text-[#6B9080]">Pendiente por Despachar</strong>.
                  Eslen ya recibió la notificación y te escribirá a tu WhatsApp{' '}
                  <strong>{confirmedOrder.customerPhone}</strong> para coordinar el envío.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2] space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-[#FDF2F4] pb-2">
                  <span className="text-[#2D2926]/60">Código de Orden:</span>
                  <span className="font-mono font-bold text-sm text-[#B76E79]">
                    #{confirmedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between items-start border-b border-[#FDF2F4] pb-2 gap-4">
                  <span className="text-[#2D2926]/60 shrink-0">Destino en Ocaña:</span>
                  <span className="font-semibold text-[#2D2926] text-right">
                    {confirmedOrder.neighborhood} — {confirmedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#FDF2F4] pb-2">
                  <span className="text-[#2D2926]/60">Método de Pago:</span>
                  <span className="font-semibold text-[#2D2926]">
                    {confirmedOrder.paymentMethod}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="font-bold text-[#2D2926] uppercase tracking-wider text-[10px]">
                    Productos en tu Pedido:
                  </p>
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[#2D2926]/80 gap-2">
                      <span className="truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold shrink-0">
                        {formatCOP(item.price * item.quantity, false)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F4C2C2] flex justify-between items-center text-sm font-bold text-[#2D2926]">
                  <span>Total a Pagar:</span>
                  <span className="font-serif text-xl text-[#B76E79]">
                    {formatCOP(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#2D2926]/65 bg-white/80 p-3 rounded-xl border border-[#F4C2C2]/50">
                <ShieldCheck className="w-4 h-4 text-[#6B9080] shrink-0" />
                <span>
                  El stock de tus productos ya fue reservado automáticamente en la tienda.
                </span>
              </div>

              {/* Optional Direct WhatsApp Button for Customer */}
              <a
                href={`https://wa.me/57${cleanPhone(
                  settings.whatsappNumber
                )}?text=${encodeURIComponent(
                  `¡Hola Eslen! Acabo de realizar el pedido #${confirmedOrder.id} en FORMA por valor de ${formatCOP(
                    confirmedOrder.total
                  )} a nombre de ${confirmedOrder.customerName} (${confirmedOrder.neighborhood}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#6B9080] hover:bg-[#58796b] text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar comprobante o mensaje por WhatsApp</span>
              </a>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl border border-[#F4C2C2] text-xs font-semibold text-[#2D2926] hover:bg-[#FDF2F4] transition-colors"
              >
                Seguir explorando FORMA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
