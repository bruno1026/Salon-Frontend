<template>
  <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <!-- Datatable 3 Header Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
        <Users style="width: 24px; height: 24px; color: #ec4899;" /> Usuarios y Personal (Datatable 3)
      </h2>

      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <!-- Toggle Ver Inactivos (Soft Deleted) -->
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer;">
          <input type="checkbox" v-model="showInactive" @change="fetchUsers" />
          <span>Mostrar Inactivos (Baja Lógica)</span>
        </label>

        <!-- Selector filas por página -->
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #64748b; font-weight: 600;">
          <span>Show</span>
          <select v-model="itemsPerPage" style="padding: 0.35rem 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>entries</span>
        </div>

        <!-- Buscador instantáneo -->
        <div style="position: relative; width: 220px;">
          <Search style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;" />
          <input v-model="searchQuery" type="text" placeholder="Search user..." style="width: 100%; padding: 0.45rem 0.65rem 0.45rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; box-sizing: border-box;" />
        </div>

        <!-- Botón Download CSV -->
        <button @click="exportCSV" style="padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;" class="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600">
          <Download style="width: 16px; height: 16px;" /> Download
        </button>

        <!-- Botón Nuevo Personal -->
        <button @click="openCreateModal" style="background: #ec4899; color: white; border: none; padding: 0.45rem 1rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
          <UserPlus style="width: 16px; height: 16px;" /> Nuevo Personal
        </button>
      </div>
    </div>

    <!-- Datatable 3 Table -->
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.8rem; text-transform: uppercase;">
            <th style="padding: 0.75rem 1rem; width: 40px;">
              <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
            </th>
            <th @click="sortBy('name')" style="padding: 0.75rem 1rem; cursor: pointer;">
              Nombre <ArrowUpDown style="width: 12px; height: 12px; display: inline;" />
            </th>
            <th style="padding: 0.75rem 1rem;">Contacto</th>
            <th style="padding: 0.75rem 1rem;">Rol</th>
            <th style="padding: 0.75rem 1rem;">Estado Cuenta</th>
            <th style="padding: 0.75rem 1rem;">Activo</th>
            <th style="padding: 0.75rem 1rem; text-align: center;">Acciones (4 Iconos)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in paginatedUsers" :key="u._id" :style="{ borderBottom: '1px solid #f1f5f9' }" :class="u.isActive === false ? 'bg-red-50/80 dark:bg-red-950/30' : 'bg-white dark:bg-slate-800'">
            <td style="padding: 0.75rem 1rem;">
              <input type="checkbox" :value="u._id" v-model="selectedIds" />
            </td>
            <td style="padding: 0.75rem 1rem; font-weight: 700;" class="text-slate-900 dark:text-white">
              {{ u.name }}
              <div v-if="u.isActive === false" style="font-size: 0.7rem; color: #ef4444; font-weight: 800;">(Baja Lógica / Inactivo)</div>
            </td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem;" class="text-slate-600 dark:text-slate-300">
              <div>{{ u.email }}</div>
              <div style="font-size: 0.75rem;" class="text-slate-400 dark:text-slate-500">{{ u.phone }}</div>
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ background: roleBgMap[u.role], color: roleColorMap[u.role], padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }">
                {{ u.role }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ background: u.verified ? '#dcfce7' : '#fee2e2', color: u.verified ? '#15803d' : '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }">
                {{ u.verified ? 'Verificado' : 'Pendiente OTP' }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ color: u.isActive !== false ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.8rem' }">
                {{ u.isActive !== false ? '● Activo' : '○ Inactivo' }}
              </span>
            </td>
            <!-- Columna Acciones con 4 Iconos Vectoriales SVG -->
            <td style="padding: 0.75rem 1rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem;">
                <!-- Acción 1: Editar Datos (Lápiz) -->
                <button @click="openEditModal(u)" style="background: transparent; border: none; color: #3b82f6; cursor: pointer;" title="Editar Datos de Usuario">
                  <Edit3 style="width: 18px; height: 18px;" />
                </button>

                <!-- Acción 2: Soft Delete / Reactivar (Papelera / RotateCcw) -->
                <button v-if="u.isActive !== false" @click="handleSoftDelete(u)" style="background: transparent; border: none; color: #ef4444; cursor: pointer;" title="Dar de Baja Lógica (Soft Delete)">
                  <Trash2 style="width: 18px; height: 18px;" />
                </button>
                <button v-else @click="handleReactivate(u)" style="background: transparent; border: none; color: #10b981; cursor: pointer;" title="Reactivar Usuario">
                  <RotateCcw style="width: 18px; height: 18px;" />
                </button>

                <!-- Acción 3: Editar Permisos Granulares (Escudo / ShieldCheck) - Exclusivo para Staff Admin -->
                <button v-if="u.role === 'admin'" @click="openPermissionsModal(u)" style="background: transparent; border: none; color: #8b5cf6; cursor: pointer;" title="Editar Permisos Granulares">
                  <ShieldCheck style="width: 18px; height: 18px;" />
                </button>

                <!-- Acción 4: Inspeccionar / Revocar Sesión Redis (Rayo / Zap) -->
                <button v-if="u.hasActiveSession" @click="openSessionModal(u)" style="background: transparent; border: none; color: #eab308; cursor: pointer;" title="Ver Sesión Activa en Redis">
                  <Zap style="width: 18px; height: 18px;" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Datatable 3 Footer & Pagination -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <div style="font-size: 0.85rem;" class="text-slate-500 dark:text-slate-400">
        Showing {{ showingStart }} to {{ showingEnd }} of {{ filteredUsers.length }} entries
      </div>

      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button @click="currentPage--" :disabled="currentPage === 1" style="padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;" class="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">
          Previous
        </button>
        <span style="font-size: 0.85rem; font-weight: 700; padding: 0 0.5rem;" class="text-slate-800 dark:text-slate-200">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage >= totalPages" style="padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;" class="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>

    <!-- Modal 1: Alta de Personal (verified: true automático) -->
    <div v-if="showCreateModal" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div ref="createModalRef" style="background: white; width: 100%; max-width: 520px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <h3 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1rem;">Alta de Personal (Staff / Admin)</h3>
        
        <form @submit.prevent="handleCreateUser">
          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Nombre Completo</label>
            <input v-model="createForm.name" type="text" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Correo Electrónico</label>
            <input v-model="createForm.email" type="email" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Teléfono WhatsApp (E.164)</label>
            <input v-model="createForm.phone" type="text" placeholder="+52155..." required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Contraseña</label>
            <input v-model="createForm.password" type="password" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Rol del Personal</label>
            <!-- RESTRICCIÓN DE NEGOCIO: Excluye 'user' (Clientes se registran por /register) -->
            <select v-model="createForm.role" style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
              <option value="admin">Admin (Personal de Recepción / Estilista)</option>
              <option value="superadmin">SuperAdmin (Dueño de Negocio)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem; color: #1e293b;">Permisos Granulares</label>
            <div style="max-height: 110px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem; background: #f8fafc; padding: 0.65rem; border-radius: 6px; border: 1px solid #e2e8f0;">
              <label v-for="p in availablePermissions" :key="p._id" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; cursor: pointer;">
                <input type="checkbox" :value="p._id" v-model="createForm.permissionIds" />
                <span><strong>{{ p.module }}:{{ p.action }}</strong> — {{ p.description || 'Permiso granular' }}</span>
              </label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button @click="showCreateModal = false" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
              Cancelar
            </button>
            <button type="submit" style="background: #ec4899; color: white; border: none; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
              Crear Personal (Verified)
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Editar Usuario (Acción Lápiz) -->
    <div v-if="editingUser" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div style="background: white; width: 100%; max-width: 480px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <h3 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1rem;">Editar Usuario</h3>

        <form @submit.prevent="handleUpdateUser">
          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Nombre Completo</label>
            <input v-model="editForm.name" type="text" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Correo Electrónico</label>
            <input v-model="editForm.email" type="email" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Teléfono WhatsApp</label>
            <input v-model="editForm.phone" type="text" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Rol</label>
            <select v-model="editForm.role" style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
              <option value="user">User (Cliente)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Nueva Contraseña (Opcional)</label>
            <div style="position: relative;">
              <input :type="showEditPassword ? 'text' : 'password'" v-model="editForm.password" placeholder="Escribe para cambiar la contraseña..." style="width: 100%; padding: 0.55rem 2.25rem 0.55rem 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
              <button type="button" @click="showEditPassword = !showEditPassword" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center;" title="Mostrar / Ocultar contraseña">
                <Eye v-if="!showEditPassword" style="width: 16px; height: 16px;" />
                <EyeOff v-else style="width: 16px; height: 16px;" />
              </button>
            </div>
            <span style="font-size: 0.72rem; color: #94a3b8; display: block; margin-top: 0.25rem;">SuperAdmin: puedes establecer una nueva contraseña y presionar el ojo para visualizarla.</span>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button @click="editingUser = null" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
              Cancelar
            </button>
            <button type="submit" style="background: #3b82f6; color: white; border: none; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Editar Permisos Granulares (Acción Escudo) -->
    <div v-if="permissionsUser" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div style="background: white; width: 100%; max-width: 480px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <h3 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <ShieldCheck style="width: 22px; height: 22px; color: #8b5cf6;" /> Editar Permisos Granulares
        </h3>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem;">Usuario: {{ permissionsUser.name }} ({{ permissionsUser.email }})</p>

        <div style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; background: #f8fafc; padding: 0.85rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 1.5rem;">
          <label v-for="p in availablePermissions" :key="p._id" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; cursor: pointer;">
            <input type="checkbox" :value="p._id" v-model="editPermissionsIds" />
            <span><strong>{{ p.module }}:{{ p.action }}</strong> — {{ p.description || 'Permiso granular' }}</span>
          </label>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button @click="permissionsUser = null" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Cancelar
          </button>
          <button @click="handleSavePermissions" style="background: #8b5cf6; color: white; border: none; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Guardar Permisos
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Ver Sesión Activa en Redis (Acción Rayo) -->
    <div v-if="selectedSessionUser" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div style="background: white; width: 100%; max-width: 440px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <h3 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <Zap style="width: 22px; height: 22px; color: #eab308;" /> Sesión Activa en Redis
        </h3>

        <div v-if="sessionLoading" style="padding: 1.5rem; text-align: center; color: #64748b;">Cargando estado de Redis...</div>

        <div v-else-if="sessionData && sessionData.active" style="background: #f8fafc; padding: 1.25rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <p style="margin: 0;"><strong>Usuario:</strong> {{ selectedSessionUser.name }}</p>
          <p style="margin: 0;"><strong>IP de Conexión:</strong> {{ sessionData.session.ip }}</p>
          <p style="margin: 0;"><strong>Dispositivo:</strong> {{ sessionData.session.userAgent }}</p>
          <p style="margin: 0;"><strong>Inicio de Sesión:</strong> {{ new Date(sessionData.session.loginAt).toLocaleString() }}</p>
          <p style="margin: 0; color: #10b981; font-weight: 700;">Estado: Activa en Redis</p>
        </div>

        <div v-else style="background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">
          El usuario no tiene una sesión activa registrada en Redis en este momento.
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
          <button @click="selectedSessionUser = null" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Cerrar
          </button>
          <button v-if="sessionData && sessionData.active" @click="handleRevokeSession" style="background: #ef4444; color: white; border: none; padding: 0.65rem 1.1rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Forzar Cierre de Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import {
  Users,
  UserPlus,
  Search,
  Download,
  ArrowUpDown,
  Edit3,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-vue-next';
import Swal from 'sweetalert2';
import gsap from 'gsap';

const authStore = useAuthStore();
const users = ref<any[]>([]);
const availablePermissions = ref<any[]>([]);

const searchQuery = ref('');
const showInactive = ref(false);
const itemsPerPage = ref(10);
const currentPage = ref(1);
const selectedIds = ref<string[]>([]);

const sortKey = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

const showCreateModal = ref(false);
const createForm = ref({ name: '', email: '', phone: '', password: '', role: 'admin', permissionIds: [] as string[] });

const editingUser = ref<any>(null);
const editForm = ref({ name: '', email: '', phone: '', role: 'admin', password: '' });
const showEditPassword = ref(false);

const permissionsUser = ref<any>(null);
const editPermissionsIds = ref<string[]>([]);

const selectedSessionUser = ref<any>(null);
const sessionData = ref<any>(null);
const sessionLoading = ref(false);

const createModalRef = ref<HTMLElement | null>(null);

const roleBgMap: Record<string, string> = {
  superadmin: '#fce7f3',
  admin: '#dbeafe',
  user: '#f1f5f9',
};

const roleColorMap: Record<string, string> = {
  superadmin: '#be185d',
  admin: '#1d4ed8',
  user: '#475569',
};

const apiUrl = import.meta.env.VITE_API_URL || '/api';

onMounted(() => {
  fetchUsers();
  fetchPermissions();
});

const fetchUsers = async () => {
  try {
    const res = await fetch(`${apiUrl}/users?showInactive=${showInactive.value}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      users.value = data.users;
    }
  } catch (e) {
    // Ignorar
  }
};

const fetchPermissions = async () => {
  try {
    const res = await fetch(`${apiUrl}/users/permissions`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      availablePermissions.value = data.permissions;
    }
  } catch (e) {
    // Ignorar
  }
};

const filteredUsers = computed(() => {
  let list = [...users.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }
  return list;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

const showingStart = computed(() => (filteredUsers.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1));
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length));

const isAllSelected = computed(() => paginatedUsers.value.length > 0 && selectedIds.value.length === paginatedUsers.value.length);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = paginatedUsers.value.map((u) => u._id);
  }
};

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const exportCSV = () => {
  const rows = [
    ['ID', 'Nombre', 'Email', 'Telefono', 'Rol', 'Estado', 'Activo'],
    ...filteredUsers.value.map((u) => [
      u._id,
      u.name,
      u.email,
      u.phone,
      u.role,
      u.verified ? 'Verificado' : 'Pendiente',
      u.isActive !== false ? 'Activo' : 'Inactivo',
    ]),
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `usuarios_appsalon_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Acciones CRUD
const openCreateModal = () => {
  createForm.value = { name: '', email: '', phone: '', password: '', role: 'admin', permissionIds: [] };
  showCreateModal.value = true;
  nextTick(() => {
    if (createModalRef.value) {
      gsap.fromTo(createModalRef.value, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.5)' });
    }
  });
};

const handleCreateUser = async () => {
  try {
    const res = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(createForm.value),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear personal');

    Swal.fire({ icon: 'success', title: '¡Personal Creado!', text: 'El usuario fue registrado con cuenta verificada.', timer: 1500, showConfirmButton: false });
    showCreateModal.value = false;
    fetchUsers();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};

const openEditModal = (u: any) => {
  editingUser.value = u;
  editForm.value = { name: u.name, email: u.email, phone: u.phone, role: u.role, password: '' };
  showEditPassword.value = false;
};

const handleUpdateUser = async () => {
  try {
    const res = await fetch(`${apiUrl}/users/${editingUser.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(editForm.value),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error actualizando usuario');

    Swal.fire({ icon: 'success', title: 'Usuario Actualizado', timer: 1500, showConfirmButton: false });
    editingUser.value = null;
    fetchUsers();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};

// Soft Delete (Baja Lógica -> isActive: false)
const handleSoftDelete = (u: any) => {
  Swal.fire({
    title: `¿Dar de baja a ${u.name}?`,
    text: 'El usuario pasará a estado inactivo. Su historial de citas y auditoría se mantendrá intacto.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, dar de baja',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}/users/${u._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
          credentials: 'include',
        });
        if (res.ok) {
          Swal.fire('Usuario Inactivo', 'El usuario fue dado de baja lógica correctamente.', 'success');
          fetchUsers();
        }
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

const handleReactivate = async (u: any) => {
  try {
    const res = await fetch(`${apiUrl}/users/${u._id}/reactivate`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      Swal.fire('Usuario Reactivado', 'El usuario vuelve a estar activo en el sistema.', 'success');
      fetchUsers();
    }
  } catch (e: any) {
    Swal.fire('Error', e.message, 'error');
  }
};

const openPermissionsModal = (u: any) => {
  permissionsUser.value = u;
  editPermissionsIds.value = u.permissions?.map((p: any) => p._id || p) || [];
};

const handleSavePermissions = async () => {
  try {
    const res = await fetch(`${apiUrl}/users/${permissionsUser.value._id}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ permissionIds: editPermissionsIds.value }),
    });

    if (res.ok) {
      Swal.fire({ icon: 'success', title: 'Permisos Actualizados', timer: 1500, showConfirmButton: false });
      permissionsUser.value = null;
      fetchUsers();
    }
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};

const openSessionModal = async (u: any) => {
  selectedSessionUser.value = u;
  sessionLoading.value = true;
  try {
    const res = await fetch(`${apiUrl}/users/${u._id}/session`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      sessionData.value = await res.json();
    }
  } catch (e) {
    sessionData.value = null;
  } finally {
    sessionLoading.value = false;
  }
};

const handleRevokeSession = async () => {
  if (!selectedSessionUser.value) return;
  try {
    const res = await fetch(`${apiUrl}/users/${selectedSessionUser.value._id}/session`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });

    if (res.ok) {
      Swal.fire({ icon: 'success', title: 'Sesión Revocada', text: 'La sesión fue eliminada en Redis.', timer: 1500, showConfirmButton: false });
      selectedSessionUser.value = null;
      fetchUsers();
    }
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error al revocar', text: e.message });
  }
};
</script>
