import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface UserPermission {
  _id: string;
  module: string;
  action: string;
  description?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'superadmin' | 'admin' | 'user';
  permissions: UserPermission[];
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  verified: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const tempToken = ref<string | null>(sessionStorage.getItem('tempToken'));
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const userRole = computed(() => user.value?.role || 'guest');

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  /**
   * SILENT REFRESH al arrancar la aplicación
   * Intenta refrescar la sesión vía cookie HttpOnly antes de la primera navegación.
   * REQUERIDO: credentials: 'include' para enviar cookies cross-origin (port 5173 -> port 3005)
   */
  const initAuth = async (): Promise<boolean> => {
    if (isInitialized.value) return isAuthenticated.value;
    try {
      const res = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        accessToken.value = data.accessToken;
        await fetchProfile();
      }
    } catch (e) {
      // Ignorar si no hay cookie de refresh válida
    } finally {
      isInitialized.value = true;
    }
    return isAuthenticated.value;
  };

  /**
   * Obtiene el perfil actualizado del usuario autenticado
   */
  const fetchProfile = async (): Promise<void> => {
    if (!accessToken.value) return;
    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken.value}` },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        user.value = data.user;
      } else {
        logout();
      }
    } catch (e) {
      logout();
    }
  };

  /**
   * Login
   */
  const login = async (identifier: string, password: string) => {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier, password }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('No se pudo establecer comunicación con el backend (Puerto 3005). Intenta de nuevo.');
    }

    if (!res.ok) {
      throw new Error(data?.error || 'Error al iniciar sesión');
    }

    if (data.require2FA) {
      tempToken.value = data.tempToken;
      sessionStorage.setItem('tempToken', data.tempToken);
      return { require2FA: true };
    }

    accessToken.value = data.accessToken;
    user.value = data.user;
    return { require2FA: false };
  };

  /**
   * Verificación 2FA (destruye tempToken en sessionStorage tanto en éxito como en fallo)
   */
  const verify2FA = async (otp: string) => {
    const token = tempToken.value || sessionStorage.getItem('tempToken');
    if (!token) {
      throw new Error('Token temporal de 2FA no encontrado. Por favor inicia sesión de nuevo.');
    }

    try {
      const res = await fetch(`${apiUrl}/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tempToken: token, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Código OTP de 2FA incorrecto');
      }

      accessToken.value = data.accessToken;
      user.value = data.user;
      return data;
    } finally {
      // Destruir siempre el tempToken de sessionStorage tras el intento
      tempToken.value = null;
      sessionStorage.removeItem('tempToken');
    }
  };

  /**
   * Confirmación OTP de verificación de cuenta
   */
  const verifyAccount = async (phone: string, otp: string) => {
    const res = await fetch(`${apiUrl}/auth/verify-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al verificar cuenta');
    return data;
  };

  /**
   * Cierre de sesión
   */
  const logout = async () => {
    if (accessToken.value) {
      try {
        await fetch(`${apiUrl}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken.value}` },
          credentials: 'include',
        });
      } catch (e) {
        // Ignorar
      }
    }
    user.value = null;
    accessToken.value = null;
    tempToken.value = null;
    sessionStorage.removeItem('tempToken');
  };

  /**
   * Verificación dinámica de permisos granulares
   */
  const hasPermission = (moduleName: string, actionName: string): boolean => {
    if (!user.value) return false;
    if (user.value.role === 'superadmin') return true;
    return (user.value.permissions || []).some(
      (p) => p.module === moduleName && p.action === actionName
    );
  };

  return {
    user,
    accessToken,
    tempToken,
    isInitialized,
    isAuthenticated,
    userRole,
    initAuth,
    fetchProfile,
    login,
    verify2FA,
    verifyAccount,
    logout,
    hasPermission,
  };
});
