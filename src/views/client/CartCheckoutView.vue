<template>
  <div class="checkout-page-wrapper max-w-4xl mx-auto py-6 px-4" style="font-family: 'Outfit', sans-serif;">
    <!-- PANTALLA 1: PEDIDO COMPLETADO CON TICKETS DUALES -->
    <div v-if="orderCompleted && completedOrder" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-10">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle class="w-10 h-10" />
        </div>
        <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          ¡Orden Generada con Éxito!
        </span>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          Ticket de Compra #{{ completedOrder.ticketNumber }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {{ completedMessage || 'Tu orden ha sido registrada correctamente en el sistema.' }}
        </p>
      </div>

      <!-- Selector de Pestañas de Ticket (Dual Tickets) -->
      <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          @click="activeTicketTab = 'client'"
          :class="[
            activeTicketTab === 'client'
              ? 'border-[#3A113D] dark:border-[#c43ec7] text-[#3A113D] dark:text-[#f472b6] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
          ]"
          class="flex-1 py-3 px-4 text-center border-b-2 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <FileText class="w-4 h-4" /> Ticket Cliente (Comprobante)
        </button>
        <button
          @click="activeTicketTab = 'staff'"
          :class="[
            activeTicketTab === 'staff'
              ? 'border-[#3A113D] dark:border-[#c43ec7] text-[#3A113D] dark:text-[#f472b6] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
          ]"
          class="flex-1 py-3 px-4 text-center border-b-2 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Store class="w-4 h-4" /> Ticket Recepción / Mostrador
        </button>
      </div>

      <!-- Visualización Monospace del Ticket Seleccionado -->
      <div class="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-xs sm:text-sm whitespace-pre-wrap overflow-x-auto border border-slate-800 shadow-inner mb-6 leading-relaxed">
        {{ activeTicketTab === 'client' ? generatedTickets.clientTicket : generatedTickets.staffTicket }}
      </div>

      <!-- Acciones del Ticket -->
      <div class="flex flex-col sm:flex-row gap-3 justify-end items-center pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          @click="printTicket"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-sm transition-colors"
        >
          <Printer class="w-4 h-4" /> Imprimir Comprobante
        </button>

        <router-link
          to="/client/shop"
          @click="resetCheckout"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#3A113D] dark:bg-[#c43ec7] text-white font-bold text-sm hover:bg-[#2b0c2d] dark:hover:bg-[#a62ba9] shadow transition-colors"
        >
          Volver a la Tienda
        </router-link>
      </div>
    </div>

    <!-- PANTALLA 2: CARRITO VACÍO -->
    <div v-else-if="cartStore.isEmpty" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 text-center my-8">
      <div class="w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400 mx-auto mb-4">
        <ShoppingCart class="w-10 h-10" />
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2" style="font-family: 'Cormorant Garamond', Georgia, serif;">
        Tu carrito está vacío
      </h2>
      <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
        No tienes productos agregados actualmente. Explora nuestro catálogo y llévate los mejores tratamientos profesionales.
      </p>
      <router-link
        to="/client/shop"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3A113D] dark:bg-[#c43ec7] text-white font-bold text-sm shadow hover:bg-[#2b0c2d] dark:hover:bg-[#a62ba9] transition-all"
      >
        <ShoppingBag class="w-4 h-4" /> Explorar Tienda de Productos
      </router-link>
    </div>

    <!-- PANTALLA 3: CHECKOUT ACTIVO (PRODUCTOS + FORMULARIO INVITADO/USUARIO + PAGO) -->
    <div v-else class="space-y-6">
      <!-- Encabezado de Checkout -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2" style="font-family: 'Cormorant Garamond', Georgia, serif;">
            <ShoppingCart class="w-7 h-7 text-[#c43ec7]" /> Resumen de Carrito & Checkout
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Finaliza tu compra sin registro previo o vincula tus datos si ya eres cliente.
          </p>
        </div>

        <router-link
          to="/client/shop"
          class="text-xs font-bold text-[#c43ec7] hover:underline flex items-center gap-1"
        >
          <ArrowLeft class="w-4 h-4" /> Seguir Comprando
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Columna Izquierda: Formulario de Datos y Método de Pago (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- 1. Aviso de Tipo de Comprador (Invitado vs Registrado) -->
          <div v-if="!authStore.isAuthenticated" class="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 flex items-start gap-3">
            <Sparkles class="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div class="text-xs leading-relaxed">
              <strong class="text-purple-900 dark:text-purple-200 block font-bold mb-0.5">
                Comprando en Modo Invitado (Sin Registro)
              </strong>
              <span class="text-purple-700 dark:text-purple-300">
                Solo necesitamos tu nombre y WhatsApp para entregarte tu ticket. Si ya tienes cuenta de cliente, puedes
                <router-link to="/login" class="underline font-bold hover:text-purple-900 dark:hover:text-white">Iniciar Sesión aquí</router-link>
                para vincular tu historial.
              </span>
            </div>
          </div>

          <div v-else class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-3">
            <CheckCircle class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div class="text-xs">
              <span class="text-emerald-900 dark:text-emerald-200 font-bold">Sesión Iniciada:</span>
              <span class="text-emerald-700 dark:text-emerald-300 ml-1">{{ authStore.user?.name }} ({{ authStore.user?.email }})</span>
            </div>
          </div>

          <!-- 2. Formulario de Datos de Contacto -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 class="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <User class="w-4 h-4 text-[#c43ec7]" /> Información del Comprador
            </h3>

            <div class="space-y-4 text-sm">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">
                  Nombre Completo <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="customerForm.name"
                  type="text"
                  placeholder="Ej. Leslie Corona"
                  required
                  class="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#c43ec7] text-sm"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">
                    Teléfono / WhatsApp <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.phone"
                    type="tel"
                    placeholder="Ej. 3312345678"
                    required
                    class="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#c43ec7] text-sm"
                  />
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">
                    Correo Electrónico <span class="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    v-model="customerForm.email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    class="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#c43ec7] text-sm"
                  />
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">
                  Notas o Instrucciones Especiales <span class="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <textarea
                  v-model="customerForm.notes"
                  rows="2"
                  placeholder="Ej. Pasar a recoger el sábado por la tarde, empaque para regalo..."
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#c43ec7] text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 3. Selección de Método de Pago -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 class="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <CreditCard class="w-4 h-4 text-[#c43ec7]" /> Método de Pago
            </h3>

            <div class="space-y-3">
              <!-- PayPal -->
              <label
                :class="[
                  selectedPaymentMethod === 'paypal'
                    ? 'border-[#3A113D] dark:border-[#c43ec7] bg-purple-50/40 dark:bg-purple-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                ]"
                class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  v-model="selectedPaymentMethod"
                  class="mt-1 text-[#3A113D] focus:ring-[#c43ec7]"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-sm font-bold text-slate-900 dark:text-white">💳 PayPal (Pago en Línea Automático)</strong>
                    <span class="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">Inmediato</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pago seguro procesado al instante. Tu inventario queda descontado y tu ticket validado.
                  </p>
                </div>
              </label>

              <!-- Terminal en Tienda -->
              <label
                :class="[
                  selectedPaymentMethod === 'terminal_store'
                    ? 'border-[#3A113D] dark:border-[#c43ec7] bg-purple-50/40 dark:bg-purple-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                ]"
                class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="terminal_store"
                  v-model="selectedPaymentMethod"
                  class="mt-1 text-[#3A113D] focus:ring-[#c43ec7]"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-sm font-bold text-slate-900 dark:text-white">📱 Terminal en Salón (Tarjeta al Recoger)</strong>
                    <span class="text-[11px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">En Mostrador</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Paga con tarjeta de débito o crédito directamente en recepción al recoger tus productos.
                  </p>
                </div>
              </label>

              <!-- Efectivo en Tienda -->
              <label
                :class="[
                  selectedPaymentMethod === 'cash_store'
                    ? 'border-[#3A113D] dark:border-[#c43ec7] bg-purple-50/40 dark:bg-purple-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                ]"
                class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_store"
                  v-model="selectedPaymentMethod"
                  class="mt-1 text-[#3A113D] focus:ring-[#c43ec7]"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-sm font-bold text-slate-900 dark:text-white">💵 Efectivo en Salón</strong>
                    <span class="text-[11px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">En Mostrador</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Liquida en efectivo en recepción mostrando tu número de ticket.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Desglose de Productos y Botón de Pago (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-24">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-4">
              <h3 class="font-bold text-slate-900 dark:text-white text-base">
                Artículos en Pedido ({{ cartStore.totalCount }})
              </h3>
              <button
                @click="handleClearCart"
                class="text-xs font-semibold text-rose-500 hover:text-rose-600"
              >
                Vaciar
              </button>
            </div>

            <!-- Lista de Productos en Checkout -->
            <div class="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
              <div
                v-for="item in cartStore.items"
                :key="item.product._id"
                class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
              >
                <!-- Thumbnail -->
                <div class="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    v-if="item.product.imageUrl"
                    :src="item.product.imageUrl"
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                  <ShoppingBag v-else class="w-5 h-5 text-slate-400" />
                </div>

                <!-- Detalle -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {{ item.product.name }}
                  </h4>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    ${{ item.effectivePrice }} MXN c/u
                  </div>
                </div>

                <!-- Stepper & Subtotal -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
                    <button
                      @click="cartStore.updateQuantity(item.product._id, item.quantity - 1)"
                      class="px-1.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-bold"
                    >
                      -
                    </button>
                    <span class="px-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {{ item.quantity }}
                    </span>
                    <button
                      @click="cartStore.updateQuantity(item.product._id, item.quantity + 1)"
                      class="px-1.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span class="font-bold text-xs text-slate-900 dark:text-white min-w-[55px] text-right">
                    ${{ item.effectivePrice * item.quantity }}
                  </span>

                  <button
                    @click="handleRemoveItem(item.product._id, item.product.name)"
                    class="text-slate-400 hover:text-rose-500 p-1"
                    title="Eliminar"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Resumen Financiero -->
            <div class="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div class="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal Neto:</span>
                <span class="font-bold text-slate-700 dark:text-slate-300">${{ cartStore.totalAmount }} MXN</span>
              </div>
              <div class="flex justify-between text-slate-500 dark:text-slate-400">
                <span>IVA e Impuestos:</span>
                <span class="text-emerald-600 font-bold">Incluidos</span>
              </div>
              <div class="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total a Pagar:</span>
                <span class="text-emerald-600 dark:text-emerald-400 text-xl font-black">${{ cartStore.totalAmount }} MXN</span>
              </div>
            </div>

            <!-- Botón Finalizar Checkout -->
            <button
              @click="submitCheckout"
              :disabled="loadingCheckout"
              class="w-full mt-6 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-[#3A113D] dark:bg-[#c43ec7] text-white hover:bg-[#2b0c2d] dark:hover:bg-[#a62ba9] transition-all shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle v-if="!loadingCheckout" class="w-4 h-4" />
              <span v-if="loadingCheckout">Procesando Orden...</span>
              <span v-else>Confirmar Pedido & Ticket</span>
            </button>

            <p class="text-center text-[10px] text-slate-400 mt-3">
              Al confirmar, tu ticket dual se generará automáticamente con reserva de inventario.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import {
  ShoppingCart,
  ShoppingBag,
  Trash2,
  CheckCircle,
  Sparkles,
  User,
  CreditCard,
  Printer,
  FileText,
  Store,
  ArrowLeft,
} from 'lucide-vue-next';
import { useToastStore } from '../../stores/toastStore';

const authStore = useAuthStore();
const cartStore = useCartStore();
const toastStore = useToastStore();

const selectedPaymentMethod = ref<'paypal' | 'terminal_store' | 'cash_store'>('paypal');
const loadingCheckout = ref(false);

// Formulario de comprador
const customerForm = reactive({
  name: '',
  phone: '',
  email: '',
  notes: '',
});

// Estado de orden completada
const orderCompleted = ref(false);
const completedOrder = ref<any>(null);
const completedMessage = ref('');
const activeTicketTab = ref<'client' | 'staff'>('client');
const generatedTickets = ref<{ clientTicket: string; staffTicket: string }>({
  clientTicket: '',
  staffTicket: '',
});

const apiUrl = import.meta.env.VITE_API_URL || '/api';

onMounted(() => {
  // Pre-llenar datos si el usuario está autenticado
  if (authStore.isAuthenticated && authStore.user) {
    customerForm.name = authStore.user.name || '';
    customerForm.email = authStore.user.email || '';
    customerForm.phone = authStore.user.phone || '';
  }
});

const handleRemoveItem = (productId: string, productName: string) => {
  cartStore.removeItem(productId);
  toastStore.info('Producto removido', {
    message: `Se quitó "${productName}" del pedido.`,
  });
};

const handleClearCart = () => {
  cartStore.clearCart();
  toastStore.info('Carrito vaciado', {
    message: 'Se han eliminado todos los productos del pedido.',
  });
};

const submitCheckout = async () => {
  // Validaciones con Toast moderna
  if (!customerForm.name.trim()) {
    toastStore.warning('Nombre Requerido', {
      message: 'Por favor ingresa tu nombre completo para emitir el ticket.',
    });
    return;
  }

  if (!customerForm.phone.trim()) {
    toastStore.warning('Teléfono Requerido', {
      message: 'Por favor ingresa un número de teléfono o WhatsApp de contacto.',
    });
    return;
  }

  if (cartStore.isEmpty) {
    toastStore.warning('Carrito Vacío', {
      message: 'No tienes productos en el carrito para ordenar.',
    });
    return;
  }

  loadingCheckout.value = true;
  try {
    // Preparar items directos del carrito local
    const directItems = cartStore.items.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    const payload = {
      paymentMethod: selectedPaymentMethod.value,
      items: directItems,
      customerName: customerForm.name.trim(),
      customerPhone: customerForm.phone.trim(),
      customerEmail: customerForm.email.trim() || undefined,
      notes: customerForm.notes.trim() || undefined,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    const res = await fetch(`${apiUrl}/orders/checkout`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al procesar el checkout');
    }

    // Éxito: guardar tickets generados y limpiar carrito
    completedOrder.value = data.order;
    completedMessage.value = data.message;
    generatedTickets.value = data.tickets || {
      clientTicket: 'No se generó el ticket en formato texto.',
      staffTicket: 'No se generó el ticket en formato texto.',
    };
    orderCompleted.value = true;
    cartStore.clearCart();

    toastStore.success('¡Orden Finalizada con Éxito!', {
      message: `Se ha emitido el Ticket #${data.order.ticketNumber}.`,
      duration: 6000,
    });
  } catch (error: any) {
    toastStore.error('No se pudo completar el pedido', {
      message: error.message || 'Ocurrió un error inesperado al procesar la compra.',
    });
  } finally {
    loadingCheckout.value = false;
  }
};

const printTicket = () => {
  window.print();
};

const resetCheckout = () => {
  orderCompleted.value = false;
  completedOrder.value = null;
  completedMessage.value = '';
};
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .checkout-page-wrapper,
  .checkout-page-wrapper * {
    visibility: visible;
  }
  .checkout-page-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
