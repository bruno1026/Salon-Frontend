<template>
  <div
    class="fixed top-20 right-4 sm:right-6 z-[99999] flex flex-col gap-3 max-w-sm w-[calc(100vw-2rem)] sm:w-96 pointer-events-none"
    aria-live="polite"
  >
    <transition-group name="toast-item">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast-card group relative overflow-hidden pointer-events-auto rounded-2xl p-4 shadow-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]"
        :class="[
          'bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white',
          getBorderAccent(toast.type)
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Thumbnail de Producto (Si es tipo Cart o tiene Imagen) -->
          <div
            v-if="toast.productImage"
            class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <img
              :src="toast.productImage"
              :alt="toast.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Icono Temático (Si no hay Imagen o para otros tipos) -->
          <div
            v-else
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            :class="getIconContainerClass(toast.type)"
          >
            <ShoppingBag v-if="toast.type === 'cart'" class="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <CheckCircle v-else-if="toast.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <Info v-else class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <!-- Texto y Acciones -->
          <div class="flex-1 min-w-0 pr-4">
            <h4 class="text-sm font-bold leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{{ toast.title }}</span>
            </h4>

            <p
              v-if="toast.message"
              class="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug line-clamp-2"
            >
              {{ toast.message }}
            </p>

            <!-- Botón de Acción Opcional (ej. "Ver Carrito") -->
            <div v-if="toast.action" class="mt-2.5 flex items-center gap-2">
              <button
                @click="handleAction(toast)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#3A113D] dark:bg-[#c43ec7] text-white hover:bg-[#2b0c2d] dark:hover:bg-[#a62ba9] transition-all shadow-sm active:scale-95"
              >
                <span>{{ toast.action.label }}</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Botón de Cerrar (X) -->
          <button
            @click="toastStore.remove(toast.id)"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cerrar notificación"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Barra de Progreso de Auto-Descarte -->
        <div
          v-if="toast.duration > 0"
          class="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800/80 overflow-hidden"
        >
          <div
            class="h-full toast-progress-bar"
            :class="getProgressColor(toast.type)"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToastStore, ToastItem } from '../../stores/toastStore';
import {
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  ArrowRight,
} from 'lucide-vue-next';

const toastStore = useToastStore();

const handleAction = (toast: ToastItem) => {
  if (toast.action) {
    toast.action.onClick();
  }
  toastStore.remove(toast.id);
};

const getBorderAccent = (type: ToastItem['type']): string => {
  switch (type) {
    case 'cart':
      return 'border-l-4 border-l-[#c43ec7]';
    case 'success':
      return 'border-l-4 border-l-emerald-500';
    case 'warning':
      return 'border-l-4 border-l-amber-500';
    case 'error':
      return 'border-l-4 border-l-rose-500';
    default:
      return 'border-l-4 border-l-blue-500';
  }
};

const getIconContainerClass = (type: ToastItem['type']): string => {
  switch (type) {
    case 'cart':
      return 'bg-pink-100 dark:bg-pink-950/60';
    case 'success':
      return 'bg-emerald-100 dark:bg-emerald-950/60';
    case 'warning':
      return 'bg-amber-100 dark:bg-amber-950/60';
    case 'error':
      return 'bg-rose-100 dark:bg-rose-950/60';
    default:
      return 'bg-blue-100 dark:bg-blue-950/60';
  }
};

const getProgressColor = (type: ToastItem['type']): string => {
  switch (type) {
    case 'cart':
      return 'bg-gradient-to-r from-pink-500 to-[#c43ec7]';
    case 'success':
      return 'bg-emerald-500';
    case 'warning':
      return 'bg-amber-500';
    case 'error':
      return 'bg-rose-500';
    default:
      return 'bg-blue-500';
  }
};
</script>

<style scoped>
/* Animaciones de Entrada y Salida para Toasts */
.toast-item-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-item-leave-active {
  transition: all 0.25s ease-in;
}
.toast-item-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-item-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

/* Animación de la barra de progreso */
@keyframes toastProgress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.toast-progress-bar {
  animation-name: toastProgress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

/* Pausar barra de progreso al pasar el cursor */
.toast-card:hover .toast-progress-bar {
  animation-play-state: paused;
}
</style>
