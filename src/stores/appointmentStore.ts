import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import io, { Socket } from 'socket.io-client';
import Swal from 'sweetalert2';

export interface Appointment {
  _id: string;
  user: any;
  guestName?: string;
  guestPhone?: string;
  services: any[];
  suggestedServiceText?: string;
  date: string;
  time: string | null;
  totalDuration: number;
  status: 'pending' | 'confirmed' | 'reminded' | 'cancelled_noshow' | 'cancelled_admin' | 'completed';
  depositAmount: number;
  depositConfirmed: boolean;
  depositProofUrl?: string;
  notes?: string;
}

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref<Appointment[]>([]);
  const loading = ref(false);
  const socket = ref<Socket | null>(null);

  const authStore = useAuthStore();
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  /**
   * Conecta Socket.io y escucha eventos en tiempo real
   * Muestra Toasts de alerta operativa SOLO en vistas de Admin / SuperAdmin
   */
  const initSocket = () => {
    if (socket.value) return;

    socket.value = io({ credentials: true });

    socket.value.on('appointment:created', () => {
      fetchAppointments();
      if (authStore.userRole === 'admin' || authStore.userRole === 'superadmin') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'Nueva solicitud de cita recibida',
          showConfirmButton: false,
          timer: 4000,
        });
      }
    });

    socket.value.on('appointment:confirmed', () => {
      fetchAppointments();
      if (authStore.userRole === 'admin' || authStore.userRole === 'superadmin') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Cita confirmada y horario asignado',
          showConfirmButton: false,
          timer: 4000,
        });
      }
    });

    socket.value.on('appointment:updated', () => {
      fetchAppointments();
    });

    socket.value.on('appointment:cancelled', () => {
      fetchAppointments();
    });
  };

  /**
   * Carga la lista de citas desde la API
   */
  const fetchAppointments = async (filters?: { date?: string; status?: string }) => {
    loading.value = true;
    try {
      let queryStr = '';
      if (filters?.date) queryStr += `date=${filters.date}&`;
      if (filters?.status) queryStr += `status=${filters.status}&`;

      const res = await fetch(`${apiUrl}/appointments?${queryStr}`, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        appointments.value = data.appointments;
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Solicitud de cita (Cliente / Invitado)
   */
  const createAppointment = async (payload: {
    services?: string[];
    suggestedServiceText?: string;
    date: string;
    guestName?: string;
    guestPhone?: string;
    notes?: string;
  }) => {
    const res = await fetch(`${apiUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear cita');
    return data.appointment;
  };

  /**
   * Confirmación de apartado PayPal Mock (Dev)
   */
  const confirmDepositPayPalMock = async (appointmentId: string) => {
    const res = await fetch(`${apiUrl}/appointments/${appointmentId}/deposit/paypal-mock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ transactionId: `paypal_mock_${Date.now()}` }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al confirmar apartado con PayPal');
    await fetchAppointments();
    return data;
  };

  /**
   * Confirmación manual de apartado
   */
  const confirmDepositManual = async (appointmentId: string, proofUrl?: string) => {
    const res = await fetch(`${apiUrl}/appointments/${appointmentId}/deposit/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ proofUrl }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al confirmar apartado manual');
    await fetchAppointments();
    return data;
  };

  /**
   * Confirmación de cita con asignación de hora y detección de traslape
   */
  const confirmAppointment = async (appointmentId: string, time: string, serviceIds?: string[]) => {
    const res = await fetch(`${apiUrl}/appointments/${appointmentId}/confirm`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ time, services: serviceIds }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al confirmar cita');
    await fetchAppointments();
    return data;
  };

  /**
   * Marcar No-Show
   */
  const markNoShow = async (appointmentId: string) => {
    const res = await fetch(`${apiUrl}/appointments/${appointmentId}/no-show`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al marcar No-Show');
    await fetchAppointments();
    return data;
  };

  /**
   * Reagendar cita
   */
  const rescheduleAppointment = async (appointmentId: string, date: string, time?: string) => {
    const res = await fetch(`${apiUrl}/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ date, time }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al reagendar cita');
    await fetchAppointments();
    return data;
  };

  /**
   * Cancelar cita
   */
  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    const res = await fetch(`${apiUrl}/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al cancelar cita');
    await fetchAppointments();
    return data;
  };

  return {
    appointments,
    loading,
    initSocket,
    fetchAppointments,
    createAppointment,
    confirmDepositPayPalMock,
    confirmDepositManual,
    confirmAppointment,
    markNoShow,
    rescheduleAppointment,
    cancelAppointment,
  };
});
