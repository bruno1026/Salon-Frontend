<template>
  <div style="max-width: 420px; margin: 3rem auto; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    <h2 style="text-align: center; font-weight: 800; margin-bottom: 0.5rem;" class="text-slate-900 dark:text-white">Iniciar Sesión</h2>
    <p style="text-align: center; font-size: 0.9rem; margin-bottom: 2rem;" class="text-slate-500 dark:text-slate-400">Accede a tu cuenta de AppSalon 2.0</p>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;" class="text-slate-700 dark:text-slate-300">Correo o Teléfono</label>
        <input v-model="form.identifier" type="text" placeholder="ejemplo@correo.com o +521..." required style="width: 100%; padding: 0.75rem; border-radius: 6px; box-sizing: border-box;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;" class="text-slate-700 dark:text-slate-300">Contraseña</label>
        <input v-model="form.password" type="password" placeholder="••••••••" required style="width: 100%; padding: 0.75rem; border-radius: 6px; box-sizing: border-box;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
      </div>

      <button type="submit" :disabled="loading" style="width: 100%; background: #ec4899; color: white; border: none; padding: 0.85rem; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer;">
        {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
      </button>
    </form>

    <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem;" class="text-slate-500 dark:text-slate-400">
      ¿No tienes cuenta? <router-link to="/register" style="color: #ec4899; font-weight: 700; text-decoration: none;">Regístrate aquí</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({ identifier: '', password: '' });
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await authStore.login(form.value.identifier, form.value.password);
    if (res.require2FA) {
      Swal.fire({
        icon: 'info',
        title: 'Verificación 2FA requerida',
        text: 'Se ha enviado un código de 6 dígitos a tu WhatsApp.',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push('/verify-2fa');
    } else {
      Swal.fire({ icon: 'success', title: '¡Bienvenido!', timer: 1500, showConfirmButton: false });
      if (authStore.userRole === 'admin' || authStore.userRole === 'superadmin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/client/book');
      }
    }
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error de inicio de sesión', text: error.message });
  } finally {
    loading.value = false;
  }
};
</script>
