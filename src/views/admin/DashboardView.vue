<template>
  <div>
    <!-- Metrics Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
      <div style="padding: 1.25rem; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6; display: flex; align-items: center; justify-content: space-between;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Total Citas</div>
          <div style="font-size: 1.75rem; font-weight: 800; margin-top: 0.25rem;" class="text-slate-900 dark:text-white">{{ totalAppointments }}</div>
        </div>
        <CalendarDays style="width: 32px; height: 32px; color: #3b82f6;" />
      </div>

      <div style="padding: 1.25rem; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 4px solid #eab308; display: flex; align-items: center; justify-content: space-between;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Pendientes (Warning)</div>
          <div style="font-size: 1.75rem; font-weight: 800; margin-top: 0.25rem;" class="text-slate-900 dark:text-white">{{ pendingAppointments }}</div>
        </div>
        <Clock style="width: 32px; height: 32px; color: #eab308;" />
      </div>

      <div style="padding: 1.25rem; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 4px solid #22c55e; display: flex; align-items: center; justify-content: space-between;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Confirmadas (Success)</div>
          <div style="font-size: 1.75rem; font-weight: 800; margin-top: 0.25rem;" class="text-slate-900 dark:text-white">{{ confirmedAppointments }}</div>
        </div>
        <CheckCircle2 style="width: 32px; height: 32px; color: #22c55e;" />
      </div>

      <div style="padding: 1.25rem; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 4px solid #ec4899; display: flex; align-items: center; justify-content: space-between;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Recaudado Apartados</div>
          <div style="font-size: 1.75rem; font-weight: 800; margin-top: 0.25rem;" class="text-slate-900 dark:text-white">${{ totalDeposits }} MXN</div>
        </div>
        <CreditCard style="width: 32px; height: 32px; color: #ec4899;" />
      </div>
    </div>

    <!-- Embedded FullCalendar TailAdmin Section -->
    <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <h3 style="margin: 0; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <CalendarDays style="width: 22px; height: 22px; color: #ec4899;" /> Calendario General de Citas (Tiempo Real)
        </h3>

        <!-- Status Legend Badges -->
        <div style="display: flex; gap: 0.75rem; align-items: center; font-size: 0.75rem; font-weight: 700;">
          <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #EAB308;"></span> Pending (Warning)</span>
          <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #22C55E;"></span> Confirmed (Success)</span>
          <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #3B82F6;"></span> Reminded (Primary)</span>
          <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444;"></span> Cancelled (Danger)</span>
        </div>
      </div>

      <FullCalendar :options="calendarOptions" />
    </div>

    <!-- Modal TailAdmin de Detalle/Acción sobre Cita -->
    <div v-if="selectedAppt" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div ref="modalRef" style="background: white; width: 100%; max-width: 480px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #0f172a; font-weight: 800;">Gestionar Cita #{{ selectedAppt._id.slice(-6) }}</h3>
          <button @click="selectedAppt = null" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 1.25rem;">&times;</button>
        </div>

        <div style="font-size: 0.9rem; color: #334155; display: flex; flex-direction: column; gap: 0.5rem;">
          <p style="margin: 0;"><strong>Cliente:</strong> {{ selectedAppt.guestName || selectedAppt.user?.name || 'Cliente' }}</p>
          <p style="margin: 0;"><strong>Fecha:</strong> {{ selectedAppt.date.split('T')[0] }}</p>
          <p style="margin: 0;">
            <strong>Estado:</strong> 
            <span :style="{ background: statusBgMap[selectedAppt.status], color: statusColorMap[selectedAppt.status], padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginLeft: '0.5rem' }">
              {{ selectedAppt.status }}
            </span>
          </p>
          <p style="margin: 0;"><strong>Apartado ($100):</strong> {{ selectedAppt.depositConfirmed ? 'Confirmado' : 'Pendiente' }}</p>
        </div>

        <!-- Asignación de Hora -->
        <div v-if="selectedAppt.status === 'pending'" style="margin: 1.25rem 0; background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <label style="display: block; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; font-size: 0.85rem;">Asignar Hora (HH:mm)</label>
          <input v-model="confirmTime" type="text" placeholder="14:00" style="padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; width: 100%; box-sizing: border-box;" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1.5rem;">
          <button v-if="!selectedAppt.depositConfirmed" @click="handleConfirmDepositPayPal" style="background: #0070ba; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Confirmar Apartado PayPal (Mock Dev)
          </button>

          <button v-if="selectedAppt.depositConfirmed && selectedAppt.status === 'pending'" @click="handleConfirmAppointment" style="background: #10b981; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Asignar Hora y Confirmar Cita
          </button>

          <button v-if="selectedAppt.status === 'confirmed'" @click="handleMarkNoShow" style="background: #f59e0b; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Marcar No-Show (Ausencia)
          </button>

          <button @click="selectedAppt = null" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.75rem; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 0.25rem;">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { CalendarDays, Clock, CheckCircle2, CreditCard } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import gsap from 'gsap';

const appointmentStore = useAppointmentStore();
const selectedAppt = ref<any>(null);
const confirmTime = ref('14:00');
const modalRef = ref<HTMLElement | null>(null);

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

const statusBgMap: Record<string, string> = {
  pending: '#FEF9C3',
  confirmed: '#DCFCE7',
  reminded: '#DBEAFE',
  cancelled_noshow: '#FEE2E2',
  cancelled_admin: '#FEE2E2',
  completed: '#F1F5F9',
};

const totalAppointments = computed(() => appointmentStore.appointments.length);
const pendingAppointments = computed(() => appointmentStore.appointments.filter((a) => a.status === 'pending').length);
const confirmedAppointments = computed(() => appointmentStore.appointments.filter((a) => a.status === 'confirmed').length);
const totalDeposits = computed(() =>
  appointmentStore.appointments.filter((a) => a.depositConfirmed).reduce((sum, a) => sum + (a.depositAmount || 100), 0)
);

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
    nextTick(() => {
      if (modalRef.value) {
        gsap.fromTo(modalRef.value, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.5)' });
      }
    });
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
