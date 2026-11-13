<template>
  <div style="display: flex; height: 100vh; overflow: hidden; background-color: #f1f5f9; font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;">
    <!-- TailAdmin Sidebar -->
    <aside ref="sidebarRef" :style="{ width: isSidebarCollapsed ? '80px' : '260px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 30, height: '100vh', overflow: 'hidden' }">
      <!-- Logo Header -->
      <div style="padding: 1.25rem; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden;">
          <Scissors style="width: 24px; height: 24px; color: #ec4899; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed" style="font-size: 1.1rem; font-weight: 800; color: white; white-space: nowrap;">AppSalon 2.0</span>
        </div>
      </div>

      <!-- Menú Dinámico filtrado por checkPermission -->
      <nav style="padding: 1.25rem 0.75rem; display: flex; flex-direction: column; gap: 0.35rem; flex: 1; overflow-y: auto;">
        
        <!-- SECCIÓN: GENERAL -->
        <div v-if="!isSidebarCollapsed" style="padding: 0.5rem 0.75rem 0.25rem; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
          General
        </div>

        <router-link to="/admin/dashboard" class="nav-item" :title="isSidebarCollapsed ? 'Dashboard' : ''">
          <LayoutDashboard style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Dashboard & Calendario</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('appointments', 'view')" to="/admin/appointments" class="nav-item" :title="isSidebarCollapsed ? 'Listado de Citas' : ''">
          <CalendarDays style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Listado de Citas</span>
        </router-link>

        <!-- SUBMENÚ DESPLEGABLE: INVENTARIO (PRODUCTOS) -->
        <div v-if="authStore.hasPermission('products', 'view') || authStore.hasPermission('services', 'view')">
          <button @click="isInventoryOpen = !isInventoryOpen" class="nav-item" style="width: 100%; border: none; background: transparent; color: white; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <Package style="width: 20px; height: 20px; flex-shrink: 0;" />
              <span v-if="!isSidebarCollapsed" style="font-weight: 600; font-size: 0.9rem;">Inventario (Productos)</span>
            </div>
            <ChevronDown v-if="!isSidebarCollapsed" :style="{ transform: isInventoryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', width: '16px', height: '16px' }" />
          </button>

          <div v-if="isInventoryOpen && !isSidebarCollapsed" style="padding-left: 1.75rem; display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.2rem;">
            <router-link to="/admin/products" class="nav-item-sub">
              ├─ Productos
            </router-link>
            <router-link v-if="authStore.hasPermission('products', 'manage_offers')" to="/admin/products/offers" class="nav-item-sub">
              ├─ Ofertas
            </router-link>
            <router-link v-if="authStore.hasPermission('orders', 'view')" to="/admin/products/sales" class="nav-item-sub">
              ├─ Ventas
            </router-link>
            <router-link to="/admin/product-categories" class="nav-item-sub">
              └─ Categorías de Productos
            </router-link>
          </div>
        </div>

        <!-- SUBMENÚ DESPLEGABLE: CATÁLOGO (SERVICIOS) -->
        <div v-if="authStore.hasPermission('services', 'view')">
          <button @click="isServicesOpen = !isServicesOpen" class="nav-item" style="width: 100%; border: none; background: transparent; color: white; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <Scissors style="width: 20px; height: 20px; flex-shrink: 0;" />
              <span v-if="!isSidebarCollapsed" style="font-weight: 600; font-size: 0.9rem;">Catálogo (Servicios)</span>
            </div>
            <ChevronDown v-if="!isSidebarCollapsed" :style="{ transform: isServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', width: '16px', height: '16px' }" />
          </button>

          <div v-if="isServicesOpen && !isSidebarCollapsed" style="padding-left: 1.75rem; display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.2rem;">
            <router-link to="/admin/services" class="nav-item-sub">
              ├─ Servicios
            </router-link>
            <router-link to="/admin/service-categories" class="nav-item-sub">
              └─ Categorías de Servicios
            </router-link>
          </div>
        </div>

        <router-link v-if="authStore.hasPermission('services', 'view')" to="/admin/orders" class="nav-item" :title="isSidebarCollapsed ? 'Órdenes E-Commerce' : ''">
          <ShoppingCart style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Órdenes E-Commerce</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('reports', 'view')" to="/admin/reports" class="nav-item" :title="isSidebarCollapsed ? 'Reportes de Ventas' : ''">
          <BarChart3 style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Reportes de Ventas</span>
        </router-link>

        <!-- SECCIÓN: ADMINISTRACIÓN -->
        <div v-if="!isSidebarCollapsed" style="margin-top: 1.25rem; padding: 0.5rem 0.75rem 0.25rem; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
          Administración
        </div>

        <router-link v-if="authStore.hasPermission('admin', 'users')" to="/admin/users" class="nav-item" :title="isSidebarCollapsed ? 'Usuarios y Personal' : ''">
          <Users style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Usuarios y Personal</span>
        </router-link>

        <router-link v-if="authStore.userRole === 'superadmin'" to="/admin/audit-logs" class="nav-item" :title="isSidebarCollapsed ? 'Logs de Auditoría' : ''">
          <ShieldAlert style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Logs de Auditoría</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('landing', 'edit')" to="/admin/landing" class="nav-item" :title="isSidebarCollapsed ? 'Landing / Publicidad' : ''">
          <Globe style="width: 20px; height: 20px; flex-shrink: 0;" />
          <span v-if="!isSidebarCollapsed">Landing / Publicidad</span>
        </router-link>
      </nav>

      <!-- User Profile Summary at bottom of sidebar -->
      <div style="padding: 1rem; border-top: 1px solid #1e293b; flex-shrink: 0;">
        <button @click="handleLogout" style="width: 100%; background: #ef4444; color: white; border: none; padding: 0.65rem; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <LogOut style="width: 18px; height: 18px;" />
          <span v-if="!isSidebarCollapsed">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area with independent overflow scroll -->
    <div style="flex: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; min-width: 0;" class="bg-slate-50 dark:bg-slate-900">
      <!-- TailAdmin Header Bar -->
      <header style="height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; position: sticky; top: 0; z-index: 20; flex-shrink: 0;" class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <!-- Left: Toggle Sidebar + Search Bar -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button @click="toggleSidebar" style="background: transparent; border: none; cursor: pointer; display: flex; align-items: center; padding: 0.5rem; border-radius: 6px;" class="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" title="Colapsar / Expandir Sidebar">
            <Menu style="width: 22px; height: 22px;" />
          </button>

          <!-- Search bar ⌘K style -->
          <div style="position: relative; width: 280px; display: flex; align-items: center;">
            <Search style="position: absolute; left: 0.75rem; width: 16px; height: 16px; color: #94a3b8;" />
            <input type="text" placeholder="Buscar citas, cliente o personal (⌘K)..." style="width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.25rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; background: #f8fafc; outline: none;" />
          </div>
        </div>

        <!-- Right: Theme Toggle + Notifications Dropdown + Profile Dropdown -->
        <div style="display: flex; align-items: center; gap: 1rem; position: relative;">
          <!-- Toggle Modo Oscuro / Claro (Animado GSAP) -->
          <button ref="themeBtnRef" @click="handleToggleTheme" style="border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400" :title="themeStore.theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'">
            <Sun v-if="themeStore.theme === 'dark'" style="width: 20px; height: 20px;" />
            <Moon v-else style="width: 20px; height: 20px;" />
          </button>

          <!-- Campana de Notificaciones Persistente (AuditLog + Socket.io) -->
          <div style="position: relative;">
            <button @click="toggleNotifications" style="border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; position: relative; display: flex; align-items: center;" class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" title="Notificaciones de Negocio">
              <Bell style="width: 20px; height: 20px;" />
              <span v-if="unreadCount > 0" style="position: absolute; top: -2px; right: -2px; background: #ef4444; color: white; border-radius: 9999px; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.4rem;">
                {{ unreadCount }}
              </span>
            </button>

            <!-- Dropdown Notificaciones animado con GSAP -->
            <div v-if="showNotifications" ref="notifDropdownRef" style="position: absolute; right: 0; top: 48px; width: 340px; border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); z-index: 50; padding: 1rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;" class="dark:border-slate-700">
                <h4 style="margin: 0; font-weight: 700; font-size: 0.9rem;" class="text-slate-900 dark:text-white">Notificaciones de Citas</h4>
                <span style="font-size: 0.75rem;" class="text-slate-500 dark:text-slate-400">{{ notifications.length }} recientes</span>
              </div>

              <div style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
                <div v-for="n in notifications" :key="n._id" style="padding: 0.6rem; border-radius: 6px; font-size: 0.8rem; border-left: 3px solid #3b82f6;" class="bg-slate-50 dark:bg-slate-900">
                  <div style="font-weight: 700;" class="text-slate-800 dark:text-slate-200">{{ n.action }}</div>
                  <div style="font-size: 0.75rem; margin-top: 0.2rem;" class="text-slate-500 dark:text-slate-400">{{ JSON.stringify(n.metadata) }}</div>
                  <div style="font-size: 0.7rem; margin-top: 0.2rem;" class="text-slate-400 dark:text-slate-500">{{ new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</div>
                </div>
                <div v-if="notifications.length === 0" style="text-align: center; font-size: 0.8rem; padding: 1rem;" class="text-slate-400 dark:text-slate-500">Sin notificaciones recientes.</div>
              </div>
            </div>
          </div>

          <!-- Perfil Dropdown animado con GSAP -->
          <div style="position: relative;">
            <button @click="toggleProfile" style="display: flex; align-items: center; gap: 0.5rem; background: transparent; border: none; cursor: pointer; padding: 0.25rem;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: #ec4899; color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; overflow: hidden;">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                <span v-else>{{ authStore.user?.name?.charAt(0) || 'U' }}</span>
              </div>
              <div style="text-align: left;">
                <div style="font-size: 0.85rem; font-weight: 700;" class="text-slate-800 dark:text-slate-200">{{ authStore.user?.name }}</div>
                <div style="font-size: 0.7rem; text-transform: uppercase;" class="text-slate-500 dark:text-slate-400">{{ authStore.userRole }}</div>
              </div>
              <ChevronDown style="width: 16px; height: 16px;" class="text-slate-500 dark:text-slate-400" />
            </button>

            <div v-if="showProfile" ref="profileDropdownRef" style="position: absolute; right: 0; top: 48px; width: 200px; border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); z-index: 50; padding: 0.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid #f1f5f9; font-size: 0.8rem;" class="text-slate-500 dark:text-slate-400 dark:border-slate-700">
                {{ authStore.user?.email }}
              </div>
              <router-link to="/admin/profile" @click="showProfile = false" style="width: 100%; text-align: left; background: transparent; border: none; padding: 0.6rem 0.75rem; font-weight: 600; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; text-decoration: none;" class="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                <User style="width: 16px; height: 16px; color: #ec4899;" /> Mi Perfil
              </router-link>
              <button @click="handleLogout" style="width: 100%; text-align: left; background: transparent; border: none; padding: 0.6rem 0.75rem; color: #ef4444; font-weight: 600; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" class="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                <LogOut style="width: 16px; height: 16px;" /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- View Transition Content -->
      <main style="padding: 1.5rem; flex: 1;">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import io, { Socket } from 'socket.io-client';
import {
  Scissors,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  ShieldAlert,
  Globe,
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  ChevronDown,
  LogOut,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();

const themeBtnRef = ref<HTMLElement | null>(null);

const handleToggleTheme = () => {
  themeStore.toggleTheme();
  if (themeBtnRef.value) {
    gsap.fromTo(themeBtnRef.value, { rotate: 0, scale: 0.7 }, { rotate: 360, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
  }
};

const isSidebarCollapsed = ref(false);
const showNotifications = ref(false);
const showProfile = ref(false);

const isInventoryOpen = ref(true);
const isServicesOpen = ref(true);

const notifDropdownRef = ref<HTMLElement | null>(null);
const profileDropdownRef = ref<HTMLElement | null>(null);

const notifications = ref<any[]>([]);
const unreadCount = ref(0);

const apiUrl = import.meta.env.VITE_API_URL || '/api';
let socket: Socket | null = null;

onMounted(() => {
  fetchAuditLogNotifications();
  initSocketListener();
});

/**
 * Carga persistente de notificaciones mediante AuditLog API (remueve lista efímera de memoria)
 */
const fetchAuditLogNotifications = async () => {
  if (!authStore.accessToken) return;
  try {
    const res = await fetch(`${apiUrl}/audit-logs?module=appointments&limit=20`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      notifications.value = data.logs || [];
      calculateUnread();
    }
  } catch (e) {
    // Ignorar
  }
};

const calculateUnread = () => {
  const lastSeen = localStorage.getItem('lastSeenNotificationAt') || '0';
  unreadCount.value = notifications.value.filter(
    (n) => new Date(n.createdAt).getTime() > parseInt(lastSeen)
  ).length;
};

const initSocketListener = () => {
  if (socket) return;
  socket = io({ credentials: true });

  socket.on('appointment:created', (data) => {
    notifications.value.unshift({
      _id: `notif_${Date.now()}`,
      action: 'appointment_created',
      metadata: data,
      createdAt: new Date().toISOString(),
    });
    calculateUnread();
  });

  socket.on('appointment:confirmed', (data) => {
    notifications.value.unshift({
      _id: `notif_${Date.now()}`,
      action: 'appointment_confirmed',
      metadata: data,
      createdAt: new Date().toISOString(),
    });
    calculateUnread();
  });
};

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    unreadCount.value = 0;
    localStorage.setItem('lastSeenNotificationAt', Date.now().toString());
    nextTick(() => {
      if (notifDropdownRef.value) {
        gsap.fromTo(notifDropdownRef.value, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
      }
    });
  }
};

const toggleProfile = () => {
  showProfile.value = !showProfile.value;
  if (showProfile.value) {
    nextTick(() => {
      if (profileDropdownRef.value) {
        gsap.fromTo(profileDropdownRef.value, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
      }
    });
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.nav-item {
  color: #cbd5e1;
  text-decoration: none;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.nav-item:hover, .router-link-active.nav-item {
  background: #1e293b;
  color: #ec4899;
}
.nav-item-sub {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.nav-item-sub:hover, .router-link-active.nav-item-sub {
  color: #ec4899;
  background: #1e293b;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
