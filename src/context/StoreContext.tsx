import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Appointment,
  AppointmentStatus,
  StoreSettings,
  PaymentMethod,
  AppointmentTimeSlot
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_APPOINTMENTS,
  INITIAL_SETTINGS
} from '../data/seedData';
import { getFirebaseDb, doc, setDoc, onSnapshot, getDoc } from '../lib/firebase';
import { playNotificationChime } from '../utils/format';

const STORAGE_KEYS = {
  PRODUCTS: 'forma_store_products_v3',
  ORDERS: 'forma_store_orders_v3',
  APPOINTMENTS: 'forma_store_appointments_v3',
  SETTINGS: 'forma_store_settings_v3',
  VISITS: 'forma_store_visits_v3',
  CART: 'forma_store_cart_v3',
  SESSION_VISITED: 'forma_store_session_visited_v3',
};

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  neighborhood: string;
  address: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface CreateAppointmentInput {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  preferredDate: string;
  preferredTimeSlot: AppointmentTimeSlot;
  notes?: string;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  appointments: Appointment[];
  settings: StoreSettings;
  visitsCount: number;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductModal: Product | null;
  setSelectedProductModal: (product: Product | null) => void;
  firebaseStatus: { isConnected: boolean; projectId?: string; syncing: boolean };
  latestAlert: { type: 'order' | 'appointment'; title: string; subtitle: string } | null;
  dismissAlert: () => void;

  // Product & Click Tracking
  trackProductClick: (productId: string) => void;
  openProductDetail: (product: Product) => void;

  // Cart Actions
  addToCart: (product: Product, quantity?: number, shouldTrackClick?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Checkout & Orders
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markAllOrdersReviewed: () => void;

  // Appointments
  createAppointment: (input: CreateAppointmentInput) => Appointment;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;

  // Admin Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'clicks_count' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleProductPaused: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Admin Settings
  updateSettings: (newSettings: StoreSettings) => void;
  syncAllToFirebase: () => Promise<boolean>;
  resetAllMetricsToZero: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    loadFromStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );
  const [visitsCount, setVisitsCount] = useState<number>(() =>
    loadFromStorage<number>(STORAGE_KEYS.VISITS, 0)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, [])
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [latestAlert, setLatestAlert] = useState<{
    type: 'order' | 'appointment';
    title: string;
    subtitle: string;
  } | null>(null);

  const [firebaseStatus, setFirebaseStatus] = useState<{
    isConnected: boolean;
    projectId?: string;
    syncing: boolean;
  }>(() => {
    const { isConnected, projectId } = getFirebaseDb();
    return { isConnected, projectId, syncing: false };
  });

  const isRemoteUpdate = useRef(false);
  const prevOrdersCount = useRef(orders.length);

  // Push state helper to Firestore
  const pushToFirestore = useCallback(
    async (payload: {
      products?: Product[];
      orders?: Order[];
      appointments?: Appointment[];
      settings?: StoreSettings;
      visitsCount?: number;
    }) => {
      const { db, isConnected } = getFirebaseDb();
      if (!isConnected || !db) return;
      try {
        const storeDocRef = doc(db, 'forma_essentials', 'live_store_data');
        await setDoc(
          storeDocRef,
          {
            ...payload,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Error sincronizando con Firestore:', err);
      }
    },
    []
  );

  // Session Visit Counter (once per browser session)
  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem(STORAGE_KEYS.SESSION_VISITED);
    if (!alreadyVisited) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_VISITED, 'true');
      setVisitsCount((prev) => {
        const next = prev + 1;
        localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(next));
        pushToFirestore({ visitsCount: next });
        return next;
      });
    }
  }, [pushToFirestore]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Listen to Cross-Tab localStorage changes (real-time sync between Customer & Admin tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.PRODUCTS) {
          setProducts(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.ORDERS) {
          const newOrders = JSON.parse(e.newValue) as Order[];
          if (newOrders.length > prevOrdersCount.current) {
            const newest = newOrders[0];
            playNotificationChime();
            setLatestAlert({
              type: 'order',
              title: `¡Nueva Orden #${newest.id}!`,
              subtitle: `${newest.customerName} (${newest.neighborhood})`,
            });
          }
          prevOrdersCount.current = newOrders.length;
          setOrders(newOrders);
        } else if (e.key === STORAGE_KEYS.APPOINTMENTS) {
          const newApps = JSON.parse(e.newValue) as Appointment[];
          setAppointments(newApps);
        } else if (e.key === STORAGE_KEYS.SETTINGS) {
          setSettings(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.VISITS) {
          setVisitsCount(JSON.parse(e.newValue));
        }
      } catch {
        // Ignore parse error
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Connect to Firebase Firestore Real-time Listener if configured
  useEffect(() => {
    const { db, isConnected, projectId } = getFirebaseDb();
    setFirebaseStatus({ isConnected, projectId, syncing: false });

    if (!isConnected || !db) return;

    const storeDocRef = doc(db, 'forma_essentials', 'live_store_data');

    // Initial check: if Firestore doc doesn't exist yet, seed it with current local state
    getDoc(storeDocRef)
      .then((snap) => {
        if (!snap.exists()) {
          setDoc(storeDocRef, {
            products,
            orders,
            appointments,
            settings,
            visitsCount,
            updatedAt: new Date().toISOString(),
          });
        }
      })
      .catch(() => {});

    const unsubscribe = onSnapshot(
      storeDocRef,
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        isRemoteUpdate.current = true;

        if (Array.isArray(data.products)) {
          setProducts(data.products);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
        }
        if (Array.isArray(data.orders)) {
          if (data.orders.length > prevOrdersCount.current) {
            const newest = data.orders[0];
            playNotificationChime();
            setLatestAlert({
              type: 'order',
              title: `¡Nueva Orden #${newest.id}!`,
              subtitle: `${newest.customerName} (${newest.neighborhood})`,
            });
          }
          prevOrdersCount.current = data.orders.length;
          setOrders(data.orders);
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
        }
        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
          localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
        }
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        if (typeof data.visitsCount === 'number') {
          setVisitsCount(data.visitsCount);
          localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(data.visitsCount));
        }

        setTimeout(() => {
          isRemoteUpdate.current = false;
        }, 100);
      },
      (err) => {
        console.warn('Firestore listener error:', err);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncAllToFirebase = useCallback(async (): Promise<boolean> => {
    const { db, isConnected, projectId } = getFirebaseDb();
    setFirebaseStatus({ isConnected, projectId, syncing: true });
    if (!isConnected || !db) {
      setFirebaseStatus({ isConnected: false, syncing: false });
      return false;
    }
    try {
      const storeDocRef = doc(db, 'forma_essentials', 'live_store_data');
      await setDoc(
        storeDocRef,
        {
          products,
          orders,
          appointments,
          settings,
          visitsCount,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setFirebaseStatus({ isConnected: true, projectId, syncing: false });
      return true;
    } catch {
      setFirebaseStatus({ isConnected: true, projectId, syncing: false });
      return false;
    }
  }, [products, orders, appointments, settings, visitsCount]);

  // 1. Silent Click Tracking on Product ("Ver Detalles" or "Agregar al Carrito")
  const trackProductClick = useCallback(
    (productId: string) => {
      setProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === productId ? { ...p, clicks_count: (p.clicks_count || 0) + 1 } : p
        );
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        pushToFirestore({ products: updated });
        return updated;
      });
    },
    [pushToFirestore]
  );

  const openProductDetail = useCallback(
    (product: Product) => {
      trackProductClick(product.id);
      // Reflect updated click count in modal
      setSelectedProductModal({
        ...product,
        clicks_count: (product.clicks_count || 0) + 1,
      });
    },
    [trackProductClick]
  );

  // 2. Cart Management
  const addToCart = useCallback(
    (product: Product, quantity = 1, shouldTrackClick = true) => {
      if (shouldTrackClick) {
        trackProductClick(product.id);
      }
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const currentQty = prev[existingIndex].quantity;
          const newQty = Math.min(product.stock, currentQty + quantity);
          return prev.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: newQty } : item
          );
        }
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      });
    },
    [trackProductClick]
  );

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 3. Create Order & Deduct Stock & Trigger Admin Notification
  const createOrder = useCallback(
    (input: CreateOrderInput): Order => {
      const randomNum = Math.floor(1025 + Math.random() * 8970);
      const orderId = `ORD-${randomNum}`;

      const newOrder: Order = {
        id: orderId,
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.replace(/\D/g, ''),
        neighborhood: input.neighborhood.trim(),
        address: input.address.trim(),
        paymentMethod: input.paymentMethod,
        notes: input.notes?.trim() || '',
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        total: cartTotal,
        status: 'Pendiente por Despachar',
        createdAt: new Date().toISOString(),
        isNew: true,
      };

      // Update orders
      const updatedOrders = [newOrder, ...orders];
      prevOrdersCount.current = updatedOrders.length;
      setOrders(updatedOrders);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

      // Deduct stock from products
      const updatedProducts = products.map((prod) => {
        const boughtItem = cart.find((c) => c.product.id === prod.id);
        if (!boughtItem) return prod;
        const nextStock = Math.max(0, prod.stock - boughtItem.quantity);
        return {
          ...prod,
          stock: nextStock,
          paused: nextStock === 0 ? true : prod.paused,
        };
      });
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));

      // Sync with Firestore
      pushToFirestore({ orders: updatedOrders, products: updatedProducts });

      // Trigger notification sound & alert banner
      playNotificationChime();
      setLatestAlert({
        type: 'order',
        title: `¡Nueva Orden #${newOrder.id} Recibida!`,
        subtitle: `${newOrder.customerName} • ${newOrder.neighborhood}`,
      });

      clearCart();
      return newOrder;
    },
    [cart, cartTotal, orders, products, pushToFirestore, clearCart]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.id === orderId ? { ...o, status, isNew: false } : o
        );
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
        pushToFirestore({ orders: updated });
        return updated;
      });
    },
    [pushToFirestore]
  );

  const markAllOrdersReviewed = useCallback(() => {
    setOrders((prev) => {
      const updated = prev.map((o) => ({ ...o, isNew: false }));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      pushToFirestore({ orders: updated });
      return updated;
    });
  }, [pushToFirestore]);

  // 4. Appointments Management
  const createAppointment = useCallback(
    (input: CreateAppointmentInput): Appointment => {
      const randomNum = Math.floor(205 + Math.random() * 790);
      const newAppointment: Appointment = {
        id: `CITA-${randomNum}`,
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.replace(/\D/g, ''),
        serviceId: input.serviceId,
        serviceName: input.serviceName,
        servicePrice: input.servicePrice,
        serviceDuration: input.serviceDuration,
        preferredDate: input.preferredDate,
        preferredTimeSlot: input.preferredTimeSlot,
        notes: input.notes?.trim() || '',
        status: 'Pendiente',
        createdAt: new Date().toISOString(),
        isNew: true,
      };

      const updated = [newAppointment, ...appointments];
      setAppointments(updated);
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
      pushToFirestore({ appointments: updated });

      playNotificationChime();
      setLatestAlert({
        type: 'appointment',
        title: `¡Nueva Cita Solicitada #${newAppointment.id}!`,
        subtitle: `${newAppointment.customerName} • ${newAppointment.serviceName}`,
      });

      return newAppointment;
    },
    [appointments, pushToFirestore]
  );

  const updateAppointmentStatus = useCallback(
    (appointmentId: string, status: AppointmentStatus) => {
      setAppointments((prev) => {
        const updated = prev.map((a) =>
          a.id === appointmentId ? { ...a, status, isNew: false } : a
        );
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
        pushToFirestore({ appointments: updated });
        return updated;
      });
    },
    [pushToFirestore]
  );

  // 5. Admin CRUD for Products
  const addProduct = useCallback(
    (productData: Omit<Product, 'id' | 'clicks_count' | 'createdAt'>) => {
      const newProd: Product = {
        ...productData,
        id: `prod-forma-${Date.now()}`,
        clicks_count: 0,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => {
        const updated = [newProd, ...prev];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        pushToFirestore({ products: updated });
        return updated;
      });
    },
    [pushToFirestore]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        pushToFirestore({ products: updated });
        return updated;
      });
    },
    [pushToFirestore]
  );

  const toggleProductPaused = useCallback(
    (id: string) => {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        pushToFirestore({ products: updated });
        return updated;
      });
    },
    [pushToFirestore]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        pushToFirestore({ products: updated });
        return updated;
      });
      setCart((prev) => prev.filter((item) => item.product.id !== id));
    },
    [pushToFirestore]
  );

  // 6. Store Settings
  const updateSettings = useCallback(
    (newSettings: StoreSettings) => {
      setSettings(newSettings);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      pushToFirestore({ settings: newSettings });
    },
    [pushToFirestore]
  );

  // 7. Reset All Metrics, Clicks, Visits, Orders & Appointments to 0
  const resetAllMetricsToZero = useCallback(async () => {
    const zeroedProducts = products.map((p) => ({ ...p, clicks_count: 0 }));
    setProducts(zeroedProducts);
    setOrders([]);
    setAppointments([]);
    setVisitsCount(0);
    prevOrdersCount.current = 0;

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(zeroedProducts));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(0));

    await pushToFirestore({
      products: zeroedProducts,
      orders: [],
      appointments: [],
      visitsCount: 0,
    });
  }, [products, pushToFirestore]);

  const dismissAlert = useCallback(() => {
    setLatestAlert(null);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        appointments,
        settings,
        visitsCount,
        cart,
        isCartOpen,
        setIsCartOpen,
        selectedProductModal,
        setSelectedProductModal,
        firebaseStatus,
        latestAlert,
        dismissAlert,
        trackProductClick,
        openProductDetail,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        createOrder,
        updateOrderStatus,
        markAllOrdersReviewed,
        createAppointment,
        updateAppointmentStatus,
        addProduct,
        updateProduct,
        toggleProductPaused,
        deleteProduct,
        updateSettings,
        syncAllToFirebase,
        resetAllMetricsToZero,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore debe usarse dentro de un StoreProvider');
  }
  return ctx;
}
