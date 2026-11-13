<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="margin: 0; font-size: 1.6rem; font-weight: 800; display: flex; align-items: center; gap: 0.6rem;" class="text-slate-900 dark:text-white">
          <Zap style="width: 28px; height: 28px; color: #c43ec7;" />
          Promociones & Ofertas con Vigencia
        </h1>
        <p style="margin: 0.25rem 0 0; font-size: 0.875rem;" class="text-slate-500 dark:text-slate-400">
          Submódulo de administración de precios con descuento y fechas límite de expiración.
        </p>
      </div>
    </div>

    <!-- Table of Offers -->
    <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; font-weight: 700;" class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 dark:border-slate-700">
              <th style="padding: 0.9rem 1.25rem;">Producto</th>
              <th style="padding: 0.9rem 1.25rem;">Precio Original</th>
              <th style="padding: 0.9rem 1.25rem;">Precio Oferta</th>
              <th style="padding: 0.9rem 1.25rem;">Descuento %</th>
              <th style="padding: 0.9rem 1.25rem;">Fecha Expiración</th>
              <th style="padding: 0.9rem 1.25rem;">Estado Vigencia</th>
              <th style="padding: 0.9rem 1.25rem; text-align: right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prod in offerProducts"
              :key="prod._id"
              style="border-bottom: 1px solid #f1f5f9;"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/40 dark:border-slate-700/60"
            >
              <!-- Product Thumb & Name -->
              <td style="padding: 0.9rem 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 42px; height: 42px; border-radius: 8px; overflow: hidden; background: #f8fafc; border: 1px solid #e2e8f0; flex-shrink: 0; display: flex; align-items: center; justify-content: center;" class="dark:bg-slate-900 dark:border-slate-700">
                    <img v-if="prod.imageUrl" :src="prod.imageUrl" :alt="prod.name" style="width: 100%; height: 100%; object-fit: cover;" />
                    <Package v-else style="width: 20px; height: 20px; color: #94a3b8;" />
                  </div>
                  <div>
                    <div style="font-weight: 700;" class="text-slate-900 dark:text-white">{{ prod.name }}</div>
                    <div style="font-size: 0.75rem;" class="text-slate-500 dark:text-slate-400">{{ prod.category?.name || 'General' }}</div>
                  </div>
                </div>
              </td>

              <!-- Original Price -->
              <td style="padding: 0.9rem 1.25rem; font-weight: 600;" class="text-slate-500 dark:text-slate-400">
                ${{ prod.price }} MXN
              </td>

              <!-- Sale Price -->
              <td style="padding: 0.9rem 1.25rem; font-weight: 800;" class="text-emerald-600 dark:text-emerald-400">
                ⚡ ${{ prod.salePrice }} MXN
              </td>

              <!-- Discount % -->
              <td style="padding: 0.9rem 1.25rem;">
                <span style="background: #fce7f3; color: #9d174d; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 800;" class="dark:bg-pink-950/60 dark:text-pink-300">
                  -{{ calculateDiscount(prod.price, prod.salePrice) }}%
                </span>
              </td>

              <!-- Expiration Date -->
              <td style="padding: 0.9rem 1.25rem;" class="text-slate-700 dark:text-slate-300">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <Clock style="width: 15px; height: 15px; color: #94a3b8;" />
                  {{ prod.saleEndDate ? formatDate(prod.saleEndDate) : 'Sin expiración (Permanente)' }}
                </div>
              </td>

              <!-- Vigencia Status -->
              <td style="padding: 0.9rem 1.25rem;">
                <span
                  v-if="prod.isOnSale"
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #dcfce7; color: #15803d; padding: 0.25rem 0.7rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span>
                  Oferta Activa
                </span>
                <span
                  v-else
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fee2e2; color: #b91c1c; padding: 0.25rem 0.7rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-red-950/60 dark:text-red-300"
                >
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #dc2626;"></span>
                  Oferta Vencida
                </span>
              </td>

              <!-- Actions -->
              <td style="padding: 0.9rem 1.25rem; text-align: right;">
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                  <button
                    @click="openOfferModal(prod)"
                    style="padding: 0.45rem 0.85rem; border-radius: 6px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;"
                    class="dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Edit style="width: 14px; height: 14px;" /> Editar
                  </button>

                  <button
                    @click="deactivateOffer(prod)"
                    style="padding: 0.45rem 0.85rem; border-radius: 6px; border: none; background: #ef4444; color: white; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;"
                  >
                    <XCircle style="width: 14px; height: 14px;" /> Desactivar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="offerProducts.length === 0">
              <td colspan="7" style="text-align: center; padding: 3rem 1rem;" class="text-slate-500 dark:text-slate-400">
                No hay promociones u ofertas configuradas actualmente.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: Editar Oferta -->
    <div v-if="showModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1.5rem;">
      <div style="width: 100%; max-width: 480px; border-radius: 16px; padding: 1.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; font-weight: 800; font-size: 1.15rem;" class="text-slate-900 dark:text-white">
            Editar Vigencia de Oferta
          </h3>
          <button @click="showModal = false" style="background: transparent; border: none; cursor: pointer;" class="text-slate-400">
            <X style="width: 20px; height: 20px;" />
          </button>
        </div>

        <form @submit.prevent="saveOffer" style="display: flex; flex-direction: column; gap: 1.1rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem;" class="text-slate-700 dark:text-slate-300">Precio Oferta ($ MXN)</label>
            <input v-model.number="form.salePrice" type="number" step="0.01" min="0" required style="width: 100%; padding: 0.65rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" />
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem;" class="text-slate-700 dark:text-slate-300">Fecha de Expiración</label>
            <input v-model="form.saleEndDate" type="datetime-local" style="width: 100%; padding: 0.65rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" />
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <input type="checkbox" id="modalSaleActive" v-model="form.saleActive" style="width: 18px; height: 18px; cursor: pointer;" />
            <label for="modalSaleActive" style="font-weight: 700; font-size: 0.875rem; cursor: pointer;" class="text-slate-800 dark:text-slate-200">
              Oferta Activa
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.75rem;">
            <button type="button" @click="showModal = false" style="padding: 0.6rem 1.1rem; border-radius: 8px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; cursor: pointer;" class="dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Cancelar
            </button>
            <button type="submit" style="padding: 0.6rem 1.25rem; border-radius: 8px; border: none; background: #c43ec7; color: white; font-weight: 700; cursor: pointer;">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { Zap, Package, Clock, Edit, XCircle, X } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_API_URL || '/api';

const offerProducts = ref<any[]>([]);
const showModal = ref(false);
const selectedProd = ref<any>(null);
const form = ref({
  salePrice: 0,
  saleActive: true,
  saleEndDate: '',
});

onMounted(() => {
  fetchOffers();
});

const fetchOffers = async () => {
  try {
    const res = await fetch(`${apiUrl}/products?onlyOffers=true`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      offerProducts.value = data.products || [];
    }
  } catch (e) {
    // Ignorar
  }
};

const calculateDiscount = (orig: number, sale?: number) => {
  if (!sale || orig <= 0) return 0;
  return Math.round(((orig - sale) / orig) * 100);
};

const openOfferModal = (prod: any) => {
  selectedProd.value = prod;
  form.value = {
    salePrice: prod.salePrice || 0,
    saleActive: prod.saleActive !== false,
    saleEndDate: prod.saleEndDate ? new Date(prod.saleEndDate).toISOString().slice(0, 16) : '',
  };
  showModal.value = true;
};

const saveOffer = async () => {
  try {
    const res = await fetch(`${apiUrl}/products/${selectedProd.value._id}/offer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(form.value),
    });

    if (res.ok) {
      Swal.fire({ icon: 'success', title: 'Oferta actualizada', timer: 1500, showConfirmButton: false });
      showModal.value = false;
      fetchOffers();
    }
  } catch (e) {
    // Ignorar
  }
};

const deactivateOffer = async (prod: any) => {
  const result = await Swal.fire({
    title: '¿Desactivar Oferta?',
    text: `El producto "${prod.name}" volverá a su precio regular de $${prod.price} MXN.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Desactivar',
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${apiUrl}/products/${prod._id}/offer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: JSON.stringify({ saleActive: false }),
      });

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Oferta desactivada', timer: 1500, showConfirmButton: false });
        fetchOffers();
      }
    } catch (e) {
      // Ignorar
    }
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
