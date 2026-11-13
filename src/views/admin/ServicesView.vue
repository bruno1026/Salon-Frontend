<template>
  <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <!-- Datatable 3 Header Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
        <Scissors style="width: 24px; height: 24px; color: #ec4899;" /> Catálogo de Servicios (Datatable 3)
      </h2>

      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <!-- Toggle Ver Inactivos -->
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer;">
          <input type="checkbox" v-model="showInactive" @change="fetchServices" />
          <span>Mostrar Inactivos</span>
        </label>

        <!-- Rows per page selector -->
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #64748b; font-weight: 600;">
          <span>Show</span>
          <select v-model="itemsPerPage" style="padding: 0.35rem 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>entries</span>
        </div>

        <!-- Buscador -->
        <div style="position: relative; width: 220px;">
          <Search style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;" />
          <input v-model="searchQuery" type="text" placeholder="Buscar servicio..." style="width: 100%; padding: 0.45rem 0.65rem 0.45rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; box-sizing: border-box;" />
        </div>

        <!-- Download CSV -->
        <button @click="exportCSV" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
          <Download style="width: 16px; height: 16px;" /> Download
        </button>

        <!-- Nuevo Servicio -->
        <button @click="openCreateModal" style="background: #ec4899; color: white; border: none; padding: 0.45rem 1rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
          <Plus style="width: 16px; height: 16px;" /> Nuevo Servicio
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
              Servicio <ArrowUpDown style="width: 12px; height: 12px; display: inline;" />
            </th>
            <th style="padding: 0.75rem 1rem;">Categoría</th>
            <th @click="sortBy('price')" style="padding: 0.75rem 1rem; cursor: pointer;">
              Precio <ArrowUpDown style="width: 12px; height: 12px; display: inline;" />
            </th>
            <th style="padding: 0.75rem 1rem;">Duración</th>
            <th style="padding: 0.75rem 1rem;">Estado</th>
            <th style="padding: 0.75rem 1rem; text-align: center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="srv in paginatedServices" :key="srv._id" :style="{ background: srv.isActive === false ? '#fef2f2' : 'white', borderBottom: '1px solid #f1f5f9' }">
            <td style="padding: 0.75rem 1rem;">
              <input type="checkbox" :value="srv._id" v-model="selectedIds" />
            </td>
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: #1e293b;">
              {{ srv.name }}
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 400;">{{ srv.description || 'Sin descripción' }}</div>
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span style="background: #e0e7ff; color: #3730a3; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
                {{ srv.category?.name || 'General' }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; font-weight: 800; color: #10b981;">${{ srv.price }} MXN</td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #475569; font-weight: 600;">{{ srv.durationMinutes }} min</td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ color: srv.isActive !== false ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.8rem' }">
                {{ srv.isActive !== false ? '● Activo' : '○ Inactivo' }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem;">
                <button @click="openEditModal(srv)" style="background: transparent; border: none; color: #3b82f6; cursor: pointer;" title="Editar Servicio">
                  <Edit3 style="width: 18px; height: 18px;" />
                </button>
                <button v-if="srv.isActive !== false" @click="handleSoftDelete(srv)" style="background: transparent; border: none; color: #ef4444; cursor: pointer;" title="Desactivar (Soft Delete)">
                  <Trash2 style="width: 18px; height: 18px;" />
                </button>
                <button v-else @click="handleReactivate(srv)" style="background: transparent; border: none; color: #10b981; cursor: pointer;" title="Reactivar Servicio">
                  <RotateCcw style="width: 18px; height: 18px;" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Datatable 3 Footer & Pagination -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <div style="font-size: 0.85rem; color: #64748b;">
        Showing {{ showingStart }} to {{ showingEnd }} of {{ filteredServices.length }} entries
      </div>

      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button @click="currentPage--" :disabled="currentPage === 1" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          Previous
        </button>
        <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b; padding: 0 0.5rem;">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage >= totalPages" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          Next
        </button>
      </div>
    </div>

    <!-- Modal Formulario (Alta / Edición) -->
    <div v-if="showModal" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div style="background: white; width: 100%; max-width: 480px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <h3 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1rem;">
          {{ isEditing ? 'Editar Servicio' : 'Nuevo Servicio' }}
        </h3>

        <form @submit.prevent="handleSubmit">
          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Nombre del Servicio</label>
            <input v-model="form.name" type="text" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Descripción</label>
            <textarea v-model="form.description" rows="2" style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Precio (MXN)</label>
              <input v-model.number="form.price" type="number" required min="0" style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
            </div>
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Duración (min)</label>
              <input v-model.number="form.durationMinutes" type="number" required min="5" style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
            </div>
          </div>

          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Imagen del Servicio (Cloudinary)</label>
            <input type="file" accept="image/png, image/jpeg, image/webp" @change="handleFileUpload" style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem;" />
            <div v-if="uploadingImage" style="font-size: 0.8rem; color: #ec4899; font-weight: 700; margin-bottom: 0.5rem;">
              ⏳ Subiendo imagen a Cloudinary...
            </div>
            <div v-if="form.imageUrl" style="margin-top: 0.5rem;">
              <img :src="form.imageUrl" alt="Preview" style="max-height: 100px; border-radius: 6px; border: 1px solid #cbd5e1; object-fit: cover;" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Categoría de Servicio</label>
            <select v-model="form.category" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; background: white;">
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button @click="showModal = false" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
              Cancelar
            </button>
            <button type="submit" style="background: #ec4899; color: white; border: none; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
              {{ isEditing ? 'Guardar Cambios' : 'Crear Servicio' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { Scissors, Plus, Search, Download, ArrowUpDown, Edit3, Trash2, RotateCcw } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const services = ref<any[]>([]);
const categories = ref<any[]>([]);

const searchQuery = ref('');
const showInactive = ref(false);
const itemsPerPage = ref(10);
const currentPage = ref(1);
const selectedIds = ref<string[]>([]);
const sortKey = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const uploadingImage = ref(false);
const form = ref({ name: '', description: '', price: 500, durationMinutes: 60, category: '', imageUrl: '' });

const apiUrl = import.meta.env.VITE_API_URL || '/api';

onMounted(() => {
  fetchServices();
  fetchCategories();
});

const fetchServices = async () => {
  try {
    const res = await fetch(`${apiUrl}/services?showInactive=${showInactive.value}`);
    if (res.ok) {
      const data = await res.json();
      services.value = data.services;
    }
  } catch (e) {
    // Ignorar
  }
};

const fetchCategories = async () => {
  try {
    const res = await fetch(`${apiUrl}/categories?type=service&showInactive=false`);
    if (res.ok) {
      const data = await res.json();
      categories.value = data.categories;
      if (categories.value.length > 0 && !form.value.category) {
        form.value.category = categories.value[0]._id;
      }
    }
  } catch (e) {
    // Ignorar
  }
};

import { uploadImageToCloudinary } from '../../utils/cloudinaryUpload';

const handleFileUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  uploadingImage.value = true;
  try {
    const data = await uploadImageToCloudinary(file);
    form.value.imageUrl = data.url;
    Swal.fire({ icon: 'success', title: 'Imagen Subida a Cloudinary', timer: 1200, showConfirmButton: false });
  } catch (err: any) {
    Swal.fire('Error', err.message, 'error');
  } finally {
    uploadingImage.value = false;
  }
};

const filteredServices = computed(() => {
  let list = [...services.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.category?.name || '').toLowerCase().includes(q)
    );
  }
  return list;
});

const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage.value) || 1);

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredServices.value.slice(start, start + itemsPerPage.value);
});

const showingStart = computed(() => (filteredServices.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1));
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredServices.value.length));

const isAllSelected = computed(() => paginatedServices.value.length > 0 && selectedIds.value.length === paginatedServices.value.length);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = paginatedServices.value.map((s) => s._id);
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
    ['ID', 'Servicio', 'Categoria', 'Precio', 'DuracionMin', 'Activo'],
    ...filteredServices.value.map((s) => [
      s._id,
      s.name,
      s.category?.name || '',
      s.price,
      s.durationMinutes,
      s.isActive !== false ? 'Activo' : 'Inactivo',
    ]),
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `servicios_appsalon_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { name: '', description: '', price: 500, durationMinutes: 60, category: categories.value[0]?._id || '', imageUrl: '' };
  showModal.value = true;
};

const openEditModal = (srv: any) => {
  isEditing.value = true;
  editingId.value = srv._id;
  form.value = {
    name: srv.name,
    description: srv.description || '',
    price: srv.price,
    durationMinutes: srv.durationMinutes,
    category: srv.category?._id || srv.category || '',
    imageUrl: srv.imageUrl || '',
  };
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${apiUrl}/services/${editingId.value}` : `${apiUrl}/services`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(form.value),
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Error de comunicación con el servidor (${res.status}: ${res.statusText})`);
    }
    if (!res.ok) throw new Error(data.error || 'Error al guardar servicio');

    Swal.fire({ icon: 'success', title: isEditing.value ? 'Servicio Actualizado' : 'Servicio Creado', timer: 1500, showConfirmButton: false });
    showModal.value = false;
    fetchServices();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};

const handleSoftDelete = (srv: any) => {
  Swal.fire({
    title: `¿Desactivar ${srv.name}?`,
    text: 'El servicio pasará a inactivo y dejará de mostrarse a los clientes.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, desactivar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}/services/${srv._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
          credentials: 'include',
        });
        if (res.ok) {
          Swal.fire('Servicio Inactivo', 'El servicio fue desactivado exitosamente.', 'success');
          fetchServices();
        }
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

const handleReactivate = async (srv: any) => {
  try {
    const res = await fetch(`${apiUrl}/services/${srv._id}/reactivate`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      Swal.fire('Servicio Reactivado', 'El servicio vuelve a estar activo en el catálogo.', 'success');
      fetchServices();
    }
  } catch (e: any) {
    Swal.fire('Error', e.message, 'error');
  }
};
</script>
