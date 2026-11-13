import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ServiceItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  category?: { _id: string; name: string };
  imageUrl?: string;
  isActive: boolean;
}

export const useBusinessStore = defineStore('business', () => {
  const catalogServices = ref<ServiceItem[]>([]);
  const loading = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  const fetchCatalogServices = async () => {
    loading.value = true;
    try {
      const res = await fetch(`${apiUrl}/services`);
      if (res.ok) {
        const data = await res.json();
        catalogServices.value = data.services || [];
      }
    } catch (e) {
      // Fallback si la API no estuviera disponible
      catalogServices.value = [
        { _id: '1', name: 'Corte de Cabello + Peinado', description: 'Corte personalizado y peinado profesional', price: 350, durationMinutes: 60, isActive: true },
        { _id: '2', name: 'Tinte Completo', description: 'Aplicación de tinte en todo el cabello con tratamiento', price: 800, durationMinutes: 90, isActive: true },
        { _id: '3', name: 'Manicura Gel', description: 'Manicura completa con esmaltado en gel de larga duración', price: 250, durationMinutes: 45, isActive: true },
      ];
    } finally {
      loading.value = false;
    }
  };

  return {
    catalogServices,
    loading,
    fetchCatalogServices,
  };
});
