import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  message?: string;
  productImage?: string;
  duration?: number; // en milisegundos, por defecto 4000
  action?: ToastAction;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'cart' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  productImage?: string;
  duration: number;
  action?: ToastAction;
  createdAt: number;
  timerId?: any;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([]);

  const remove = (id: string) => {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      if (toasts.value[idx].timerId) {
        clearTimeout(toasts.value[idx].timerId);
      }
      toasts.value.splice(idx, 1);
    }
  };

  const add = (
    type: ToastItem['type'],
    title: string,
    options?: ToastOptions
  ): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const duration = options?.duration ?? (type === 'cart' ? 4500 : 3500);

    const timerId = duration > 0 ? setTimeout(() => remove(id), duration) : undefined;

    const item: ToastItem = {
      id,
      type,
      title,
      message: options?.message,
      productImage: options?.productImage,
      duration,
      action: options?.action,
      createdAt: Date.now(),
      timerId,
    };

    // Mantener máximo 4 toasts visibles a la vez
    if (toasts.value.length >= 4) {
      const oldest = toasts.value.shift();
      if (oldest?.timerId) clearTimeout(oldest.timerId);
    }

    toasts.value.push(item);
    return id;
  };

  const success = (title: string, options?: ToastOptions) => add('success', title, options);
  const cart = (title: string, options?: ToastOptions) => add('cart', title, options);
  const error = (title: string, options?: ToastOptions) => add('error', title, options);
  const warning = (title: string, options?: ToastOptions) => add('warning', title, options);
  const info = (title: string, options?: ToastOptions) => add('info', title, options);

  const clear = () => {
    toasts.value.forEach((t) => {
      if (t.timerId) clearTimeout(t.timerId);
    });
    toasts.value = [];
  };

  return {
    toasts,
    add,
    remove,
    success,
    cart,
    error,
    warning,
    info,
    clear,
  };
});
