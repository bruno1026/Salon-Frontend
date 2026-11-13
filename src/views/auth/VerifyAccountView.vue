<template>
  <div style="max-width: 420px; margin: 3rem auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0f172a; font-weight: 800; margin-bottom: 0.5rem;">Verificar Cuenta</h2>
    <p style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">Ingresa el código OTP de 6 dígitos enviado a tu WhatsApp ({{ phone }})</p>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Código OTP (6 dígitos)</label>
        <input v-model="otp" type="text" maxlength="6" placeholder="123456" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; text-align: center; font-size: 1.25rem; letter-spacing: 0.25em;" />
      </div>

      <button type="submit" :disabled="loading" style="width: 100%; background: #ec4899; color: white; border: none; padding: 0.85rem; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer;">
        {{ loading ? 'Verificando...' : 'Confirmar Cuenta' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const phone = ref((route.query.phone as string) || '');
const otp = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await authStore.verifyAccount(phone.value, otp.value);
    Swal.fire({
      icon: 'success',
      title: '¡Cuenta Verificada!',
      text: 'Tu teléfono ha sido verificado. Ya puedes iniciar sesión.',
      timer: 2000,
      showConfirmButton: false,
    });
    router.push('/login');
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error de verificación', text: error.message });
  } finally {
    loading.value = false;
  }
};
</script>
