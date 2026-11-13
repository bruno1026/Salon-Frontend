<template>
  <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    <!-- Header Datatable 3 Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
        <CalendarDays style="width: 24px; height: 24px; color: #ec4899;" /> Listado de Citas (Datatable 3)
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

        <!-- Buscador instantáneo -->
        <div style="position: relative; width: 240px;">
          <Search style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;" />
          <input v-model="searchQuery" type="text" placeholder="Search..." style="width: 100%; padding: 0.45rem 0.65rem 0.45rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; box-sizing: border-box;" />
        </div>

        <!-- Botón Download CSV -->
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
            <th style="padding: 0.75rem 1rem; width: 40px;">
              <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
            </th>
            <th @click="sortBy('guestName')" style="padding: 0.75rem 1rem; cursor: pointer;">
              Cliente / Invitado <ArrowUpDown style="width: 12px; height: 12px; display: inline;" />
            </th>
            <th style="padding: 0.75rem 1rem;">Servicios</th>
            <th @click="sortBy('date')" style="padding: 0.75rem 1rem; cursor: pointer;">
              Fecha <ArrowUpDown style="width: 12px; height: 12px; display: inline;" />
            </th>
            <th style="padding: 0.75rem 1rem;">Hora</th>
            <th style="padding: 0.75rem 1rem;">Estado</th>
            <th style="padding: 0.75rem 1rem;">Apartado</th>
            <th style="padding: 0.75rem 1rem; text-align: center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appt in paginatedAppointments" :key="appt._id" style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.75rem 1rem;">
              <input type="checkbox" :value="appt._id" v-model="selectedIds" />
            </td>
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: #1e293b;">
              {{ appt.guestName || appt.user?.name || 'Cliente' }}
              <div v-if="appt.guestPhone || appt.user?.phone" style="font-size: 0.75rem; color: #94a3b8; font-weight: 400;">
                {{ appt.guestPhone || appt.user?.phone }}
              </div>
            </td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #475569;">
              {{ appt.suggestedServiceText || (appt.services?.length ? appt.services.length + ' servicio(s)' : 'Sin servicio') }}
            </td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #334155;">{{ appt.date.split('T')[0] }}</td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; font-weight: 700; color: #1e293b;">{{ appt.time || 'Sin asignar' }}</td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ background: statusBgMap[appt.status], color: statusColorMap[appt.status], padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }">
                {{ appt.status }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ background: appt.depositConfirmed ? '#dcfce7' : '#fef9c3', color: appt.depositConfirmed ? '#15803d' : '#a16207', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }">
                {{ appt.depositConfirmed ? 'Confirmado ($100)' : 'Pendiente' }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <button @click="openDetail(appt)" style="background: transparent; border: none; color: #3b82f6; cursor: pointer;" title="Ver Detalle">
                  <Eye style="width: 18px; height: 18px;" />
                </button>
                <button v-if="appt.status === 'pending'" @click="openConfirmModal(appt)" style="background: transparent; border: none; color: #10b981; cursor: pointer;" title="Confirmar Cita">
                  <CheckCircle2 style="width: 18px; height: 18px;" />
                </button>
                <button @click="openRescheduleModal(appt)" style="background: transparent; border: none; color: #eab308; cursor: pointer;" title="Reagendar">
                  <CalendarClock style="width: 18px; height: 18px;" />
                </button>
                <button @click="handleCancel(appt)" style="background: transparent; border: none; color: #ef4444; cursor: pointer;" title="Cancelar / No-Show">
                  <XCircle style="width: 18px; height: 18px;" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Datatable 3 Footer & Pagination -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <div style="font-size: 0.85rem; color: #64748b;">
        Showing {{ showingStart }} to {{ showingEnd }} of {{ filteredAppointments.length }} entries
      </div>

      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button @click="currentPage--" :disabled="currentPage === 1" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          Previous
        </button>
        <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b; padding: 0 0.5rem;">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage >= totalPages" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAppointmentStore, Appointment } from '../../stores/appointmentStore';
import {
  CalendarDays,
  Search,
  Download,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  CalendarClock,
  XCircle,
} from 'lucide-vue-next';
import Swal from 'sweetalert2';

const appointmentStore = useAppointmentStore();

const searchQuery = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const selectedIds = ref<string[]>([]);
const sortKey = ref('date');
const sortOrder = ref<'asc' | 'desc'>('desc');

onMounted(() => {
  appointmentStore.fetchAppointments();
});

const statusColorMap: Record<string, string> = {
  pending: '#EAB308',
  confirmed: '#22C55E',
  reminded: '#3B82F6',
  cancelled_noshow: '#EF4444',
  cancelled_admin: '#EF4444',
  completed: '#64748B',
};

const statusBgMap: Record<string, string> = {
  pending: '#FEF9C3',
  confirmed: '#DCFCE7',
  reminded: '#DBEAFE',
  cancelled_noshow: '#FEE2E2',
  cancelled_admin: '#FEE2E2',
  completed: '#F1F5F9',
};

const filteredAppointments = computed(() => {
  let list = [...appointmentStore.appointments];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (a) =>
        (a.guestName || a.user?.name || '').toLowerCase().includes(q) ||
        (a.suggestedServiceText || '').toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q) ||
        a.date.includes(q)
    );
  }
  return list;
});

const totalPages = computed(() => Math.ceil(filteredAppointments.value.length / itemsPerPage.value) || 1);

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredAppointments.value.slice(start, start + itemsPerPage.value);
});

const showingStart = computed(() => (filteredAppointments.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1));
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredAppointments.value.length));

const isAllSelected = computed(() => paginatedAppointments.value.length > 0 && selectedIds.value.length === paginatedAppointments.value.length);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = paginatedAppointments.value.map((a) => a._id);
  }
};

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const exportCSV = () => {
  const rows = [
    ['ID', 'Cliente', 'Servicio', 'Fecha', 'Hora', 'Estado', 'Apartado'],
    ...filteredAppointments.value.map((a) => [
      a._id,
      a.guestName || a.user?.name || '',
      a.suggestedServiceText || '',
      a.date.split('T')[0],
      a.time || 'Sin asignar',
      a.status,
      a.depositConfirmed ? 'Confirmado' : 'Pendiente',
    ]),
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `citas_appsalon_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const openDetail = (appt: Appointment) => {
  Swal.fire({
    title: `Cita #${appt._id.slice(-6)}`,
    html: `
      <p><b>Cliente:</b> ${appt.guestName || appt.user?.name || 'Cliente'}</p>
      <p><b>Teléfono:</b> ${appt.guestPhone || appt.user?.phone || 'No especificado'}</p>
      <p><b>Servicio:</b> ${appt.suggestedServiceText || 'Catálogo'}</p>
      <p><b>Fecha:</b> ${appt.date.split('T')[0]} - ${appt.time || 'Sin hora'}</p>
      <p><b>Estado:</b> ${appt.status}</p>
    `,
    icon: 'info',
  });
};

const openConfirmModal = (appt: Appointment) => {
  Swal.fire({
    title: 'Asignar Hora y Confirmar Cita',
    input: 'text',
    inputValue: '14:00',
    inputLabel: 'Hora asignada (HH:mm)',
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        await appointmentStore.confirmAppointment(appt._id, result.value);
        Swal.fire('¡Confirmada!', 'La cita ha sido asignada y confirmada.', 'success');
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

const openRescheduleModal = (appt: Appointment) => {
  Swal.fire({
    title: 'Reagendar Cita',
    html: `
      <input id="swal-date" type="date" class="swal2-input" value="${appt.date.split('T')[0]}">
      <input id="swal-time" type="text" class="swal2-input" placeholder="15:00" value="${appt.time || '15:00'}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return [
        (document.getElementById('swal-date') as HTMLInputElement).value,
        (document.getElementById('swal-time') as HTMLInputElement).value,
      ];
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      const [newDate, newTime] = result.value;
      try {
        await appointmentStore.rescheduleAppointment(appt._id, newDate, newTime);
        Swal.fire('Reagendada', 'La cita fue reagendada correctamente.', 'success');
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

const handleCancel = (appt: Appointment) => {
  Swal.fire({
    title: '¿Cancelar o marcar No-Show?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Marcar No-Show',
    cancelButtonText: 'Cancelar Cita',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await appointmentStore.markNoShow(appt._id);
        Swal.fire('No-Show', 'Cita marcada como inasistencia.', 'info');
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      try {
        await appointmentStore.cancelAppointment(appt._id, 'Cancelada por Admin');
        Swal.fire('Cancelada', 'La cita fue cancelada exitosamente.', 'success');
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};
</script>
