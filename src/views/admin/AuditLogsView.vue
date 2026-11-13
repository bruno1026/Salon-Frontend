<template>
  <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1.5rem;">🛡️ Logs de Auditoría de Negocio (SuperAdmin)</h2>

    <table style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.85rem; text-transform: uppercase;">
          <th style="padding: 0.75rem 1rem;">Módulo</th>
          <th style="padding: 0.75rem 1rem;">Acción</th>
          <th style="padding: 0.75rem 1rem;">Severidad</th>
          <th style="padding: 0.75rem 1rem;">Detalle</th>
          <th style="padding: 0.75rem 1rem;">Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in mockLogs" :key="log._id" style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #334155;">{{ log.module }}</td>
          <td style="padding: 0.75rem 1rem;"><code>{{ log.action }}</code></td>
          <td style="padding: 0.75rem 1rem;">
            <span :style="{ background: severityBgMap[log.severity], color: severityColorMap[log.severity], padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }">
              {{ log.severity }}
            </span>
          </td>
          <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #64748b;">{{ JSON.stringify(log.metadata) }}</td>
          <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #94a3b8;">{{ log.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const severityBgMap: Record<string, string> = {
  success: '#dcfce7',
  info: '#dbeafe',
  warning: '#fef9c3',
  error: '#fee2e2',
};

const severityColorMap: Record<string, string> = {
  success: '#15803d',
  info: '#1d4ed8',
  warning: '#a16207',
  error: '#b91c1c',
};

const mockLogs = ref([
  { _id: '1', module: 'auth', action: 'user_created', severity: 'success', metadata: { role: 'user', email: 'carlos.gomez@example.com' }, date: '2026-08-18 16:18' },
  { _id: '2', module: 'auth', action: 'login', severity: 'success', metadata: { role: 'superadmin' }, date: '2026-08-18 16:15' },
  { _id: '3', module: 'appointments', action: 'appointment_confirmed', severity: 'success', metadata: { time: '14:00', totalDuration: 90 }, date: '2026-08-18 16:28' },
  { _id: '4', module: 'appointments', action: 'appointment_cancelled', severity: 'warning', metadata: { reason: 'no_show' }, date: '2026-08-18 16:28' },
]);
</script>
