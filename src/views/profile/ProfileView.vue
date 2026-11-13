<template>
  <div style="max-width: 960px; margin: 0 auto; padding: 1rem;">
    <!-- Page Title -->
    <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="margin: 0; font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
        <User style="width: 28px; height: 28px; color: #ec4899;" /> Mi Perfil de Usuario
      </h2>
      <span style="font-size: 0.85rem; padding: 0.3rem 0.75rem; border-radius: 9999px; font-weight: 700; background: #ec4899; color: white;">
        {{ authStore.user?.role?.toUpperCase() || 'USUARIO' }}
      </span>
    </div>

    <!-- 1. Header Card (Avatar + Edit) -->
    <div style="border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
        <!-- Avatar Wrapper -->
        <div style="position: relative;">
          <div style="width: 96px; height: 96px; border-radius: 50%; overflow: hidden; border: 3px solid #ec4899; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;" />
            <span v-else style="font-size: 2.2rem; font-weight: 800; color: #ec4899;">
              {{ (authStore.user?.name || 'U').charAt(0).toUpperCase() }}
            </span>
          </div>

          <!-- Botón flotante Editar Avatar -->
          <label style="position: absolute; bottom: 0; right: 0; background: #ec4899; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" title="Cambiar foto de perfil (Cloudinary)">
            <Camera style="width: 16px; height: 16px;" />
            <input type="file" accept="image/png, image/jpeg, image/webp" @change="handleAvatarUpload" style="display: none;" />
          </label>
        </div>

        <div style="flex: 1;">
          <h3 style="margin: 0 0 0.3rem 0; font-size: 1.25rem; font-weight: 800;" class="text-slate-900 dark:text-white">
            {{ authStore.user?.name }}
          </h3>
          <p style="margin: 0; font-size: 0.9rem;" class="text-slate-500 dark:text-slate-400">
            {{ authStore.user?.email }} &bull; <span style="font-weight: 600;">{{ authStore.user?.phone }}</span>
          </p>
          <div v-if="uploadingAvatar" style="font-size: 0.8rem; color: #ec4899; font-weight: 700; margin-top: 0.5rem;">
            ⏳ Subiendo foto de perfil a Cloudinary...
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Información del Perfil (Editar Nombre) -->
    <div style="border-radius: 12px; padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 style="margin-top: 0; font-size: 1.1rem; font-weight: 800; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
        <UserCheck style="width: 20px; height: 20px; color: #ec4899;" /> Información Personal
      </h3>

      <form @submit.prevent="handleSaveProfile">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
          <!-- Nombre Editable -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Nombre Completo</label>
            <input v-model="nameForm" type="text" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>

          <!-- Email Lectura -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Correo Electrónico (No editable)</label>
            <input :value="authStore.user?.email" type="email" disabled style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; opacity: 0.7; cursor: not-allowed; box-sizing: border-box;" class="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400" />
          </div>

          <!-- Teléfono Lectura -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Teléfono WhatsApp / 2FA (No editable)</label>
            <input :value="authStore.user?.phone" type="text" disabled style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; opacity: 0.7; cursor: not-allowed; box-sizing: border-box;" class="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400" />
          </div>

          <!-- Rol Lectura -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Rol de Usuario</label>
            <input :value="authStore.user?.role" type="text" disabled style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; opacity: 0.7; cursor: not-allowed; box-sizing: border-box;" class="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" style="background: #ec4899; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
            <Save style="width: 18px; height: 18px;" /> Guardar Nombre
          </button>
        </div>
      </form>
    </div>

    <!-- 3. Sección de Seguridad (Cambiar Contraseña) -->
    <div style="border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 style="margin-top: 0; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
        <ShieldCheck style="width: 20px; height: 20px; color: #ec4899;" /> Seguridad & Contraseña
      </h3>
      <p style="margin: 0 0 1.25rem 0; font-size: 0.85rem;" class="text-slate-500 dark:text-slate-400">
        Cambiar tu contraseña invalidará automáticamente todas las demás sesiones activas en otros dispositivos por seguridad.
      </p>

      <form @submit.prevent="handleChangePassword">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1rem;">
          <!-- Contraseña Actual -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Contraseña Actual</label>
            <input v-model="passForm.currentPassword" type="password" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>

          <!-- Nueva Contraseña -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
            <input v-model="passForm.newPassword" type="password" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>

          <!-- Confirmar Nueva Contraseña -->
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Confirmar Nueva Contraseña</label>
            <input v-model="passForm.confirmPassword" type="password" required style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>
        </div>

        <!-- Checklist Validación Contraseña -->
        <div style="background: #f8fafc; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.8rem;" class="dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
          <span style="font-weight: 700; display: block; margin-bottom: 0.4rem;" class="text-slate-800 dark:text-slate-200">Requisitos de la nueva contraseña:</span>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.4rem;">
            <span :style="{ color: isMinLen ? '#10b981' : '#64748b' }">{{ isMinLen ? '✓' : '○' }} Mínimo 10 caracteres</span>
            <span :style="{ color: hasUpper ? '#10b981' : '#64748b' }">{{ hasUpper ? '✓' : '○' }} Al menos 1 Mayúscula</span>
            <span :style="{ color: hasLower ? '#10b981' : '#64748b' }">{{ hasLower ? '✓' : '○' }} Al menos 1 Minúscula</span>
            <span :style="{ color: hasNum ? '#10b981' : '#64748b' }">{{ hasNum ? '✓' : '○' }} Al menos 1 Número</span>
            <span :style="{ color: hasSymbol ? '#10b981' : '#64748b' }">{{ hasSymbol ? '✓' : '○' }} Símbolo (@$!%*?&)</span>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" style="background: #0f172a; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" class="dark:bg-slate-700 dark:hover:bg-slate-600">
            <Lock style="width: 18px; height: 18px;" /> Actualizar Contraseña
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { uploadImageToCloudinary } from '../../utils/cloudinaryUpload';
import { User, Camera, UserCheck, Save, ShieldCheck, Lock } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_API_URL || '/api';

const nameForm = ref('');
const uploadingAvatar = ref(false);

const passForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

onMounted(() => {
  if (authStore.user?.name) {
    nameForm.value = authStore.user.name;
  }
});

// Validaciones reactivas de contraseña
const isMinLen = computed(() => passForm.value.newPassword.length >= 10);
const hasUpper = computed(() => /[A-Z]/.test(passForm.value.newPassword));
const hasLower = computed(() => /[a-z]/.test(passForm.value.newPassword));
const hasNum = computed(() => /\d/.test(passForm.value.newPassword));
const hasSymbol = computed(() => /[@$!%*?&]/.test(passForm.value.newPassword));

const handleAvatarUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  uploadingAvatar.value = true;
  try {
    const data = await uploadImageToCloudinary(file);

    // Guardar URL de avatar en perfil de usuario vía API
    const res = await fetch(`${apiUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ avatar: data.url }),
    });

    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Error al guardar avatar');

    if (authStore.user) {
      authStore.user.avatar = data.url;
    }

    Swal.fire({ icon: 'success', title: 'Foto de perfil actualizada', timer: 1500, showConfirmButton: false });
  } catch (err: any) {
    Swal.fire('Error', err.message, 'error');
  } finally {
    uploadingAvatar.value = false;
  }
};

const handleSaveProfile = async () => {
  try {
    const res = await fetch(`${apiUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ name: nameForm.value }),
    });

    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Error al guardar perfil');

    if (authStore.user) {
      authStore.user.name = nameForm.value;
    }

    Swal.fire({ icon: 'success', title: 'Nombre actualizado exitosamente', timer: 1500, showConfirmButton: false });
  } catch (err: any) {
    Swal.fire('Error', err.message, 'error');
  }
};

const handleChangePassword = async () => {
  if (passForm.value.newPassword !== passForm.value.confirmPassword) {
    Swal.fire('Error', 'La nueva contraseña y la confirmación no coinciden.', 'error');
    return;
  }

  if (!isMinLen.value || !hasUpper.value || !hasLower.value || !hasNum.value || !hasSymbol.value) {
    Swal.fire('Error', 'La nueva contraseña no cumple con todos los requisitos de seguridad.', 'error');
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: passForm.value.currentPassword,
        newPassword: passForm.value.newPassword,
      }),
    });

    const text = await res.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch (e) {}

    if (!res.ok) throw new Error(data.error || 'Error al cambiar contraseña');

    Swal.fire({
      icon: 'success',
      title: '🔒 Contraseña Actualizada',
      text: data.message || 'Todas las demás sesiones activas han sido cerradas por seguridad.',
    });

    passForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err: any) {
    Swal.fire('Error', err.message, 'error');
  }
};
</script>
