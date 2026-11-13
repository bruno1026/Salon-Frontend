<template>
  <a
    v-if="isAvailable"
    ref="buttonRef"
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    title="Contactar por WhatsApp"
    style="position: fixed; bottom: 28px; right: 28px; z-index: 9999; width: 48px; height: 48px; border-radius: 50%; background: #25d366; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45); text-decoration: none; cursor: pointer; border: none; transition: transform 0.16s ease, background 0.2s ease;"
    class="hover:bg-emerald-500 active:scale-95"
  >
    <!-- SVG Vectorial Oficial Marca WhatsApp (Teléfono + Chat Bubble) -->
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.288-1.125z"/>
      <path d="M9.3 7.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.7.7-.7 1.7.7 2 1 2.3c.2.3 1.5 2.3 3.6 3.2 1.8.8 2.2.6 2.6.6s1.3-.5 1.5-1.1c.2-.6.2-1.1.1-1.2s-.3-.2-.6-.3l-1.8-.9c-.3-.1-.5 0-.7.2l-.8.9c-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.4-1.8-1.6-2.1s0-.5.1-.6l.5-.6c.2-.2.2-.4.1-.6l-1.1-2.4z"/>
    </svg>
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWhatsappCTA } from '../../composables/useWhatsappCTA';
import gsap from 'gsap';

const { isAvailable, whatsappUrl } = useWhatsappCTA();
const buttonRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (buttonRef.value) {
    gsap.to(buttonRef.value, {
      scale: 1.06,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
});
</script>
