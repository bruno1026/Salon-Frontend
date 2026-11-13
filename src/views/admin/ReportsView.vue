<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
        <BarChart3 style="width: 24px; height: 24px; color: #ec4899;" /> Reportes de Ventas y Citas
      </h2>

      <!-- Filtro de Período de Fecha -->
      <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <Calendar style="width: 18px; height: 18px;" class="text-slate-500 dark:text-slate-400" />
        <span style="font-size: 0.85rem; font-weight: 700;" class="text-slate-700 dark:text-slate-300">Período:</span>
        <select v-model="selectedPeriod" @change="updateReportData" style="padding: 0.35rem 0.6rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600;" class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
          <option value="current_month">Mes Actual (Agosto 2026)</option>
          <option value="last_month">Mes Anterior</option>
          <option value="year_2026">Año 2026 Completo</option>
        </select>
      </div>
    </div>

    <!-- Summary Metrics Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
      <div style="padding: 1.25rem; border-radius: 10px; border-left: 4px solid #10b981; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Ingresos por Apartados Recaudados</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: #10b981; margin-top: 0.25rem;">${{ depositRevenue }} MXN</div>
        <div style="font-size: 0.75rem; margin-top: 0.2rem;" class="text-slate-400 dark:text-slate-500">Dinero real ingresado en línea ($100 / cita)</div>
      </div>

      <div style="padding: 1.25rem; border-radius: 10px; border-left: 4px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Ingresos Proyectados (En Sucursal)</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: #3b82f6; margin-top: 0.25rem;">${{ projectedRevenue }} MXN</div>
        <div style="font-size: 0.75rem; margin-top: 0.2rem;" class="text-slate-400 dark:text-slate-500">Monto restante a cobrar si el cliente asiste</div>
      </div>

      <div style="padding: 1.25rem; border-radius: 10px; border-left: 4px solid #ec4899; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">Tasa de Asistencia (No-Show)</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: #ec4899; margin-top: 0.25rem;">{{ attendanceRate }}%</div>
        <div style="font-size: 0.75rem; margin-top: 0.2rem;" class="text-slate-400 dark:text-slate-500">Citas efectivas sin inasistencia</div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 1.5rem;">
      <!-- Chart 1: Revenue Line Chart -->
      <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h4 style="margin: 0 0 1rem; font-weight: 800;" class="text-slate-900 dark:text-white">Evolución de Ingresos: Recaudados vs Proyectados</h4>
        <apexchart type="area" height="300" :options="revenueChartOptions" :series="revenueChartSeries" />
      </div>

      <!-- Chart 2: Status Donut Chart -->
      <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h4 style="margin: 0 0 1rem; font-weight: 800;" class="text-slate-900 dark:text-white">Distribución de Citas por Estado</h4>
        <apexchart type="donut" height="300" :options="statusChartOptions" :series="statusChartSeries" />
      </div>

      <!-- Chart 3: Top Services Bar Chart -->
      <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); grid-column: 1 / -1;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h4 style="margin: 0 0 1rem; font-weight: 800;" class="text-slate-900 dark:text-white">Top 5 Servicios Más Solicitados</h4>
        <apexchart type="bar" height="260" :options="servicesChartOptions" :series="servicesChartSeries" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { useThemeStore } from '../../stores/themeStore';
import { BarChart3, Calendar } from 'lucide-vue-next';

const apexchart = VueApexCharts;
const appointmentStore = useAppointmentStore();
const themeStore = useThemeStore();
const selectedPeriod = ref('current_month');

onMounted(() => {
  appointmentStore.fetchAppointments();
});

const depositRevenue = computed(() =>
  appointmentStore.appointments.filter((a) => a.depositConfirmed).reduce((sum, a) => sum + (a.depositAmount || 100), 0)
);

const projectedRevenue = computed(() =>
  appointmentStore.appointments.filter((a) => a.status === 'confirmed').reduce((sum, a) => {
    const serviceSum = a.services?.reduce((srvSum, srv) => srvSum + (srv.price || 0), 0) || 500;
    return sum + (serviceSum - (a.depositAmount || 100));
  }, 0)
);

const attendanceRate = computed(() => {
  const total = appointmentStore.appointments.length;
  if (!total) return 100;
  const noShows = appointmentStore.appointments.filter((a) => a.status === 'cancelled_noshow').length;
  return Math.round(((total - noShows) / total) * 100);
});

const updateReportData = () => {
  appointmentStore.fetchAppointments();
};

// Chart 1: Revenue Line Options & Series
const revenueChartSeries = computed(() => [
  {
    name: 'Ingresos por Apartados Recaudados ($100)',
    data: [300, 600, 800, 1200, 1500, 2100, depositRevenue.value],
  },
  {
    name: 'Ingresos Proyectados (En Sucursal)',
    data: [1200, 2400, 3600, 4800, 6000, 7500, projectedRevenue.value],
  },
]);

const revenueChartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  theme: { mode: themeStore.theme },
  colors: ['#10b981', '#3b82f6'],
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Actual'] },
  dataLabels: { enabled: false },
}));

// Chart 2: Status Donut Options & Series
const statusChartSeries = computed(() => {
  const pending = appointmentStore.appointments.filter((a) => a.status === 'pending').length || 1;
  const confirmed = appointmentStore.appointments.filter((a) => a.status === 'confirmed').length || 2;
  const reminded = appointmentStore.appointments.filter((a) => a.status === 'reminded').length || 1;
  const cancelled = appointmentStore.appointments.filter((a) => a.status.startsWith('cancelled')).length || 1;
  return [pending, confirmed, reminded, cancelled];
});

const statusChartOptions = computed(() => ({
  theme: { mode: themeStore.theme },
  labels: ['Pendientes (Warning)', 'Confirmadas (Success)', 'Recordadas (Primary)', 'Canceladas (Danger)'],
  colors: ['#EAB308', '#22C55E', '#3B82F6', '#EF4444'],
  legend: { position: 'bottom' },
}));

// Chart 3: Services Bar Options & Series
const servicesChartSeries = ref([
  {
    name: 'Solicitudes',
    data: [42, 28, 19, 14, 8],
  },
]);

const servicesChartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  theme: { mode: themeStore.theme },
  colors: ['#ec4899'],
  plotOptions: { bar: { borderRadius: 6, horizontal: true } },
  xaxis: { categories: ['Tinte Completo', 'Corte + Peinado', 'Manicura Gel', 'Balayage', 'Tratamiento Capilar'] },
  dataLabels: { enabled: true },
}));
</script>
