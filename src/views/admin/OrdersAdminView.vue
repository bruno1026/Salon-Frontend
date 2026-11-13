<template>
  <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <!-- Datatable 3 Header Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
        <ShoppingCart style="width: 24px; height: 24px; color: #ec4899;" /> Gestión de Órdenes E-Commerce (Datatable 3)
      </h2>

      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <!-- Selector filas por página -->
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #64748b; font-weight: 600;">
          <span>Show</span>
          <select v-model="itemsPerPage" style="padding: 0.35rem 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>entries</span>
        </div>

        <!-- Buscador -->
        <div style="position: relative; width: 240px;">
          <Search style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;" />
          <input v-model="searchQuery" type="text" placeholder="Buscar orden o ticket..." style="width: 100%; padding: 0.45rem 0.65rem 0.45rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; box-sizing: border-box;" />
        </div>

        <!-- Download CSV -->
        <button @click="exportCSV" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
          <Download style="width: 16px; height: 16px;" /> Download
        </button>
      </div>
    </div>

    <!-- Datatable 3 Table -->
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.8rem; text-transform: uppercase;">
            <th style="padding: 0.75rem 1rem;">Ticket #</th>
            <th style="padding: 0.75rem 1rem;">Cliente</th>
            <th style="padding: 0.75rem 1rem;">Productos Solicitados</th>
            <th style="padding: 0.75rem 1rem;">Monto Total</th>
            <th style="padding: 0.75rem 1rem;">Método de Pago</th>
            <th style="padding: 0.75rem 1rem;">Estado Pago</th>
            <th style="padding: 0.75rem 1rem; text-align: center;">Acciones & Tickets Duales</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ord in paginatedOrders" :key="ord._id" style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.75rem 1rem; font-weight: 800; color: #ec4899;">{{ ord.ticketNumber }}</td>
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: #1e293b;">
              {{ ord.user?.name || 'Cliente' }}
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 400;">{{ ord.user?.phone || ord.user?.email }}</div>
            </td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #334155;">
              <div v-for="item in ord.items" :key="item.product">
                • {{ item.quantity }}x {{ item.productName }} (${{ item.unitPrice }})
              </div>
            </td>
            <td style="padding: 0.75rem 1rem; font-weight: 800; color: #10b981;">${{ ord.totalAmount }} MXN</td>
            <td style="padding: 0.75rem 1rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: #475569;">
              {{ ord.paymentMethod.replace('_store', ' en tienda') }}
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ background: ord.paymentStatus === 'completed' ? '#dcfce7' : '#fef9c3', color: ord.paymentStatus === 'completed' ? '#15803d' : '#a16207', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800' }">
                {{ ord.paymentStatus === 'completed' ? 'Cobrado' : 'Pendiente en Caja' }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <button v-if="ord.paymentStatus !== 'completed'" @click="handleConfirmPayment(ord)" style="background: #10b981; color: white; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.78rem; cursor: pointer;">
                  Confirmar Cobro en Caja
                </button>
                <button @click="showTicketsModal(ord)" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;" title="Ver Tickets Duales">
                  <FileText style="width: 16px; height: 16px; color: #3b82f6;" />
                  <span style="font-size: 0.75rem; font-weight: 700;">Tickets Duales</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Automático de Tickets Duales (Ticket Cliente + Ticket Staff) -->
    <div v-if="activeTickets" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div style="background: white; width: 100%; max-width: 680px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <FileText style="width: 22px; height: 22px; color: #ec4899;" /> Tickets Duales de Venta #{{ activeTickets.clientTicket.ticketNumber }}
          </h3>
          <button @click="activeTickets = null" style="background: transparent; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer;">&times;</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <!-- Ticket 1: Cliente -->
          <div style="background: #f8fafc; border: 2px dashed #cbd5e1; padding: 1.25rem; border-radius: 8px; font-size: 0.85rem;">
            <h4 style="margin: 0 0 0.75rem; color: #1e293b; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">
              🎫 TICKET CLIENTE (COMPROBANTE)
            </h4>
            <p style="margin: 0.3rem 0;"><strong>Ticket:</strong> {{ activeTickets.clientTicket.ticketNumber }}</p>
            <p style="margin: 0.3rem 0;"><strong>Fecha:</strong> {{ activeTickets.clientTicket.date }}</p>
            <p style="margin: 0.3rem 0;"><strong>Cliente:</strong> {{ activeTickets.clientTicket.customer }}</p>
            <p style="margin: 0.3rem 0;"><strong>Método Pago:</strong> {{ activeTickets.clientTicket.paymentMethod }}</p>

            <div style="margin: 0.75rem 0; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; padding: 0.5rem 0;">
              <div v-for="item in activeTickets.clientTicket.items" :key="item.name" style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                <span>{{ item.quantity }}x {{ item.name }}</span>
                <strong>{{ item.subtotal }}</strong>
              </div>
            </div>
            <div style="text-align: right; font-size: 1.1rem; font-weight: 800; color: #10b981;">
              TOTAL: {{ activeTickets.clientTicket.totalAmount }}
            </div>
          </div>

          <!-- Ticket 2: Staff Orden de Preparación -->
          <div style="background: #fffbeb; border: 2px dashed #fcd34d; padding: 1.25rem; border-radius: 8px; font-size: 0.85rem;">
            <h4 style="margin: 0 0 0.75rem; color: #78350f; font-weight: 800; border-bottom: 1px solid #fde68a; padding-bottom: 0.5rem;">
              📦 TICKET STAFF (ORDEN PREPARACIÓN)
            </h4>
            <p style="margin: 0.3rem 0;"><strong>Orden:</strong> {{ activeTickets.staffTicket.ticketNumber }}</p>
            <p style="margin: 0.3rem 0;"><strong>Entrega a:</strong> {{ activeTickets.staffTicket.customer }}</p>
            <p style="margin: 0.3rem 0; font-weight: 800; color: #b45309;">{{ activeTickets.staffTicket.paymentStatus }}</p>

            <div style="margin: 0.75rem 0; border-top: 1px solid #fde68a; border-bottom: 1px solid #fde68a; padding: 0.5rem 0;">
              <div v-for="item in activeTickets.staffTicket.items" :key="item.name" style="font-weight: 700;">
                ✔ {{ item.quantity }} unidad(es) - {{ item.name }}
              </div>
            </div>
            <p style="font-size: 0.75rem; color: #92400e; margin: 0;">{{ activeTickets.staffTicket.action }}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem; gap: 0.75rem;">
          <button @click="activeTickets = null" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.65rem 1.25rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Cerrar
          </button>
          <button @click="printTickets" style="background: #ec4899; color: white; border: none; padding: 0.65rem 1.25rem; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <Printer style="width: 18px; height: 18px;" /> Imprimir Tickets Duales
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { ShoppingCart, Search, Download, FileText, Printer } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const orders = ref<any[]>([]);
const searchQuery = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const activeTickets = ref<any>(null);

const apiUrl = import.meta.env.VITE_API_URL || '/api';

onMounted(() => {
  fetchOrders();
});

const fetchOrders = async () => {
  try {
    const res = await fetch(`${apiUrl}/orders`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      orders.value = data.orders;
    }
  } catch (e) {
    // Ignorar
  }
};

const filteredOrders = computed(() => {
  let list = [...orders.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (o) =>
        o.ticketNumber.toLowerCase().includes(q) ||
        (o.user?.name || '').toLowerCase().includes(q) ||
        o.paymentMethod.toLowerCase().includes(q)
    );
  }
  return list;
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value) || 1);

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredOrders.value.slice(start, start + itemsPerPage.value);
});

const exportCSV = () => {
  const rows = [
    ['Ticket', 'Cliente', 'Total', 'MetodoPago', 'EstadoPago', 'Fecha'],
    ...filteredOrders.value.map((o) => [
      o.ticketNumber,
      o.user?.name || '',
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      new Date(o.createdAt).toLocaleString(),
    ]),
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ordenes_appsalon_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Confirmación manual en caja -> Despliega automáticamente el modal de Tickets Duales
const handleConfirmPayment = (ord: any) => {
  Swal.fire({
    title: `¿Confirmar cobro de ${ord.ticketNumber}?`,
    text: `Monto a cobrar en caja: $${ord.totalAmount} MXN`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Sí, confirmar cobro',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}/orders/${ord._id}/confirm-payment`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire({ icon: 'success', title: '¡Pago Verificado!', timer: 1500, showConfirmButton: false });
          // Modal Automático de Tickets Duales
          activeTickets.value = data.tickets;
          fetchOrders();
        }
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

const showTicketsModal = (ord: any) => {
  const customerName = ord.user?.name || 'Cliente';
  const customerPhone = ord.user?.phone || 'No registrado';
  const dateStr = new Date(ord.createdAt).toLocaleString();

  activeTickets.value = {
    clientTicket: {
      title: 'Comprobante de Venta - AppSalon 2.0',
      ticketNumber: ord.ticketNumber,
      date: dateStr,
      customer: customerName,
      paymentMethod: ord.paymentMethod,
      paymentStatus: ord.paymentStatus,
      items: ord.items.map((i: any) => ({
        name: i.productName,
        quantity: i.quantity,
        subtotal: `$${i.unitPrice * i.quantity} MXN`,
      })),
      totalAmount: `$${ord.totalAmount} MXN`,
    },
    staffTicket: {
      title: 'ORDEN DE PREPARACIÓN (STAFF)',
      ticketNumber: ord.ticketNumber,
      customer: `${customerName} (${customerPhone})`,
      paymentStatus: ord.paymentStatus === 'completed' ? 'PAGADO' : 'PENDIENTE EN CAJA',
      items: ord.items.map((i: any) => ({
        name: i.productName,
        quantity: i.quantity,
      })),
      action: 'Preparar empaque de productos para entrega en mostrador.',
    },
  };
};

const printTickets = () => {
  window.print();
};
</script>
