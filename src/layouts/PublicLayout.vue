<template>
  <div style="min-height: 100vh; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;" class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
    <!-- Navbar (Transparente en Landing top, Fijo con GSAP Scroll-Hide en scroll) -->
    <header
      ref="headerRef"
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: ((isLanding || route.path === '/about') && !isScrolled) ? 'transparent' : undefined,
        background: ((isLanding || route.path === '/about') && !isScrolled) ? 'transparent' : undefined,
        borderBottom: ((isLanding || route.path === '/about') && !isScrolled) ? 'none' : undefined,
        boxShadow: ((isLanding || route.path === '/about') && !isScrolled) ? 'none' : undefined
      }"
      :class="[
        (isScrolled || (!isLanding && route.path !== '/about'))
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-transparent border-none shadow-none text-white'
      ]"
    >
      <div class="max-w-[1720px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-3.5 flex items-center justify-between">
        <!-- Logo Editorial de Marca (Leslie Uñitas & Pestañas) -->
        <router-link to="/" style="text-decoration: none; display: flex; align-items: center; gap: 0.6rem;" :class="((isLanding || route.path === '/about') && !isScrolled) ? 'text-white' : 'text-slate-900 dark:text-white'">
          <Sparkles style="width: 22px; height: 22px; color: #c43ec7; flex-shrink: 0;" />
          <div style="display: flex; flex-direction: column; line-height: 1;">
            <span style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.55rem; font-weight: 700; letter-spacing: -0.01em;">Leslie</span>
            <span style="font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; opacity: 0.8; margin-top: -1px;">Uñitas & Pestañas</span>
          </div>
        </router-link>

        <!-- Desktop Navigation (lg:flex, hidden on mobile/tablets < 1024px) -->
        <nav class="hidden lg:flex" style="align-items: center; gap: 2.25rem;">
          <template v-if="isLanding">
            <a href="#hero" @click.prevent="scrollToSection('hero')" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">INICIO</a>
            <a href="#about" @click.prevent="scrollToSection('about')" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">NOSOTROS</a>
            <a href="#work" @click.prevent="scrollToSection('work')" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">TRABAJO</a>
            <a href="#services" @click.prevent="scrollToSection('services')" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">SERVICIOS</a>
            <router-link to="/client/shop" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">TIENDA</router-link>
            <a href="#contact" @click.prevent="scrollToSection('contact')" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">CONTACTO</a>
          </template>
          <template v-else>
            <router-link to="/" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" class="text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]">INICIO</router-link>
            <router-link to="/about" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" class="text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]">NOSOTROS</router-link>
            <router-link to="/#work" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" class="text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]">TRABAJO</router-link>
            <router-link to="/#services" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" class="text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]">SERVICIOS</router-link>
            <router-link to="/client/shop" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" class="text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]">TIENDA</router-link>
            <router-link to="/#contact" style="text-decoration: none; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.2s;" class="text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]">CONTACTO</router-link>
          </template>

          <!-- Icono Carrito con Badge Contador -->
          <router-link
            to="/client/cart"
            style="position: relative; display: flex; align-items: center; justify-content: center; padding: 0.45rem; border-radius: 8px; text-decoration: none; transition: transform 0.2s;"
            :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'"
            class="active:scale-95"
            title="Ver Carrito de Compras"
          >
            <ShoppingCart style="width: 20px; height: 20px;" />
            <span
              v-if="cartStore.totalCount > 0"
              style="position: absolute; top: -4px; right: -6px; background: #c43ec7; color: white; font-size: 0.65rem; font-weight: 800; border-radius: 9999px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 4px; box-shadow: 0 2px 6px rgba(196,62,199,0.5);"
            >
              {{ cartStore.totalCount }}
            </span>
          </router-link>

          <!-- Toggle Modo Oscuro / Claro (GSAP) -->
          <button ref="themeBtnRef" @click="handleToggleTheme" style="border: none; padding: 0.45rem; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" class="bg-slate-100/20 hover:bg-slate-100/30 dark:bg-slate-800 text-amber-300 dark:text-amber-400 active:scale-95" :title="themeStore.theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'">
            <Sun v-if="themeStore.theme === 'dark'" style="width: 18px; height: 18px;" />
            <Moon v-else style="width: 18px; height: 18px;" />
          </button>

          <!-- Acción Pegada a la Derecha (Iniciar Sesión / Mi Perfil) -->
          <template v-if="authStore.isAuthenticated">
            <router-link to="/client/profile" style="text-decoration: none; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem;" :class="(isLanding && !isScrolled) ? 'text-white hover:text-[#c43ec7]' : 'text-slate-700 dark:text-slate-200 hover:text-[#c43ec7]'">
              <User style="width: 16px; height: 16px; color: #c43ec7;" /> Mi Perfil
            </router-link>

            <router-link v-if="authStore.userRole === 'admin' || authStore.userRole === 'superadmin'" to="/admin/dashboard" style="text-decoration: none; background: #3A113D; color: white; padding: 0.45rem 0.9rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
              Panel Admin
            </router-link>

            <button @click="handleLogout" style="border: none; padding: 0.45rem 0.85rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer; text-transform: uppercase;" class="bg-slate-800/80 text-white border border-slate-700 hover:bg-slate-700 active:scale-95">
              Salir
            </button>
          </template>

          <template v-else>
            <router-link
              to="/login"
              style="text-decoration: none; background: #3A113D; color: white; padding: 0.55rem 1.4rem; border-radius: 8px; font-weight: 800; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.08em; box-shadow: 0 4px 15px rgba(58,17,61,0.45); transition: transform 0.2s, background 0.2s;"
              class="hover:bg-[#2b0c2d] hover:scale-105 active:scale-95"
            >
              Iniciar Sesión
            </router-link>
          </template>
        </nav>

        <!-- Mobile / Tablet Header Right Controls (lg:hidden) -->
        <div class="flex lg:hidden" style="align-items: center; gap: 0.75rem;">
          <router-link
            to="/client/cart"
            style="position: relative; display: flex; align-items: center; justify-content: center; padding: 0.45rem; border-radius: 8px; text-decoration: none;"
            :class="(isLanding && !isScrolled) ? 'text-white' : 'text-slate-900 dark:text-white'"
            class="active:scale-95"
            title="Carrito"
          >
            <ShoppingCart style="width: 22px; height: 22px;" />
            <span
              v-if="cartStore.totalCount > 0"
              style="position: absolute; top: -3px; right: -5px; background: #c43ec7; color: white; font-size: 0.65rem; font-weight: 800; border-radius: 9999px; min-width: 17px; height: 17px; display: flex; align-items: center; justify-content: center; padding: 0 3px;"
            >
              {{ cartStore.totalCount }}
            </span>
          </router-link>

          <button @click="handleToggleTheme" style="border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;" class="bg-slate-100/20 hover:bg-slate-100/30 dark:bg-slate-800 text-amber-300 dark:text-amber-400 active:scale-95">
            <Sun v-if="themeStore.theme === 'dark'" style="width: 20px; height: 20px;" />
            <Moon v-else style="width: 20px; height: 20px;" />
          </button>

          <button @click="isMobileMenuOpen = true" style="border: none; background: transparent; padding: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;" :class="(isLanding && !isScrolled) ? 'text-white' : 'text-slate-900 dark:text-white'" class="active:scale-95">
            <Menu style="width: 28px; height: 28px;" />
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile / Tablet Drawer Off-Canvas Menu (Overlay GSAP) -->
    <transition name="drawer-fade">
      <div v-if="isMobileMenuOpen" style="position: fixed; inset: 0; z-index: 100; background: rgba(21, 7, 22, 0.98); backdrop-filter: blur(20px); display: flex; flex-direction: column; padding: 1.75rem 2rem; color: white;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <Sparkles style="width: 24px; height: 24px; color: #c43ec7;" />
            <div style="display: flex; flex-direction: column; line-height: 1;">
              <span style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.6rem; font-weight: 700; letter-spacing: -0.01em;">Leslie</span>
              <span style="font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; opacity: 0.8; margin-top: -1px;">Uñitas & Pestañas</span>
            </div>
          </div>
          <button @click="isMobileMenuOpen = false" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem; border-radius: 50%; cursor: pointer;" class="active:scale-95">
            <X style="width: 26px; height: 26px;" />
          </button>
        </div>

        <nav style="display: flex; flex-direction: column; gap: 1.5rem; font-size: 1.05rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;">
          <a href="#hero" @click.prevent="mobileNavTo('hero')" style="color: white; text-decoration: none;" class="hover:text-[#c43ec7]">INICIO</a>
          <a href="#about" @click.prevent="mobileNavTo('about')" style="color: white; text-decoration: none;" class="hover:text-[#c43ec7]">NOSOTROS</a>
          <a href="#work" @click.prevent="mobileNavTo('work')" style="color: white; text-decoration: none;" class="hover:text-[#c43ec7]">TRABAJO</a>
          <a href="#services" @click.prevent="mobileNavTo('services')" style="color: white; text-decoration: none;" class="hover:text-[#c43ec7]">SERVICIOS</a>
          <router-link to="/client/shop" @click="isMobileMenuOpen = false" style="color: white; text-decoration: none;" class="hover:text-[#c43ec7]">TIENDA</router-link>
          <router-link to="/client/cart" @click="isMobileMenuOpen = false" style="color: #f472b6; text-decoration: none; display: flex; align-items: center; justify-content: space-between;">
            <span>CARRITO</span>
            <span v-if="cartStore.totalCount > 0" style="background: #c43ec7; color: white; padding: 0.15rem 0.6rem; border-radius: 9999px; font-size: 0.8rem;">
              {{ cartStore.totalCount }}
            </span>
          </router-link>
          <a href="#contact" @click.prevent="mobileNavTo('contact')" style="color: white; text-decoration: none;" class="hover:text-[#c43ec7]">CONTACTO</a>

          <div style="height: 1px; background: rgba(255,255,255,0.12); margin: 1rem 0;"></div>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/client/profile" @click="isMobileMenuOpen = false" style="color: white; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
              <User style="width: 20px; height: 20px; color: #c43ec7;" /> Mi Perfil
            </router-link>
            <router-link v-if="authStore.userRole === 'admin' || authStore.userRole === 'superadmin'" to="/admin/dashboard" @click="isMobileMenuOpen = false" style="color: #c43ec7; text-decoration: none;">
              Panel Admin
            </router-link>
            <button @click="handleLogout" style="background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; padding: 0.75rem; border-radius: 8px; font-weight: 800; text-transform: uppercase; margin-top: 1rem; cursor: pointer;">
              Cerrar Sesión
            </button>
          </template>

          <template v-else>
            <router-link to="/login" @click="isMobileMenuOpen = false" style="background: #3A113D; color: white; padding: 0.85rem; border-radius: 8px; text-align: center; text-decoration: none; margin-top: 0.5rem; box-shadow: 0 6px 18px rgba(58,17,61,0.5);">Iniciar Sesión</router-link>
          </template>
        </nav>
      </div>
    </transition>

    <!-- Main Content (Full-width en Landing & About, Max-Width 1720px en Páginas Internas) -->
    <main
      :style="(isLanding || route.path === '/about') ? { width: '100%', margin: 0, padding: 0 } : undefined"
      :class="[
        (isLanding || route.path === '/about')
          ? ''
          : 'w-full max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 pt-24 pb-16 min-h-screen'
      ]"
    >
      <router-view />
    </main>

    <!-- Botón Flotante Volver Arriba (GSAP Animated) -->
    <BackToTopButton />

    <!-- Botón Flotante de WhatsApp Contextual (Icono Oficial) -->
    <WhatsappFloatingButton />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useCartStore } from '../stores/cartStore';
import { useRouter, useRoute } from 'vue-router';
import { Sun, Moon, User, Sparkles, Menu, X, ShoppingCart } from 'lucide-vue-next';
import WhatsappFloatingButton from '../components/common/WhatsappFloatingButton.vue';
import BackToTopButton from '../components/common/BackToTopButton.vue';
import gsap from 'gsap';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();

const headerRef = ref<HTMLElement | null>(null);
const themeBtnRef = ref<HTMLElement | null>(null);
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const isLanding = computed(() => route.path === '/');

let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let isHeaderHidden = false;

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isScrolled.value = currentScrollY > 40;

  if (headerRef.value) {
    if (currentScrollY <= 40) {
      // En la cima de la página: el header siempre se muestra transparente o sólido
      if (isHeaderHidden) {
        gsap.to(headerRef.value, { y: 0, duration: 0.35, ease: 'power2.out' });
        isHeaderHidden = false;
      }
    } else {
      // Fuera de la cima de la página
      // Ocultar al bajar, mostrar al subir en todas las páginas (incluyendo Landing)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        if (!isHeaderHidden) {
          gsap.to(headerRef.value, { y: -100, duration: 0.35, ease: 'power2.out' });
          isHeaderHidden = true;
        }
      } else if (currentScrollY < lastScrollY) {
        if (isHeaderHidden) {
          gsap.to(headerRef.value, { y: 0, duration: 0.35, ease: 'power2.out' });
          isHeaderHidden = false;
        }
      }
    }
  }

  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const mobileNavTo = (sectionId: string) => {
  isMobileMenuOpen.value = false;
  scrollToSection(sectionId);
};

const handleToggleTheme = () => {
  themeStore.toggleTheme();
  if (themeBtnRef.value) {
    gsap.fromTo(themeBtnRef.value, { rotate: 0, scale: 0.7 }, { rotate: 360, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
  }
};

const handleLogout = async () => {
  isMobileMenuOpen.value = false;
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
