<template>
  <button
    v-show="isVisible"
    ref="buttonRef"
    @click="scrollToTop"
    title="Volver arriba"
    style="position: fixed; bottom: 88px; right: 28px; z-index: 9998; background: transparent; border: none; outline: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, filter 0.2s ease;"
    class="hover:scale-115 active:scale-95 drop-shadow-md"
  >
    <img :src="dedoImg" alt="Volver arriba" style="width: 46px; height: 46px; object-fit: contain;" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import gsap from 'gsap';
import dedoImg from '../../assets/dedo.png';

const buttonRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const handleScroll = () => {
  const shouldShow = window.scrollY > 400;
  if (shouldShow !== isVisible.value) {
    isVisible.value = shouldShow;
  }
};

watch(isVisible, (val) => {
  if (val && buttonRef.value) {
    gsap.fromTo(
      buttonRef.value,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
  }
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
