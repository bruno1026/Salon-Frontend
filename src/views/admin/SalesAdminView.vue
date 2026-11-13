<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="margin: 0; font-size: 1.6rem; font-weight: 800; display: flex; align-items: center; gap: 0.6rem;" class="text-slate-900 dark:text-white">
          <Receipt style="width: 28px; height: 28px;" class="text-[#3A113D] dark:text-[#f472b6]" />
          Submódulo de Ventas & Facturación (Invoices)
        </h1>
        <p style="margin: 0.25rem 0 0; font-size: 0.875rem;" class="text-slate-500 dark:text-slate-400">
          Control financiero de transacciones, cobros en sucursal y emisión de tickets duales.
        </p>
      </div>
    </div>

    <!-- Overview KPI Cards (TailAdmin Invoices Demo) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
      <!-- Ventas del Mes -->
      <div style="padding: 1.25rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Ventas del Mes</span>
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center;">
            <DollarSign style="width: 20px; height: 20px;" />
          </div>
        </div>
        <div style="font-size: 1.6rem; font-weight: 800;" class="text-slate-900 dark:text-white">${{ stats.monthlySales.toLocaleString() }} MXN</div>
        <span style="font-size: 0.75rem; color: #16a34a; font-weight: 700;">↑ 100% cobro verificado</span>
      </div>

      <!-- Pendientes de Cobro -->
      <div style="padding: 1.25rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Pendiente en Tienda</span>
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center;">
            <Clock style="width: 20px; height: 20px;" />
          </div>
        </div>
        <div style="font-size: 1.6rem; font-weight: 800;" class="text-amber-600 dark:text-amber-400">${{ stats.pendingAmount.toLocaleString() }} MXN</div>
        <span style="font-size: 0.75rem;" class="text-slate-500 dark:text-slate-400">{{ stats.pendingCount }} pedidos pendientes de caja</span>
      </div>

      <!-- Ticket Promedio -->
      <div style="padding: 1.25rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Ticket Promedio</span>
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center;">
            <TrendingUp style="width: 20px; height: 20px;" />
          </div>
        </div>
        <div style="font-size: 1.6rem; font-weight: 800;" class="text-indigo-600 dark:text-indigo-400">${{ stats.avgTicket.toFixed(2) }} MXN</div>
        <span style="font-size: 0.75rem;" class="text-slate-500 dark:text-slate-400">Promedio por transacción</span>
      </div>

      <!-- Total Transacciones -->
      <div style="padding: 1.25rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Total Órdenes</span>
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #fce7f3; color: #be185d; display: flex; align-items: center; justify-content: center;">
            <ShoppingCart style="width: 20px; height: 20px;" />
          </div>
        </div>
        <div style="font-size: 1.6rem; font-weight: 800;" class="text-slate-900 dark:text-white">{{ stats.totalCount }}</div>
        <span style="font-size: 0.75rem;" class="text-slate-500 dark:text-slate-400">Órdenes registradas</span>
      </div>
    </div>

    <!-- TailAdmin Controls & Status Tabs -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1rem; border-radius: 12px;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <!-- Status Tabs -->
      <div style="display: flex; gap: 0.5rem; overflow-x: auto;">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :style="{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === tab.value ? '#3A113D' : 'transparent',
            color: activeTab === tab.value ? 'white' : '#64748b',
          }"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Search Input -->
      <div style="position: relative; width: 260px;">
        <Search style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar ticket o cliente..."
          style="width: 100%; padding: 0.55rem 0.75rem 0.55rem 2.25rem; border-radius: 8px; font-size: 0.85rem; outline: none;"
          class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
        />
      </div>
    </div>

    <!-- Sales Data Table -->
    <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; font-weight: 700;" class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 dark:border-slate-700">
              <th style="padding: 0.9rem 1.25rem;">Ticket #</th>
              <th style="padding: 0.9rem 1.25rem;">Cliente</th>
              <th style="padding: 0.9rem 1.25rem;">Fecha & Hora</th>
              <th style="padding: 0.9rem 1.25rem;">Método de Pago</th>
              <th style="padding: 0.9rem 1.25rem;">Monto Total</th>
              <th style="padding: 0.9rem 1.25rem;">Estado</th>
              <th style="padding: 0.9rem 1.25rem; text-align: right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order._id"
              style="border-bottom: 1px solid #f1f5f9;"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/40 dark:border-slate-700/60"
            >
              <!-- Ticket Number -->
              <td style="padding: 0.9rem 1.25rem; font-weight: 800;" class="text-slate-900 dark:text-white">
                {{ order.ticketNumber }}
              </td>

              <!-- Customer Details -->
              <td style="padding: 0.9rem 1.25rem;">
                <div style="font-weight: 700;" class="text-slate-900 dark:text-white">
                  {{ order.user?.name || 'Cliente Mostrador' }}
                </div>
                <div style="font-size: 0.75rem;" class="text-slate-500 dark:text-slate-400">
                  {{ order.user?.phone || order.user?.email || 'Sin contacto' }}
                </div>
              </td>

              <!-- Date -->
              <td style="padding: 0.9rem 1.25rem;" class="text-slate-600 dark:text-slate-300">
                {{ formatDate(order.createdAt) }}
              </td>

              <!-- Payment Method -->
              <td style="padding: 0.9rem 1.25rem;">
                <span style="font-weight: 600; text-transform: capitalize;" class="text-slate-700 dark:text-slate-300">
                  {{ formatPaymentMethod(order.paymentMethod) }}
                </span>
              </td>

              <!-- Total Amount -->
              <td style="padding: 0.9rem 1.25rem; font-weight: 800;" class="text-slate-900 dark:text-white">
                ${{ order.totalAmount }} MXN
              </td>

              <!-- Status Badge -->
              <td style="padding: 0.9rem 1.25rem;">
                <span
                  v-if="order.paymentStatus === 'completed'"
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #dcfce7; color: #15803d; padding: 0.25rem 0.7rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  <CheckCircle style="width: 14px; height: 14px;" /> Cobrado
                </span>

                <span
                  v-else-if="order.paymentStatus === 'payment_pending_store'"
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fef3c7; color: #b45309; padding: 0.25rem 0.7rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-amber-950/60 dark:text-amber-300"
                >
                  <Clock style="width: 14px; height: 14px;" /> Pendiente en Tienda
                </span>

                <span
                  v-else
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fee2e2; color: #b91c1c; padding: 0.25rem 0.7rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-red-950/60 dark:text-red-300"
                >
                  <XCircle style="width: 14px; height: 14px;" /> Cancelado
                </span>
              </td>

              <!-- Actions -->
              <td style="padding: 0.9rem 1.25rem; text-align: right;">
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                  <!-- Ver Ticket (Lectura disponible con orders:view) -->
                  <button
                    @click="viewTicket(order)"
                    style="padding: 0.45rem 0.8rem; border-radius: 6px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;"
                    class="dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Printer style="width: 14px; height: 14px;" /> Ticket Dual
                  </button>

                  <!-- Confirmar Pago (Acción Financiera Requerida por orders:confirm_payment) -->
                  <button
                    v-if="order.paymentStatus === 'payment_pending_store'"
                    @click="confirmPayment(order)"
                    :disabled="!canConfirmPayment"
                    :title="!canConfirmPayment ? 'Requiere permiso de acción: orders:confirm_payment' : 'Confirmar cobro en caja'"
                    :style="{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: canConfirmPayment ? '#10b981' : '#94a3b8',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: canConfirmPayment ? 'pointer' : 'not-allowed',
                      opacity: canConfirmPayment ? 1 : 0.65,
                    }"
                  >
                    ✓ Confirmar Cobro
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" style="text-align: center; padding: 3rem 1rem;" class="text-slate-500 dark:text-slate-400">
                No hay transacciones registradas para este filtro.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: Dual Ticket View -->
    <div v-if="showTicketModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1.5rem;">
      <div style="width: 100%; max-width: 600px; border-radius: 16px; padding: 1.75rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem;" class="dark:border-slate-700">
          <h3 style="margin: 0; font-weight: 800; font-size: 1.2rem;" class="text-slate-900 dark:text-white">
            Comprobante Dual de Venta - Ticket #{{ selectedOrder?.ticketNumber }}
          </h3>
          <button @click="showTicketModal = false" style="background: transparent; border: none; cursor: pointer;" class="text-slate-400">
            <X style="width: 22px; height: 22px;" />
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; max-height: 60vh; overflow-y: auto;">
          <!-- Ticket Cliente -->
          <div style="border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.25rem; background: #fafafa;" class="dark:bg-slate-900 dark:border-slate-700">
            <div style="font-weight: 800; font-size: 0.95rem;" class="text-[#3A113D] dark:text-[#f472b6]">TICKET CLIENTE</div>
            <div style="font-size: 0.8rem; margin-top: 0.25rem;" class="text-slate-600 dark:text-slate-300">Cliente: {{ selectedOrder?.user?.name }} ({{ selectedOrder?.user?.phone || 'Sin tel' }})</div>
            <div style="font-size: 0.8rem;" class="text-slate-600 dark:text-slate-300">Fecha: {{ formatDate(selectedOrder?.createdAt) }}</div>
            
            <div style="margin-top: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.5rem;" class="dark:border-slate-700">
              <div v-for="(item, idx) in selectedOrder?.items" :key="idx" style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                <span>{{ item.quantity }}x {{ item.productName || item.product?.name }}</span>
                <span style="font-weight: 700;">${{ item.unitPrice * item.quantity }} MXN</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; border-top: 1px solid #000; margin-top: 0.75rem; padding-top: 0.5rem; font-weight: 800; font-size: 1rem;" class="text-slate-900 dark:text-white dark:border-slate-600">
              <span>TOTAL NETO</span>
              <span style="color: #10b981;">${{ selectedOrder?.totalAmount }} MXN</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
          <button @click="showTicketModal = false" style="padding: 0.6rem 1.25rem; border-radius: 8px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; cursor: pointer;" class="dark:border-slate-700 text-slate-700 dark:text-slate-300">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import {
  Receipt,
  DollarSign,
  Clock,
  TrendingUp,
  ShoppingCart,
  Search,
  CheckCircle,
  XCircle,
  Printer,
  X,
} from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_API_URL || '/api';

const orders = ref<any[]>([]);
const activeTab = ref('all');
const searchQuery = ref('');
const showTicketModal = ref(false);
const selectedOrder = ref<any>(null);

const tabs = [
  { label: 'Todos los Pedidos', value: 'all' },
  { label: 'Completados / Cobrados', value: 'completed' },
  { label: 'Pendientes de Caja', value: 'payment_pending_store' },
];

// Permiso granular de acción financiera para confirmar cobro
const canConfirmPayment = computed(() => {
  return authStore.hasPermission('orders', 'confirm_payment');
});

onMounted(() => {
  fetchOrders();
});

const fetchOrders = async () => {
  try {
    const res = await fetch(`${apiUrl}/orders`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      orders.value = data.orders || [];
    }
  } catch (e) {
    // Ignorar
  }
};

const stats = computed(() => {
  const totalCount = orders.value.length;
  const completedOrders = orders.value.filter((o) => o.paymentStatus === 'completed');
  const pendingOrders = orders.value.filter((o) => o.paymentStatus === 'payment_pending_store');

  const monthlySales = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgTicket = completedOrders.length > 0 ? monthlySales / completedOrders.length : 0;

  return {
    monthlySales,
    pendingAmount,
    pendingCount: pendingOrders.length,
    avgTicket,
    totalCount,
  };
});

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchesTab = activeTab.value === 'all' || o.paymentStatus === activeTab.value;
    const matchesSearch =
      o.ticketNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.user?.name && o.user.name.toLowerCase().includes(searchQuery.value.toLowerCase()));

    return matchesTab && matchesSearch;
  });
});

const confirmPayment = async (order: any) => {
  if (!canConfirmPayment.value) return;

  const result = await Swal.fire({
    title: '¿Confirmar cobro en caja?',
    text: `Confirmar pago de $${order.totalAmount} MXN para el Ticket ${order.ticketNumber}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Sí, cobrar en tienda',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${apiUrl}/orders/${order._id}/confirm-payment`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al confirmar pago');

      Swal.fire({ icon: 'success', title: '¡Pago Verificado!', text: 'El pago ha sido registrado en sucursal.', timer: 1500, showConfirmButton: false });
      fetchOrders();
    } catch (e: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: e.message });
    }
  }
};

const viewTicket = (order: any) => {
  selectedOrder.value = order;
  showTicketModal.value = true;
};

const formatPaymentMethod = (method: string) => {
  switch (method) {
    case 'paypal':
      return 'PayPal (Línea)';
    case 'terminal_store':
      return 'Terminal Sucursal';
    case 'cash_store':
      return 'Efectivo Sucursal';
    default:
      return method;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
