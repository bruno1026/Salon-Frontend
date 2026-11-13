<template>
  <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <!-- Datatable 3 Header Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
        <FolderTree style="width: 24px; height: 24px; color: #ec4899;" /> Categorías de Servicios (Datatable 3)
      </h2>

      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <!-- Toggle Ver Inactivos -->
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer;">
          <input type="checkbox" v-model="showInactive" @change="fetchCategories" />
          <span>Mostrar Inactivos</span>
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

        <!-- Buscador -->
        <div style="position: relative; width: 220px;">
          <Search style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8;" />
          <input v-model="searchQuery" type="text" placeholder="Buscar categoría..." style="width: 100%; padding: 0.45rem 0.65rem 0.45rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; box-sizing: border-box;" />
        </div>

        <!-- Download CSV -->
        <button @click="exportCSV" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
          <Download style="width: 16px; height: 16px;" /> Download
        </button>

        <!-- Nueva Categoría -->
        <button @click="openCreateModal" style="background: #ec4899; color: white; border: none; padding: 0.45rem 1rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
          <Plus style="width: 16px; height: 16px;" /> Nueva Categoría
        </button>
      </div>
    </div>

    <!-- Datatable 3 Table -->
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.8rem; text-transform: uppercase;">
            <th style="padding: 0.75rem 1rem;">Nombre</th>
            <th style="padding: 0.75rem 1rem;">Slug</th>
            <th style="padding: 0.75rem 1rem;">Descripción</th>
            <th style="padding: 0.75rem 1rem;">Estado</th>
            <th style="padding: 0.75rem 1rem; text-align: center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in paginatedCategories" :key="cat._id" :style="{ background: cat.isActive === false ? '#fef2f2' : 'white', borderBottom: '1px solid #f1f5f9' }">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: #1e293b;">{{ cat.name }}</td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #64748b; font-family: monospace;">{{ cat.slug }}</td>
            <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #475569;">{{ cat.description || 'Sin descripción' }}</td>
            <td style="padding: 0.75rem 1rem;">
              <span :style="{ color: cat.isActive !== false ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.8rem' }">
                {{ cat.isActive !== false ? '● Activa' : '○ Inactiva' }}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem;">
                <button @click="openEditModal(cat)" style="background: transparent; border: none; color: #3b82f6; cursor: pointer;" title="Editar">
                  <Edit3 style="width: 18px; height: 18px;" />
                </button>
                <button v-if="cat.isActive !== false" @click="handleSoftDelete(cat)" style="background: transparent; border: none; color: #ef4444; cursor: pointer;" title="Desactivar">
                  <Trash2 style="width: 18px; height: 18px;" />
                </button>
                <button v-else @click="handleReactivate(cat)" style="background: transparent; border: none; color: #10b981; cursor: pointer;" title="Reactivar">
                  <RotateCcw style="width: 18px; height: 18px;" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Formulario -->
    <div v-if="showModal" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;">
      <div style="background: white; width: 100%; max-width: 440px; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);">
        <h3 style="margin-top: 0; color: #0f172a; font-weight: 800; margin-bottom: 1rem;">
          {{ isEditing ? 'Editar Categoría de Servicio' : 'Nueva Categoría de Servicio' }}
        </h3>

        <form @submit.prevent="handleSubmit">
          <div style="margin-bottom: 0.85rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Nombre</label>
            <input v-model="form.name" type="text" required style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem;">Descripción</label>
            <textarea v-model="form.description" rows="3" style="width: 100%; padding: 0.55rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button @click="showModal = false" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600; cursor: pointer;">
              Cancelar
            </button>
            <button type="submit" style="background: #ec4899; color: white; border: none; padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
              {{ isEditing ? 'Guardar Cambios' : 'Crear Categoría' }}
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
import { FolderTree, Plus, Search, Download, Edit3, Trash2, RotateCcw } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const categories = ref<any[]>([]);
const searchQuery = ref('');
const showInactive = ref(false);
const itemsPerPage = ref(10);
const currentPage = ref(1);

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const form = ref({ name: '', description: '' });

const apiUrl = import.meta.env.VITE_API_URL || '/api';

onMounted(() => {
  fetchCategories();
});

const fetchCategories = async () => {
  try {
    const res = await fetch(`${apiUrl}/categories?type=service&showInactive=${showInactive.value}`);
    if (res.ok) {
      const data = await res.json();
      categories.value = data.categories;
    }
  } catch (e) {
    // Ignorar
  }
};

const filteredCategories = computed(() => {
  let list = [...categories.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)
    );
  }
  return list;
});

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCategories.value.slice(start, start + itemsPerPage.value);
});

const exportCSV = () => {
  const rows = [
    ['ID', 'Nombre', 'Slug', 'Descripcion', 'Activa'],
    ...filteredCategories.value.map((c) => [c._id, c.name, c.slug, c.description || '', c.isActive !== false ? 'Activa' : 'Inactiva']),
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `categorias_servicios_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { name: '', description: '' };
  showModal.value = true;
};

const openEditModal = (cat: any) => {
  isEditing.value = true;
  editingId.value = cat._id;
  form.value = { name: cat.name, description: cat.description || '' };
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${apiUrl}/categories/${editingId.value}` : `${apiUrl}/categories`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ ...form.value, type: 'service' }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al guardar categoría');

    Swal.fire({ icon: 'success', title: 'Categoría Guardada', timer: 1500, showConfirmButton: false });
    showModal.value = false;
    fetchCategories();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  }
};

const handleSoftDelete = (cat: any) => {
  Swal.fire({
    title: `¿Desactivar ${cat.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, desactivar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}/categories/${cat._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
          credentials: 'include',
        });
        if (res.ok) {
          Swal.fire('Categoría Inactiva', '', 'success');
          fetchCategories();
        }
      } catch (e: any) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

const handleReactivate = async (cat: any) => {
  try {
    const res = await fetch(`${apiUrl}/categories/${cat._id}/reactivate`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    });
    if (res.ok) {
      Swal.fire('Categoría Reactivada', '', 'success');
      fetchCategories();
    }
  } catch (e: any) {
    Swal.fire('Error', e.message, 'error');
  }
};
</script>
