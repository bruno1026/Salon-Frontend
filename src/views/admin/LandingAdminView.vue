<template>
  <div style="max-width: 1080px; margin: 0 auto; padding: 1rem;">
    <!-- Title Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
        <Globe style="width: 26px; height: 26px; color: #ec4899;" /> Gestión de Landing & Publicidad
      </h2>
      <button @click="saveChanges" style="background: #ec4899; color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
        <Save style="width: 18px; height: 18px;" /> Guardar Cambios
      </button>
    </div>

    <!-- Tabs Navigation -->
    <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 1.5rem; overflow-x: auto;" class="dark:border-slate-700">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="activeTab = t.id"
        :style="{
          padding: '0.75rem 1.25rem',
          border: 'none',
          background: 'transparent',
          fontWeight: activeTab === t.id ? '800' : '600',
          borderBottom: activeTab === t.id ? '3px solid #ec4899' : '3px solid transparent',
          color: activeTab === t.id ? '#ec4899' : undefined,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }"
        class="text-slate-600 dark:text-slate-300"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- TAB 1: CARRUSEL HERO -->
    <div v-if="activeTab === 'hero'" style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <h3 style="margin: 0; font-weight: 800;" class="text-slate-900 dark:text-white">Slides del Carrusel Principal (Hero)</h3>
        <label style="background: #0f172a; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;" class="dark:bg-slate-700">
          <Upload style="width: 16px; height: 16px;" /> Agregar Foto / Video
          <input type="file" accept="image/*,video/*" @change="uploadMedia($event, 'heroSlides')" style="display: none;" />
        </label>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div v-for="(slide, index) in landingForm.heroSlides" :key="index" style="padding: 1rem; border-radius: 8px; display: grid; grid-template-columns: 140px 1fr 40px; gap: 1rem; align-items: center;" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <!-- Preview -->
          <div style="width: 140px; height: 90px; border-radius: 6px; overflow: hidden; background: #000;">
            <video v-if="slide.mediaType === 'video'" :src="slide.mediaUrl" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
            <img v-else :src="slide.mediaUrl" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <!-- Controls -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div>
              <label style="font-size: 0.75rem; font-weight: 700;" class="text-slate-600 dark:text-slate-400">Texto Superior (Eyebrow)</label>
              <input v-model="slide.eyebrowText" type="text" style="width: 100%; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 0.85rem;" class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label style="font-size: 0.75rem; font-weight: 700;" class="text-slate-600 dark:text-slate-400">Título Principal (Heading)</label>
              <input v-model="slide.heading" type="text" style="width: 100%; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 0.85rem;" class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: center;">
            <button @click="moveItem(landingForm.heroSlides, index, -1)" :disabled="index === 0" style="border: none; background: transparent; cursor: pointer; opacity: 0.7;">▲</button>
            <button @click="removeItem(landingForm.heroSlides, index)" style="border: none; background: transparent; color: #ef4444; cursor: pointer;" title="Eliminar Slide">
              <Trash2 style="width: 18px; height: 18px;" />
            </button>
            <button @click="moveItem(landingForm.heroSlides, index, 1)" :disabled="index === landingForm.heroSlides.length - 1" style="border: none; background: transparent; cursor: pointer; opacity: 0.7;">▼</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: QUIÉNES SOMOS & ESTADÍSTICAS -->
    <div v-if="activeTab === 'about'" style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 style="margin-top: 0; font-weight: 800; margin-bottom: 1.25rem;" class="text-slate-900 dark:text-white">Quiénes Somos & Estadísticas Animadas (GSAP)</h3>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Texto "Sobre Nosotros"</label>
        <textarea v-model="landingForm.aboutText" rows="4" style="width: 100%; padding: 0.75rem; border-radius: 8px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"></textarea>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Años de Experiencia (Contador)</label>
          <input v-model.number="landingForm.statsYears" type="number" min="0" style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
        </div>
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Clientes Satisfechos (Contador)</label>
          <input v-model.number="landingForm.statsClients" type="number" min="0" style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
        </div>
      </div>
    </div>

    <!-- TAB 3: GALERÍAS (TRABAJO E INSTALACIONES) -->
    <div v-if="activeTab === 'galleries'" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Galería Nuestro Trabajo -->
      <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; font-weight: 800;" class="text-slate-900 dark:text-white">Galería "Nuestro Trabajo" (Mosaico con Lightbox)</h3>
          <label style="background: #ec4899; color: white; padding: 0.45rem 0.9rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
            + Subir Trabajo
            <input type="file" accept="image/*,video/*" @change="uploadMedia($event, 'workGallery')" style="display: none;" />
          </label>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem;">
          <div v-for="(item, idx) in landingForm.workGallery" :key="idx" style="position: relative; border-radius: 8px; overflow: hidden; height: 110px;" class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <img v-if="item.mediaType === 'image'" :src="item.mediaUrl" style="width: 100%; height: 100%; object-fit: cover;" />
            <video v-else :src="item.mediaUrl" style="width: 100%; height: 100%; object-fit: cover;"></video>
            <button @click="removeItem(landingForm.workGallery, idx)" style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              &times;
            </button>
          </div>
        </div>
      </div>

      <!-- Galería Nuestras Instalaciones -->
      <div style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; font-weight: 800;" class="text-slate-900 dark:text-white">Galería "Nuestras Instalaciones" (Carrusel Swiper 2)</h3>
          <label style="background: #ec4899; color: white; padding: 0.45rem 0.9rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
            + Subir Instalación
            <input type="file" accept="image/*,video/*" @change="uploadMedia($event, 'facilityGallery')" style="display: none;" />
          </label>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem;">
          <div v-for="(item, idx) in landingForm.facilityGallery" :key="idx" style="position: relative; border-radius: 8px; overflow: hidden; height: 110px;" class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <img v-if="item.mediaType === 'image'" :src="item.mediaUrl" style="width: 100%; height: 100%; object-fit: cover;" />
            <video v-else :src="item.mediaUrl" style="width: 100%; height: 100%; object-fit: cover;"></video>
            <button @click="removeItem(landingForm.facilityGallery, idx)" style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: POR QUÉ ELEGIRNOS & FEED SOCIAL -->
    <div v-if="activeTab === 'why_us'" style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 style="margin-top: 0; font-weight: 800; margin-bottom: 1.25rem;" class="text-slate-900 dark:text-white">¿Por Qué Elegirnos? & Feed Social</h3>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Texto "¿Por Qué Elegirnos?"</label>
        <textarea v-model="landingForm.whyChooseUsText" rows="3" style="width: 100%; padding: 0.75rem; border-radius: 8px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"></textarea>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <label style="font-weight: 700; font-size: 0.85rem;" class="text-slate-700 dark:text-slate-300">Fotos de Feed Social / Instagram (Grid manual)</label>
          <label style="background: #0f172a; color: white; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;" class="dark:bg-slate-700">
            + Foto Feed
            <input type="file" accept="image/*" @change="uploadMedia($event, 'socialGridImages')" style="display: none;" />
          </label>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.75rem;">
          <div v-for="(item, idx) in landingForm.socialGridImages" :key="idx" style="position: relative; border-radius: 6px; overflow: hidden; height: 90px;">
            <img :src="item.mediaUrl" style="width: 100%; height: 100%; object-fit: cover;" />
            <button @click="removeItem(landingForm.socialGridImages, idx)" style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: CONTACTO & REDES -->
    <div v-if="activeTab === 'contact'" style="padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 style="margin-top: 0; font-weight: 800; margin-bottom: 1.25rem;" class="text-slate-900 dark:text-white">Información de Contacto & Ubicación</h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Dirección Física (Para Mapa Embebido)</label>
          <input v-model="landingForm.address" type="text" style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
        </div>
        <div>
          <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Horarios de Atención</label>
          <input v-model="landingForm.hours" type="text" style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
        </div>
      </div>

      <!-- Teléfonos de Contacto -->
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Teléfonos de Contacto Informativo</label>
        <div v-for="(p, idx) in landingForm.phones" :key="idx" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
          <input v-model="landingForm.phones[idx]" type="text" style="flex: 1; padding: 0.5rem; border-radius: 6px; font-size: 0.9rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          <button @click="landingForm.phones.splice(idx, 1)" style="background: #ef4444; color: white; border: none; padding: 0.5rem 0.8rem; border-radius: 6px; cursor: pointer;">&times;</button>
        </div>
        <button @click="landingForm.phones.push('')" style="background: #0f172a; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer;" class="dark:bg-slate-700">+ Agregar Teléfono</button>
      </div>

      <!-- Links a Redes Sociales -->
      <div>
        <h4 style="margin: 0 0 0.75rem 0; font-weight: 800;" class="text-slate-900 dark:text-white">Redes Sociales</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;" class="text-slate-600 dark:text-slate-400">Instagram URL</label>
            <input v-model="landingForm.socialLinks.instagram" type="text" style="width: 100%; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;" class="text-slate-600 dark:text-slate-400">Facebook URL</label>
            <input v-model="landingForm.socialLinks.facebook" type="text" style="width: 100%; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;" class="text-slate-600 dark:text-slate-400">TikTok URL</label>
            <input v-model="landingForm.socialLinks.tiktok" type="text" style="width: 100%; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { uploadImageToCloudinary } from '../../utils/cloudinaryUpload';
import { Globe, Save, Upload, Trash2 } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_API_URL || '/api';

const activeTab = ref('hero');
const tabs = [
  { id: 'hero', label: '1. Carrusel Hero' },
  { id: 'about', label: '2. Quiénes Somos' },
  { id: 'galleries', label: '3. Galerías' },
  { id: 'why_us', label: '4. Por Qué Elegirnos' },
  { id: 'contact', label: '5. Contacto & Redes' },
];

const landingForm = ref<any>({
  heroSlides: [],
  aboutText: '',
  statsYears: 10,
  statsClients: 2500,
  workGallery: [],
  facilityGallery: [],
  whyChooseUsText: '',
  socialGridImages: [],
  address: '',
  hours: '',
  phones: [],
  socialLinks: {},
});

onMounted(async () => {
  try {
    const res = await fetch(`${apiUrl}/landing`);
    if (res.ok) {
      const data = await res.json();
      landingForm.value = {
        ...data,
        socialLinks: data.socialLinks || {},
        phones: data.phones || [],
      };
    }
  } catch (err) {
    console.error('Error al cargar contenido landing:', err);
  }
});

const uploadMedia = async (e: Event, galleryKey: string) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    Swal.fire({ title: 'Subiendo a Cloudinary...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await uploadImageToCloudinary(file);
    Swal.close();

    const isVideo = file.type.startsWith('video/');
    const newItem = {
      mediaUrl: data.url,
      mediaType: isVideo ? 'video' : 'image',
      eyebrowText: isVideo ? 'Nuevo Video' : 'Destacado',
      heading: 'Título de la Sección',
      order: landingForm.value[galleryKey].length,
    };

    landingForm.value[galleryKey].push(newItem);
    Swal.fire({ icon: 'success', title: 'Archivo agregado', timer: 1200, showConfirmButton: false });
  } catch (err: any) {
    Swal.fire('Error', err.message || 'Error al subir archivo', 'error');
  }
};

const moveItem = (arr: any[], index: number, direction: number) => {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= arr.length) return;
  const temp = arr[index];
  arr[index] = arr[targetIndex];
  arr[targetIndex] = temp;
};

const removeItem = (arr: any[], index: number) => {
  arr.splice(index, 1);
};

const saveChanges = async () => {
  try {
    const res = await fetch(`${apiUrl}/landing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(landingForm.value),
    });

    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Error al guardar cambios');

    Swal.fire({
      icon: 'success',
      title: '✨ Landing Guardada',
      text: 'El contenido de la landing page ha sido actualizado en tiempo real.',
    });
  } catch (err: any) {
    Swal.fire('Error', err.message, 'error');
  }
};
</script>
