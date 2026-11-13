<template>
  <router-view />
  <AppToastContainer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useThemeStore } from './stores/themeStore';
import AppToastContainer from './components/common/AppToastContainer.vue';

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>
