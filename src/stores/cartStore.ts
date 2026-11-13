import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  saleActive?: boolean;
  saleEndDate?: string | Date;
  effectivePrice?: number;
  stockTotal: number;
  reservedStock: number;
  availableStock: number;
  category?: { _id: string; name: string } | string;
  imageUrl?: string;
  isOnSale?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  effectivePrice: number;
}

const STORAGE_KEY = 'appsalon_cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isDrawerOpen = ref(false);

  // Cargar estado inicial desde localStorage
  const loadCart = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        items.value = JSON.parse(saved);
      }
    } catch (e) {
      items.value = [];
    }
  };

  const saveCart = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
    } catch (e) {
      // Ignorar quota errors
    }
  };

  // Helper para calcular precio unitario vigente
  const computeEffectivePrice = (prod: CartProduct): number => {
    if (prod.effectivePrice !== undefined && prod.effectivePrice !== null) {
      return prod.effectivePrice;
    }
    const isOnSale = Boolean(
      prod.saleActive &&
      prod.salePrice &&
      prod.salePrice > 0 &&
      (!prod.saleEndDate || new Date(prod.saleEndDate) > new Date())
    );
    return isOnSale ? prod.salePrice! : prod.price;
  };

  // Getters
  const totalCount = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const totalAmount = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.effectivePrice * item.quantity), 0);
  });

  const isEmpty = computed(() => items.value.length === 0);

  // Acciones
  const addItem = (product: CartProduct, quantity: number = 1): { success: boolean; message: string } => {
    const qtyToAdd = Math.max(1, quantity);
    const available = product.availableStock ?? Math.max(0, (product.stockTotal || 0) - (product.reservedStock || 0));

    if (available <= 0) {
      return { success: false, message: `"${product.name}" se encuentra agotado temporalmente.` };
    }

    const existingIndex = items.value.findIndex((item) => item.product._id === product._id);
    const effectivePrice = computeEffectivePrice(product);

    if (existingIndex > -1) {
      const currentQty = items.value[existingIndex].quantity;
      const newQty = currentQty + qtyToAdd;

      if (newQty > available) {
        items.value[existingIndex].quantity = available;
        items.value[existingIndex].effectivePrice = effectivePrice;
        saveCart();
        return {
          success: true,
          message: `Se ajustó a ${available} unidades (máximo disponible en stock).`,
        };
      }

      items.value[existingIndex].quantity = newQty;
      items.value[existingIndex].effectivePrice = effectivePrice;
    } else {
      const initialQty = Math.min(qtyToAdd, available);
      items.value.push({
        product: { ...product },
        quantity: initialQty,
        effectivePrice,
      });
    }

    saveCart();
    return { success: true, message: `¡${product.name} agregado al carrito!` };
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const index = items.value.findIndex((item) => item.product._id === productId);
    if (index === -1) return;

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const available = items.value[index].product.availableStock ?? 999;
    const finalQty = Math.min(quantity, available);
    items.value[index].quantity = finalQty;
    saveCart();
  };

  const removeItem = (productId: string) => {
    items.value = items.value.filter((item) => item.product._id !== productId);
    saveCart();
  };

  const clearCart = () => {
    items.value = [];
    localStorage.removeItem(STORAGE_KEY);
  };

  const openDrawer = () => {
    isDrawerOpen.value = true;
  };

  const closeDrawer = () => {
    isDrawerOpen.value = false;
  };

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
  };

  // Inicializar al instanciar
  loadCart();

  return {
    items,
    isDrawerOpen,
    totalCount,
    totalAmount,
    isEmpty,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    loadCart,
  };
});
