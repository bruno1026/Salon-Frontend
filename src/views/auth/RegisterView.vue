<template>
  <div style="max-width: 480px; margin: 2rem auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0f172a; font-weight: 800; margin-bottom: 0.5rem;">Registro de Cuenta</h2>
    <p style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">Crea tu cuenta para gestionar y reservar citas</p>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Nombre Completo</label>
        <input v-model="form.name" type="text" placeholder="Maria Lopez" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>

      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Correo Electrónico</label>
        <input v-model="form.email" type="email" placeholder="maria@ejemplo.com" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>

      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Teléfono (WhatsApp)</label>
        <input v-model="form.phone" type="text" placeholder="+5215512345678" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        <span style="font-size: 0.75rem; color: #94a3b8;">Formato internacional E.164 con código de país (ej. +521...)</span>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Contraseña</label>
        <input v-model="form.password" type="password" placeholder="Mínimo 10 caracteres (mayúscula, minúscula, número y símbolo)" required style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
      </div>

      <button type="submit" :disabled="loading" style="width: 100%; background: #ec4899; color: white; border: none; padding: 0.85rem; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer;">
        {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const form = ref({ name: '', email: '', phone: '', password: '' });
const loading = ref(false);

const apiUrl = import.meta.env.VITE_API_URL || '/api';

const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrar usuario');

    Swal.fire({
      icon: 'success',
      title: '¡Registro Exitoso!',
      text: 'Se ha enviado un código de verificación por WhatsApp a tu teléfono.',
    });

    router.push({ path: '/verify-account', query: { phone: form.value.phone } });
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error de registro', text: error.message });
  } finally {
    loading.value = false;
  }
};
</script>
