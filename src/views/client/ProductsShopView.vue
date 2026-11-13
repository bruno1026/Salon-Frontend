<template>
  <div class="shop-page-wrapper" style="font-family: 'Outfit', sans-serif;">
    <!-- 1. HERO BANNER DE LA TIENDA -->
    <section class="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-slate-900 via-[#270e29] to-slate-900 text-white p-6 sm:p-10 border border-purple-900/30 shadow-xl">
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles class="w-3.5 h-3.5" /> Boutique & E-Commerce Oficial
        </div>
        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight mb-3" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          Productos Profesionales de Belleza
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
          Adquiere los mismos tratamientos, esmaltes y cuidados capilares de alta gama que utilizamos en el salón.
          <strong>Compra de inmediato sin necesidad de registro ni inicio de sesión.</strong>
        </p>

        <!-- Píldoras de beneficios -->
        <div class="flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
            <CheckCircle class="w-3.5 h-3.5 text-emerald-400" /> Compra Exprés como Invitado
          </span>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
            <CheckCircle class="w-3.5 h-3.5 text-emerald-400" /> Reserva Exclusiva de Stock
          </span>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
            <CheckCircle class="w-3.5 h-3.5 text-emerald-400" /> Retiro en Salón o Pago en Línea
          </span>
        </div>
      </div>

      <!-- Decorativo de Fondo -->
      <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-1/3 -top-12 w-60 h-60 bg-purple-700/15 rounded-full blur-3xl pointer-events-none"></div>
    </section>

    <!-- 2. BARRA DE CONTROLES: BÚSQUEDA, FILTROS Y CARRITO FLOTANTE -->
    <div class="sticky top-20 z-30 mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all">
      <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <!-- Buscador con icono -->
        <div class="relative flex-1">
          <Search class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar productos por nombre, marca o descripción..."
            class="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#c43ec7] text-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Limpiar búsqueda"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Selector de Ordenamiento -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">Ordenar por:</label>
          <select
            v-model="sortBy"
            class="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#c43ec7]"
          >
            <option value="featured">Destacados</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="name_asc">Nombre: A - Z</option>
            <option value="sales">Solo Ofertas</option>
          </select>

          <!-- Botón de Abrir Carrito Drawer -->
          <button
            @click="cartStore.toggleDrawer()"
            class="relative flex items-center gap-2 py-2.5 px-4 rounded-lg bg-[#3A113D] dark:bg-[#c43ec7] text-white font-bold text-sm shadow-md hover:bg-[#2c0c2e] dark:hover:bg-[#a62ba9] transition-transform active:scale-95"
            title="Abrir Carrito"
          >
            <ShoppingCart class="w-4 h-4" />
            <span class="hidden sm:inline">Carrito</span>
            <span class="bg-white text-[#3A113D] dark:text-[#a62ba9] font-black text-xs px-2 py-0.5 rounded-full">
              {{ cartStore.totalCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Filtros Rápidos: Categorías & Estado -->
      <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <!-- Filtro Estado -->
        <button
          @click="selectedStatus = 'all'"
          :class="[
            selectedStatus === 'all'
              ? 'bg-[#3A113D] text-white dark:bg-[#c43ec7]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
          class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
        >
          Todos ({{ products.length }})
        </button>

        <button
          @click="selectedStatus = 'sale'"
          :class="[
            selectedStatus === 'sale'
              ? 'bg-pink-600 text-white'
              : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100'
          ]"
          class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
        >
          ⚡ En Oferta
        </button>

        <button
          @click="selectedStatus = 'new'"
          :class="[
            selectedStatus === 'new'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
          ]"
          class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
        >
          ✨ Nuevos
        </button>

        <button
          @click="selectedStatus = 'instock'"
          :class="[
            selectedStatus === 'instock'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
          ]"
          class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
        >
          ✓ En Stock
        </button>

        <div class="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <!-- Categorías dinámicas -->
        <button
          v-for="cat in availableCategories"
          :key="cat"
          @click="selectedCategory = (selectedCategory === cat ? '' : cat)"
          :class="[
            selectedCategory === cat
              ? 'bg-purple-700 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
          class="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
        >
          {{ cat }}
        </button>

        <!-- Limpiar filtros si alguno está activo -->
        <button
          v-if="searchQuery || selectedCategory || selectedStatus !== 'all' || sortBy !== 'featured'"
          @click="resetFilters"
          class="ml-auto text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
        >
          <X class="w-3.5 h-3.5" /> Restablecer filtros
        </button>
      </div>
    </div>

    <!-- 3. ESTADOS DE CARGA / VACÍO -->
    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div class="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm my-6">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
        <ShoppingBag class="w-8 h-8" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2" style="font-family: 'Cormorant Garamond', Georgia, serif;">
        No encontramos productos con estos criterios
      </h3>
      <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
        Intenta cambiando el término de búsqueda o seleccionando otra categoría.
      </p>
      <button
        @click="resetFilters"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3A113D] text-white text-sm font-bold shadow hover:bg-[#2b0c2d]"
      >
        Ver Todos los Productos
      </button>
    </div>

    <!-- 4. GRID PRINCIPAL DE PRODUCTOS -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="prod in filteredProducts"
        :key="prod._id"
        class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
      >
        <!-- Imagen / Header de Tarjeta -->
        <div class="relative w-full h-52 bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
          <img
            v-if="prod.imageUrl"
            :src="prod.imageUrl"
            :alt="prod.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div v-else class="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <ShoppingBag class="w-12 h-12 mb-2 text-[#c43ec7]/40" />
            <span class="text-xs uppercase font-bold tracking-wider text-slate-400">Leslie Care</span>
          </div>

          <!-- Badges Superpuestos -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span
              v-if="prod.isOnSale"
              class="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1"
            >
              ⚡ {{ calculateDiscountPercent(prod) }}% OFF
            </span>
            <span
              v-else-if="prod.isNew"
              class="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              ✨ Nuevo
            </span>
          </div>

          <!-- Stock Pill Top-Right -->
          <div class="absolute top-3 right-3 z-10">
            <span
              v-if="prod.availableStock > 5"
              class="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-sm"
            >
              ✓ {{ prod.availableStock }} en stock
            </span>
            <span
              v-else-if="prod.availableStock > 0"
              class="px-2.5 py-1 rounded-md bg-amber-500/95 backdrop-blur-sm text-slate-900 text-[11px] font-extrabold shadow-sm"
            >
              ⚠️ ¡Solo {{ prod.availableStock }} disp.!
            </span>
            <span
              v-else
              class="px-2.5 py-1 rounded-md bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-sm"
            >
              Agotado
            </span>
          </div>
        </div>

        <!-- Cuerpo de Tarjeta -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Categoría -->
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                {{ getCategoryName(prod) }}
              </span>
              <span v-if="prod.reservedStock > 0" class="text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                ⏳ {{ prod.reservedStock }} en proceso
              </span>
            </div>

            <!-- Nombre -->
            <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-1 leading-snug line-clamp-1" style="font-family: 'Cormorant Garamond', Georgia, serif;">
              {{ prod.name }}
            </h3>

            <!-- Descripción Corta -->
            <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
              {{ prod.description || 'Fórmula profesional para el cuidado y brillo exclusivo de tus uñas, piel o cabello.' }}
            </p>
          </div>

          <!-- Precios y Acciones -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700/80">
            <!-- Bloque de Precio -->
            <div class="flex items-baseline justify-between mb-4">
              <div v-if="prod.isOnSale" class="flex flex-col">
                <span class="text-xs text-slate-400 line-through font-medium">${{ prod.price }} MXN</span>
                <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${{ prod.salePrice }} <span class="text-xs font-semibold text-slate-500">MXN</span>
                </span>
              </div>
              <div v-else>
                <span class="text-2xl font-black text-slate-900 dark:text-white">
                  ${{ prod.price }} <span class="text-xs font-semibold text-slate-500">MXN</span>
                </span>
              </div>

              <!-- Selector de Cantidad -->
              <div v-if="prod.availableStock > 0" class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                <button
                  @click="decreaseQty(prod._id)"
                  class="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-bold transition-colors"
                  title="Menos"
                >
                  -
                </button>
                <span class="px-2.5 py-1 text-xs font-extrabold text-slate-800 dark:text-slate-200 min-w-[24px] text-center">
                  {{ productQuantities[prod._id] || 1 }}
                </span>
                <button
                  @click="increaseQty(prod._id, prod.availableStock)"
                  class="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-bold transition-colors"
                  title="Más"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Botones de Acción (Agregar / Comprar Ahora) -->
            <div class="flex flex-col gap-2">
              <button
                @click="handleAddToCart(prod)"
                :disabled="prod.availableStock <= 0"
                class="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#3A113D] dark:bg-[#c43ec7] text-white hover:bg-[#2b0c2d] dark:hover:bg-[#a62ba9] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-98"
              >
                <ShoppingBag class="w-4 h-4" />
                {{ prod.availableStock > 0 ? 'Agregar al Carrito' : 'Sin Stock Disponible' }}
              </button>

              <button
                v-if="prod.availableStock > 0"
                @click="handleBuyNow(prod)"
                class="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-[#3A113D] dark:border-[#c43ec7] text-[#3A113D] dark:text-[#f472b6] hover:bg-pink-50 dark:hover:bg-purple-950/30 transition-all active:scale-98"
              >
                Comprar Ahora <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. SLIDE-OVER CART DRAWER INTERACTIVO -->
    <transition name="drawer-slide">
      <div v-if="cartStore.isDrawerOpen" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          @click="cartStore.closeDrawer()"
        ></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
            <!-- Header Drawer -->
            <div class="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <ShoppingCart class="w-5 h-5 text-[#c43ec7]" />
                <h2 class="text-lg font-bold text-slate-900 dark:text-white" style="font-family: 'Cormorant Garamond', Georgia, serif;">
                  Tu Carrito ({{ cartStore.totalCount }})
                </h2>
              </div>
              <button
                @click="cartStore.closeDrawer()"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Items del Carrito -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <div v-if="cartStore.isEmpty" class="text-center py-16 text-slate-400">
                <ShoppingCart class="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p class="font-bold text-slate-600 dark:text-slate-300">Tu carrito está vacío</p>
                <p class="text-xs text-slate-400 mt-1">Agrega productos para disfrutarlos en casa.</p>
              </div>

              <div
                v-else
                v-for="item in cartStore.items"
                :key="item.product._id"
                class="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50"
              >
                <!-- Thumbnail -->
                <div class="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    v-if="item.product.imageUrl"
                    :src="item.product.imageUrl"
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                  <ShoppingBag v-else class="w-6 h-6 text-slate-400" />
                </div>

                <!-- Info -->
                <div class="flex-1 flex flex-col justify-between">
                  <div class="flex justify-between items-start gap-2">
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-tight line-clamp-1">
                      {{ item.product.name }}
                    </h4>
                    <button
                      @click="handleRemoveFromCart(item.product._id, item.product.name)"
                      class="text-rose-500 hover:text-rose-700 p-1"
                      title="Eliminar"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>

                  <div class="text-xs text-slate-500 dark:text-slate-400">
                    ${{ item.effectivePrice }} MXN c/u
                  </div>

                  <!-- Controls Qty & Subtotal -->
                  <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900">
                      <button
                        @click="cartStore.updateQuantity(item.product._id, item.quantity - 1)"
                        class="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        -
                      </button>
                      <span class="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {{ item.quantity }}
                      </span>
                      <button
                        @click="cartStore.updateQuantity(item.product._id, item.quantity + 1)"
                        class="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>

                    <span class="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      ${{ item.effectivePrice * item.quantity }} MXN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Drawer: Totales y Botón a Checkout -->
            <div v-if="!cartStore.isEmpty" class="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
              <div class="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
                <span>Subtotal ({{ cartStore.totalCount }} piezas):</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">${{ cartStore.totalAmount }} MXN</span>
              </div>
              <div class="flex items-center justify-between text-lg font-black text-slate-900 dark:text-white mb-4">
                <span>Total Estimado:</span>
                <span class="text-emerald-600 dark:text-emerald-400">${{ cartStore.totalAmount }} MXN</span>
              </div>

              <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-4 bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                🔒 Compra 100% segura. Puedes pagar en línea o al recoger en el salón. No necesitas crear una cuenta.
              </div>

              <router-link
                to="/client/cart"
                @click="cartStore.closeDrawer()"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-[#3A113D] dark:bg-[#c43ec7] text-white hover:bg-[#2b0c2d] dark:hover:bg-[#a62ba9] transition-all shadow-lg active:scale-98"
              >
                Proceder al Pago <ArrowRight class="w-4 h-4" />
              </router-link>

              <button
                @click="handleClearCart"
                class="w-full mt-2 text-xs font-semibold text-rose-500 hover:text-rose-700 text-center py-1"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useToastStore } from '../../stores/toastStore';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  X,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Trash2,
} from 'lucide-vue-next';
import io, { Socket } from 'socket.io-client';

const router = useRouter();
const cartStore = useCartStore();
const toastStore = useToastStore();

const products = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref<'all' | 'sale' | 'new' | 'instock'>('all');
const sortBy = ref('featured');

// Control de cantidad por producto en la tarjeta
const productQuantities = ref<Record<string, number>>({});

const apiUrl = import.meta.env.VITE_API_URL || '/api';
let socket: Socket | null = null;

onMounted(() => {
  fetchProducts();
  initSocket();
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${apiUrl}/products/public`);
    if (res.ok) {
      const data = await res.json();
      products.value = data.products || [];
      // Inicializar cantidades por producto en 1
      products.value.forEach((p) => {
        if (!productQuantities.value[p._id]) {
          productQuantities.value[p._id] = 1;
        }
      });
    }
  } catch (e) {
    console.error('Error al cargar productos:', e);
  } finally {
    loading.value = false;
  }
};

const initSocket = () => {
  if (socket) return;
  socket = io({ credentials: true });

  socket.on('stock:updated', (data) => {
    const prod = products.value.find((p) => p._id === data.productId);
    if (prod) {
      prod.stockTotal = data.stockTotal;
      prod.reservedStock = data.reservedStock;
      prod.availableStock = data.availableStock;
    }
  });
};

// Categorías extraídas dinámicamente de los productos activos
const availableCategories = computed(() => {
  const cats = new Set<string>();
  products.value.forEach((p) => {
    const name = getCategoryName(p);
    if (name && name !== 'General') cats.add(name);
  });
  return Array.from(cats);
});

const getCategoryName = (prod: any): string => {
  if (typeof prod.category === 'object' && prod.category?.name) {
    return prod.category.name;
  }
  return 'General';
};

const calculateDiscountPercent = (prod: any): number => {
  if (!prod.price || !prod.salePrice || prod.price <= prod.salePrice) return 0;
  return Math.round(((prod.price - prod.salePrice) / prod.price) * 100);
};

const increaseQty = (productId: string, maxStock: number) => {
  const current = productQuantities.value[productId] || 1;
  if (current < maxStock) {
    productQuantities.value[productId] = current + 1;
  }
};

const decreaseQty = (productId: string) => {
  const current = productQuantities.value[productId] || 1;
  if (current > 1) {
    productQuantities.value[productId] = current - 1;
  }
};

// Filtrado y Ordenamiento
const filteredProducts = computed(() => {
  let list = [...products.value];

  // 1. Filtro por Búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      getCategoryName(p).toLowerCase().includes(query)
    );
  }

  // 2. Filtro por Categoría
  if (selectedCategory.value) {
    list = list.filter((p) => getCategoryName(p) === selectedCategory.value);
  }

  // 3. Filtro por Estado
  if (selectedStatus.value === 'sale') {
    list = list.filter((p) => p.isOnSale);
  } else if (selectedStatus.value === 'new') {
    list = list.filter((p) => p.isNew);
  } else if (selectedStatus.value === 'instock') {
    list = list.filter((p) => p.availableStock > 0);
  }

  // 4. Ordenamiento
  if (sortBy.value === 'price_asc') {
    list.sort((a, b) => (a.effectivePrice || a.price) - (b.effectivePrice || b.price));
  } else if (sortBy.value === 'price_desc') {
    list.sort((a, b) => (b.effectivePrice || b.price) - (a.effectivePrice || a.price));
  } else if (sortBy.value === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'sales') {
    list.sort((a, b) => (b.isOnSale ? 1 : 0) - (a.isOnSale ? 1 : 0));
  }

  return list;
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedStatus.value = 'all';
  sortBy.value = 'featured';
};

// Acciones de Carrito
const handleAddToCart = (prod: any) => {
  const qty = productQuantities.value[prod._id] || 1;
  const result = cartStore.addItem(prod, qty);

  if (result.success) {
    toastStore.cart('¡Agregado al Carrito!', {
      message: `${qty}x ${prod.name}`,
      productImage: prod.imageUrl,
      duration: 4500,
      action: {
        label: 'Ver Carrito',
        onClick: () => cartStore.openDrawer(),
      },
    });
  } else {
    toastStore.warning('Stock Limitado', {
      message: result.message,
    });
  }
};

const handleRemoveFromCart = (productId: string, productName: string) => {
  cartStore.removeItem(productId);
  toastStore.info('Producto removido', {
    message: `Se quitó "${productName}" del carrito.`,
  });
};

const handleClearCart = () => {
  cartStore.clearCart();
  toastStore.info('Carrito vaciado', {
    message: 'Se han eliminado todos los productos del carrito.',
  });
};

const handleBuyNow = (prod: any) => {
  const qty = productQuantities.value[prod._id] || 1;
  const result = cartStore.addItem(prod, qty);
  if (result.success) {
    router.push('/client/cart');
  }
};
</script>

<style scoped>
/* Animaciones Slide-over Drawer */
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
