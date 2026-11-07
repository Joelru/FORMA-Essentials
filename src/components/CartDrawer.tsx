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
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OCANA_NEIGHBORHOODS } from '../data/seedData';
import { PaymentMethod, Order } from '../types';
import { formatCOP, isValidColombianPhone, cleanPhone } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    createOrder,
    settings,
  } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState(OCANA_NEIGHBORHOODS[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo Contra Entrega');
  const [notes, setNotes] = useState('');
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

    if (customerName.trim().length < 3) {
      setFormError('Por favor ingresa tu nombre y apellido completo.');
      return;
    }

    if (!isValidColombianPhone(customerPhone)) {
      setFormError(
        'Ingresa un número de celular/WhatsApp válido en Colombia (10 dígitos comenzando por 3, ej: 3154829104).'
      );
      return;
    }

    if (address.trim().length < 5) {
      setFormError(
        'Por favor escribe tu dirección exacta en Ocaña y un punto de referencia para el domiciliario.'
      );
      return;
    }

    const created = createOrder({
      customerName,
      customerPhone: cleanPhone(customerPhone),
      neighborhood,
      address,
      paymentMethod,
      notes,
    });

    setConfirmedOrder(created);
    setStep('confirmed');
    // Reset fields for next time
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2D2926]/55 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F5] shadow-2xl border-l border-[#F4C2C2] flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 bg-white border-b border-[#F4C2C2]/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center text-[#B76E79]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2D2926]">
                  {step === 'cart' && 'Tu Bolsa FORMA'}
                  {step === 'checkout' && 'Datos de Entrega en Ocaña'}
                  {step === 'confirmed' && '¡Pedido Confirmado!'}
                </h2>
                <p className="text-[11px] text-[#2D2926]/60">
                  {step === 'cart' && 'Productos 100% originales seleccionados por Eslen'}
                  {step === 'checkout' && 'Completa tus datos para coordinar el despacho'}
                  {step === 'confirmed' && 'Ya notificamos al estudio de Eslen'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#FDF2F4] hover:bg-[#F4C2C2] text-[#2D2926] flex items-center justify-center transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-[#FDF2F4] border border-[#F4C2C2] flex items-center justify-center mx-auto mb-4 text-[#B76E79]">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#2D2926]">
                      Tu bolsa está vacía
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2D2926]/65 mt-1.5 max-w-xs mx-auto">
                      Explora los geles fijadores, pomadas, kits y esenciales de maquillaje de{' '}
                      <strong>FORMA Essentials</strong>.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 px-6 py-3 rounded-xl bg-[#B76E79] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#9A5660] transition-all"
                    >
                      Explorar Catálogo
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-3.5 border border-[#F4C2C2]/60 shadow-soft flex gap-3.5 items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-[#FDF2F4] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
                          {product.category}
                        </p>
                        <h4 className="font-serif text-base font-bold text-[#2D2926] truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#2D2926]/80 mt-0.5">
                          {formatCOP(product.price)}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#F4C2C2] rounded-lg bg-[#FAF7F5]">
                            <button
                              onClick={() =>
                                updateCartQuantity(product.id, quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#2D2926] hover:bg-[#FDF2F4] rounded-l-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#2D2926]">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(product.id, quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#2D2926] hover:bg-[#FDF2F4] rounded-r-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-xs text-[#2D2926]/45 hover:text-red-500 p-1 transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 bg-white border-t border-[#F4C2C2]/60 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#2D2926]/70">
                      <span>Despacho en Ocaña (Casco Urbano)</span>
                      <span className="font-semibold text-[#6B9080]">
                        Coordinado al confirmar
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#FDF2F4]">
                      <span className="text-sm font-semibold text-[#2D2926]">
                        Subtotal a Pagar
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#B76E79]">
                        {formatCOP(cartTotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Continuar con el Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form
              onSubmit={handleConfirmOrder}
              className="flex-1 flex flex-col justify-between overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B76E79] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al resumen de mi bolsa
                </button>

                {/* Order Mini Summary */}
                <div className="bg-[#FDF2F4] border border-[#F4C2C2] rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#B76E79] font-bold">
                      Total de tu Orden FORMA
                    </p>
                    <p className="text-xs text-[#2D2926]/75">
                      {cart.reduce((a, b) => a + b.quantity, 0)} producto(s) seleccionados
                    </p>
                  </div>
                  <span className="font-serif text-xl font-bold text-[#2D2926]">
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
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Nombre completo de la clienta *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Valentina Quintero"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                {/* Colombian Phone 10 Digits */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Número de Celular / WhatsApp (10 dígitos) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="Ej. 3154829104"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                  <p className="text-[11px] text-[#2D2926]/55 mt-1">
                    Te escribiremos por WhatsApp desde el estudio para despachar tu pedido.
                  </p>
                </div>

                {/* Barrio in Ocaña */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Barrio en Ocaña *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
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
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Dirección exacta y punto de referencia en Ocaña *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Calle 11 # 14-32 Edificio Mirador Apto 302 (Frente a la droguería)"
                    className="w-full p-3 rounded-xl bg-white border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Método de Pago Preferido *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            active
                              ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-sm'
                              : 'bg-white text-[#2D2926] border-[#F4C2C2] hover:bg-[#FDF2F4]'
                          }`}
                        >
                          <Wallet className="w-3.5 h-3.5 text-[#E8A598]" />
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
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Notas adicionales (Opcional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Entregar después de las 5:00 PM"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#F4C2C2] text-sm text-[#2D2926] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white border-t border-[#F4C2C2]/60">
                <button
                  type="submit"
                  className="w-full bg-[#B76E79] hover:bg-[#9A5660] text-white font-semibold py-4 px-6 rounded-2xl shadow-luxury flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirmar Pedido • {formatCOP(cartTotal)}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ELEGANT CONFIRMATION VIEW */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="bg-[#6B9080]/15 border-2 border-[#6B9080] rounded-3xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#6B9080] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
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
                  Eslen ya recibió la alerta en el estudio y te contactará a tu WhatsApp{' '}
                  <strong>{confirmedOrder.customerPhone}</strong> para coordinar el envío.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-white rounded-2xl p-4 border border-[#F4C2C2] space-y-3 text-xs">
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
                    <div key={idx} className="flex justify-between text-[#2D2926]/80">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold">
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

              {/* Optional Direct WhatsApp Button for Customer */}
              <a
                href={`https://wa.me/57${cleanPhone(
                  settings.whatsappNumber
                )}?text=${encodeURIComponent(
                  `¡Hola Eslen! Acabo de realizar el pedido #${confirmedOrder.id} en FORMA Essentials por valor de ${formatCOP(
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
                Seguir explorando FORMA Essentials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
