import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Número canónico del negocio desde configuración del sistema (default para dev: +5215500000000)
const businessWhatsappNumber = ref<string>('+5215500000000');

export function useWhatsappCTA(customContext?: string) {
  const route = useRoute();

  onMounted(() => {
    // Si en el futuro se carga la info del negocio dinámicamente desde API
    const envNum = import.meta.env.VITE_BUSINESS_WHATSAPP;
    if (envNum) {
      businessWhatsappNumber.value = envNum;
    }
  });

  const isAvailable = computed(() => {
    const num = businessWhatsappNumber.value?.replace(/\D/g, '');
    return Boolean(num && num.length >= 10);
  });

  const whatsappUrl = computed(() => {
    if (!isAvailable.value) return '';

    const cleanNum = businessWhatsappNumber.value.replace(/\D/g, '');
    const currentPath = route?.path || '';
    const ctx = customContext || (
      currentPath.includes('/client/book') ? 'booking' :
      currentPath.includes('/client/shop') || currentPath.includes('/client/cart') ? 'shop' :
      'landing'
    );

    let message = '¡Hola! Me gustaría recibir información general sobre sus servicios en AppSalon.';
    if (ctx === 'booking') {
      message = 'Hola, quiero información para agendar una cita en el salón.';
    } else if (ctx === 'shop') {
      message = 'Hola, tengo una duda sobre un producto de la tienda.';
    }

    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
  });

  return {
    isAvailable,
    whatsappUrl,
  };
}
