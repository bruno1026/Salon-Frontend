<template>
  <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1.5rem;">⚡ Gestor de Sesiones Activas (Redis)</h2>

    <table style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.85rem; text-transform: uppercase;">
          <th style="padding: 0.75rem 1rem;">Usuario</th>
          <th style="padding: 0.75rem 1rem;">Rol</th>
          <th style="padding: 0.75rem 1rem;">Fecha Login</th>
          <th style="padding: 0.75rem 1rem;">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in mockSessions" :key="s.sessionId" style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #334155;">{{ s.name }} ({{ s.email }})</td>
          <td style="padding: 0.75rem 1rem;">
            <span style="background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #475569;">
              {{ s.role }}
            </span>
          </td>
          <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #64748b;">{{ s.loginAt }}</td>
          <td style="padding: 0.75rem 1rem;">
            <button @click="handleForceClose(s.sessionId)" style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.8rem; font-weight: 700; cursor: pointer;">
              Forzar Cierre
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';

const mockSessions = ref([
  { sessionId: 'sess_123', name: 'SuperAdmin Principal', email: 'superadmin@appsalon.com', role: 'superadmin', loginAt: '2026-08-18 16:15' },
  { sessionId: 'sess_456', name: 'Carlos Gomez', email: 'carlos.gomez@example.com', role: 'user', loginAt: '2026-08-18 16:18' },
]);

const handleForceClose = (sessionId: string) => {
  Swal.fire({
    title: '¿Forzar Cierre de Sesión?',
    text: 'Se invalidará el refresh token y se desconectará al usuario.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, cerrar sesión',
  }).then((result) => {
    if (result.isConfirmed) {
      mockSessions.value = mockSessions.value.filter((s) => s.sessionId !== sessionId);
      Swal.fire('Sesión Cerrada', 'La sesión fue revocada en Redis.', 'success');
    }
  });
};
</script>
