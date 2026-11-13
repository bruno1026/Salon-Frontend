<template>
  <div style="max-width: 420px; margin: 3rem auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0f172a; font-weight: 800; margin-bottom: 0.5rem;">Autenticación 2FA</h2>
    <p style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">Ingresa el código OTP de 6 dígitos recibido por WhatsApp para completar tu acceso</p>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Código 2FA</label>
        <input v-model="otp" type="text" maxlength="6" placeholder="123456" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; text-align: center; font-size: 1.25rem; letter-spacing: 0.25em;" />
      </div>

      <button type="submit" :disabled="loading" style="width: 100%; background: #ec4899; color: white; border: none; padding: 0.85rem; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer;">
        {{ loading ? 'Validando OTP...' : 'Verificar 2FA e Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();

const otp = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await authStore.verify2FA(otp.value);
    Swal.fire({ icon: 'success', title: '¡Verificación Exitosa!', timer: 1500, showConfirmButton: false });
    if (authStore.userRole === 'admin' || authStore.userRole === 'superadmin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/client/book');
    }
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error 2FA', text: error.message });
    // Al fallar, tempToken es destruido por authStore.verify2FA
    router.push('/login');
  } finally {
    loading.value = false;
  }
};
</script>
