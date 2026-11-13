<template>
  <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h2 style="margin: 0; font-weight: 800;" class="text-slate-900 dark:text-white">Calendario de Citas en Tiempo Real</h2>
      <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.85rem; font-weight: 600;" class="text-slate-700 dark:text-slate-300">
        <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #EAB308;"></span> Pendiente</span>
        <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #22C55E;"></span> Confirmada</span>
        <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #3B82F6;"></span> Recordada</span>
        <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #EF4444;"></span> Cancelada</span>
      </div>
    </div>

    <!-- FullCalendar -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modal de Detalle / Acción sobre Cita -->
    <div v-if="selectedAppt" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50;">
      <div style="width: 480px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
        <h3 style="margin-top: 0; color: #0f172a;">Gestionar Cita #{{ selectedAppt._id.slice(-6) }}</h3>
        
        <p><strong>Cliente:</strong> {{ selectedAppt.guestName || selectedAppt.user?.name || 'Cliente' }}</p>
        <p><strong>Fecha:</strong> {{ selectedAppt.date.split('T')[0] }}</p>
        <p><strong>Estado:</strong> <span style="font-weight: 700; text-transform: uppercase;">{{ selectedAppt.status }}</span></p>
        <p><strong>Apartado:</strong> {{ selectedAppt.depositConfirmed ? '✅ Confirmado ($' + selectedAppt.depositAmount + ')' : '❌ Pendiente ($' + selectedAppt.depositAmount + ')' }}</p>

        <!-- Asignar hora si está confirmando -->
        <div v-if="selectedAppt.status === 'pending'" style="margin: 1rem 0; background: #f8fafc; padding: 1rem; border-radius: 6px;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Asignar Hora (HH:mm)</label>
          <input v-model="confirmTime" type="text" placeholder="14:00" style="padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; width: 100%; box-sizing: border-box;" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.5rem;">
          <button v-if="!selectedAppt.depositConfirmed" @click="handleConfirmDepositPayPal" style="background: #0070ba; color: white; border: none; padding: 0.65rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Confirmar Apartado PayPal (Mock Dev)
          </button>

          <button v-if="selectedAppt.depositConfirmed && selectedAppt.status === 'pending'" @click="handleConfirmAppointment" style="background: #10b981; color: white; border: none; padding: 0.65rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Asignar Hora y Confirmar Cita
          </button>

          <button v-if="selectedAppt.status === 'confirmed'" @click="handleMarkNoShow" style="background: #f59e0b; color: white; border: none; padding: 0.65rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Marcar No-Show (Ausencia)
          </button>

          <button @click="selectedAppt = null" style="background: #e2e8f0; color: #475569; border: none; padding: 0.65rem; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 0.5rem;">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppointmentStore } from '../../stores/appointmentStore';
import Swal from 'sweetalert2';

const appointmentStore = useAppointmentStore();
const selectedAppt = ref<any>(null);
const confirmTime = ref('14:00');

onMounted(() => {
  appointmentStore.initSocket();
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

const calendarEvents = computed(() => {
  return appointmentStore.appointments.map((appt) => ({
    id: appt._id,
    title: `${appt.guestName || appt.user?.name || 'Cliente'} (${appt.time || 'Sin hora'})`,
    start: appt.time ? `${appt.date.split('T')[0]}T${appt.time}:00` : appt.date.split('T')[0],
    backgroundColor: statusColorMap[appt.status] || '#64748B',
    borderColor: 'transparent',
    extendedProps: appt,
  }));
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: calendarEvents.value,
  eventClick: (info: any) => {
    selectedAppt.value = info.event.extendedProps;
  },
}));

const handleConfirmDepositPayPal = async () => {
  try {
    await appointmentStore.confirmDepositPayPalMock(selectedAppt.value._id);
    Swal.fire({ icon: 'success', title: 'Apartado Confirmado', timer: 1500, showConfirmButton: false });
    selectedAppt.value = null;
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};

const handleConfirmAppointment = async () => {
  try {
    await appointmentStore.confirmAppointment(selectedAppt.value._id, confirmTime.value);
    Swal.fire({ icon: 'success', title: 'Cita Confirmada', text: `Hora asignada: ${confirmTime.value}`, timer: 1500, showConfirmButton: false });
    selectedAppt.value = null;
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Conflicto de Horario', text: e.message });
  }
};

const handleMarkNoShow = async () => {
  try {
    await appointmentStore.markNoShow(selectedAppt.value._id);
    Swal.fire({ icon: 'info', title: 'Cita Marcada No-Show', timer: 1500, showConfirmButton: false });
    selectedAppt.value = null;
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};
</script>
