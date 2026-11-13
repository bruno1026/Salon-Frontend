<template>
  <div style="max-width: 680px; margin: 2rem auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0f172a; font-weight: 800; margin-bottom: 0.5rem;">Solicitar Cita de Belleza</h2>
    <p style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">Paso {{ step }} de 4: {{ stepTitles[step - 1] }}</p>

    <!-- Indicador de Pasos del Wizard -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem;">
      <div v-for="s in 4" :key="s" :style="{ color: step >= s ? '#ec4899' : '#cbd5e1', fontWeight: step === s ? '700' : '500' }">
        {{ s }}. {{ stepTitles[s - 1] }}
      </div>
    </div>

    <!-- Paso 1: Servicios -->
    <div v-if="step === 1">
      <h4 style="margin-bottom: 1rem; color: #334155;">Elige del Catálogo o Sugiere un Servicio</h4>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
        <label v-for="service in businessStore.catalogServices" :key="service._id" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
          <input type="checkbox" :value="service._id" v-model="form.services" />
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #1e293b;">{{ service.name }}</div>
            <div style="font-size: 0.85rem; color: #64748b;">${{ service.price }} • {{ service.durationMinutes || service.duration || 60 }} min</div>
          </div>
        </label>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">O escribe una sugerencia de servicio libre:</label>
        <textarea v-model="form.suggestedServiceText" placeholder="Ej. Tinte especial con mechas balayage y peinado..." style="width: 100%; height: 80px; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;"></textarea>
      </div>
    </div>

    <!-- Paso 2: Selección de Fecha -->
    <div v-if="step === 2">
      <h4 style="margin-bottom: 0.5rem; color: #334155;">Selecciona el Día de tu Cita</h4>

      <!-- MENSAJE VISUAL EXPLÍCITO REQUERIDO POR ARQUITECTURA -->
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>ℹ️</span> Elige el día; la hora exacta la acordamos y confirmamos por WhatsApp tras recibir tu apartado.
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Fecha Deseada</label>
        <input v-model="form.date" type="date" :min="today" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>
    </div>

    <!-- Paso 3: Datos de Invitado (Opcional) -->
    <div v-if="step === 3">
      <h4 style="margin-bottom: 0.5rem; color: #334155;">¿La cita es para otra persona? (Opcional)</h4>
      <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1.5rem;">Si agendas para un tercero, ingresa sus datos para enviarle los recordatorios directos a su WhatsApp.</p>

      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Nombre del Invitado</label>
        <input v-model="form.guestName" type="text" placeholder="Ana Lopez" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Teléfono WhatsApp del Invitado</label>
        <input v-model="form.guestPhone" type="text" placeholder="+5215598765432" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>
    </div>

    <!-- Paso 4: Resumen y Envío -->
    <div v-if="step === 4">
      <h4 style="margin-bottom: 1rem; color: #334155;">Resumen de tu Solicitud</h4>
      
      <div style="background: #f8fafc; padding: 1.25rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 1.5rem;">
        <p><strong>Fecha solicitada:</strong> {{ form.date }}</p>
        <p><strong>Servicios:</strong> {{ form.services.length > 0 ? form.services.length + ' servicio(s) seleccionado(s)' : 'Sugerencia personalizada' }}</p>
        <p v-if="form.suggestedServiceText"><strong>Sugerencia:</strong> {{ form.suggestedServiceText }}</p>
        <p v-if="form.guestName"><strong>Para invitado:</strong> {{ form.guestName }} ({{ form.guestPhone }})</p>
        <p style="color: #ec4899; font-weight: 700; margin-top: 1rem;">Monto de apartado requerido: $100 MXN</p>
      </div>
    </div>

    <!-- Botones de Navegación del Wizard -->
    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button v-if="step > 1" @click="step--" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
        Anterior
      </button>
      <div v-else></div>

      <button v-if="step < 4" @click="nextStep" type="button" style="background: #ec4899; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
        Siguiente
      </button>

      <button v-else @click="handleSubmit" :disabled="loading" type="button" style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
        {{ loading ? 'Enviando Solicitud...' : 'Confirmar y Enviar Solicitud' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBusinessStore } from '../../stores/businessStore';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { useToastStore } from '../../stores/toastStore';

const businessStore = useBusinessStore();
const appointmentStore = useAppointmentStore();
const toastStore = useToastStore();

const step = ref(1);
const stepTitles = ['Servicios', 'Fecha', 'Invitado', 'Confirmación'];
const today = new Date().toISOString().split('T')[0];

const form = ref({
  services: [] as string[],
  suggestedServiceText: '',
  date: '',
  guestName: '',
  guestPhone: '',
  notes: '',
});

const loading = ref(false);

onMounted(() => {
  businessStore.fetchCatalogServices();
});

const nextStep = () => {
  if (step.value === 1 && form.value.services.length === 0 && !form.value.suggestedServiceText) {
    toastStore.warning('Servicio requerido', {
      message: 'Elige al menos un servicio del catálogo o escribe tu sugerencia.',
    });
    return;
  }
  if (step.value === 2 && !form.value.date) {
    toastStore.warning('Fecha requerida', {
      message: 'Selecciona el día deseado para tu cita.',
    });
    return;
  }
  step.value++;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await appointmentStore.createAppointment({
      services: form.value.services,
      suggestedServiceText: form.value.suggestedServiceText,
      date: form.value.date,
      guestName: form.value.guestName || undefined,
      guestPhone: form.value.guestPhone || undefined,
    });

    toastStore.success('¡Solicitud Enviada!', {
      message: 'Tu solicitud de cita fue recibida. Te contactaremos por WhatsApp para coordinar el horario.',
      duration: 5000,
    });

    // Reset
    step.value = 1;
    form.value = { services: [], suggestedServiceText: '', date: '', guestName: '', guestPhone: '', notes: '' };
  } catch (error: any) {
    toastStore.error('Error al enviar cita', {
      message: error.message,
    });
  } finally {
    loading.value = false;
  }
};
</script>
