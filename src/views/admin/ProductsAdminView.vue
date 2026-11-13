<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- TailAdmin Header Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="margin: 0; font-size: 1.6rem; font-weight: 800;" class="text-slate-900 dark:text-white">
          Gestión de Inventario (Productos)
        </h1>
        <p style="margin: 0.25rem 0 0; font-size: 0.875rem;" class="text-slate-500 dark:text-slate-400">
          Administra el catálogo de productos, existencias en tiempo real y promociones de la tienda.
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <!-- Botón Exportar CSV -->
        <button
          @click="exportCSV"
          style="display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; cursor: pointer;"
          class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <Download style="width: 16px; height: 16px;" />
          Exportar CSV
        </button>

        <!-- Botón Add Product (Permiso products:create) -->
        <button
          v-if="authStore.hasPermission('products', 'create')"
          @click="openAddModal"
          style="display: flex; align-items: center; gap: 0.5rem; background: #3A113D; color: white; border: none; padding: 0.6rem 1.1rem; border-radius: 8px; font-weight: 700; font-size: 0.875rem; cursor: pointer; box-shadow: 0 4px 12px rgba(58,17,61,0.25);"
          class="hover:bg-[#2c0d2e]"
        >
          <Plus style="width: 18px; height: 18px;" />
          + Add Product
        </button>
      </div>
    </div>

    <!-- TailAdmin Controls & Filters Bar -->
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; padding: 1rem; border-radius: 12px;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <!-- Search Input -->
      <div style="position: relative; flex: 1; min-width: 240px;">
        <Search style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #94a3b8;" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto por nombre o descripción..."
          style="width: 100%; padding: 0.6rem 0.75rem 0.6rem 2.4rem; border-radius: 8px; font-size: 0.875rem; outline: none;"
          class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      <!-- Filter Category -->
      <select
        v-model="selectedCategory"
        style="padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.875rem; outline: none; cursor: pointer;"
        class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
      >
        <option value="">Todas las Categorías</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
      </select>

      <!-- Filter Stock Status -->
      <select
        v-model="selectedStockStatus"
        style="padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.875rem; outline: none; cursor: pointer;"
        class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
      >
        <option value="">Todos los Estados de Stock</option>
        <option value="1_en_stock">En Stock</option>
        <option value="2_por_comprar">Agotado en Reserva</option>
        <option value="3_sin_stock">Sin Stock</option>
      </select>
    </div>

    <!-- Products Data Table (TailAdmin Style) -->
    <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; font-weight: 700;" class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 dark:border-slate-700">
              <th style="padding: 0.9rem 1.25rem; width: 40px;">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
              </th>
              <th style="padding: 0.9rem 1.25rem;">Producto</th>
              <th style="padding: 0.9rem 1.25rem;">Categoría</th>
              <th style="padding: 0.9rem 1.25rem;">Precio</th>
              <th style="padding: 0.9rem 1.25rem;">Estado de Stock (Entregable 6)</th>
              <th style="padding: 0.9rem 1.25rem;">Fecha Creación</th>
              <th style="padding: 0.9rem 1.25rem; text-align: right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prod in filteredProducts"
              :key="prod._id"
              style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/40 dark:border-slate-700/60"
            >
              <td style="padding: 0.9rem 1.25rem;">
                <input type="checkbox" :value="prod._id" v-model="selectedProductIds" />
              </td>

              <!-- Product Thumb & Name -->
              <td style="padding: 0.9rem 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 44px; height: 44px; border-radius: 8px; overflow: hidden; background: #f8fafc; border: 1px solid #e2e8f0; flex-shrink: 0; display: flex; align-items: center; justify-content: center;" class="dark:bg-slate-900 dark:border-slate-700">
                    <img v-if="prod.imageUrl" :src="prod.imageUrl" :alt="prod.name" style="width: 100%; height: 100%; object-fit: cover;" />
                    <Package v-else style="width: 22px; height: 22px; color: #94a3b8;" />
                  </div>
                  <div>
                    <div style="font-weight: 700;" class="text-slate-900 dark:text-white">
                      {{ prod.name }}
                    </div>
                    <div style="font-size: 0.75rem; margin-top: 0.1rem;" class="text-slate-500 dark:text-slate-400">
                      ID: {{ prod._id.slice(-6) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td style="padding: 0.9rem 1.25rem;" class="text-slate-700 dark:text-slate-300">
                <span style="background: #f1f5f9; padding: 0.25rem 0.65rem; border-radius: 6px; font-weight: 600; font-size: 0.78rem;" class="dark:bg-slate-700/60 dark:text-slate-200">
                  {{ prod.category?.name || 'Sin Categoría' }}
                </span>
              </td>

              <!-- Price & Offer Badge -->
              <td style="padding: 0.9rem 1.25rem;">
                <div v-if="prod.isOnSale" style="display: flex; flex-direction: column;">
                  <span style="font-size: 0.78rem; text-decoration: line-through;" class="text-slate-400">
                    ${{ prod.price }} MXN
                  </span>
                  <span style="font-weight: 800; font-size: 0.95rem;" class="text-emerald-600 dark:text-emerald-400">
                    ⚡ ${{ prod.salePrice }} MXN
                  </span>
                </div>
                <div v-else style="font-weight: 700;" class="text-slate-900 dark:text-white">
                  ${{ prod.price }} MXN
                </div>
              </td>

              <!-- Stock Badge Entregable 6 -->
              <td style="padding: 0.9rem 1.25rem;">
                <!-- Verde: En Stock (coexistencia disponible vs reservado) -->
                <span
                  v-if="prod.computedStatus === '1_en_stock'"
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #dcfce7; color: #15803d; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span>
                  En Stock ({{ prod.availableStock }} disp{{ prod.reservedStock > 0 ? `, ${prod.reservedStock} reserv` : '' }})
                </span>

                <!-- Amarillo: Agotado en Reserva -->
                <span
                  v-else-if="prod.computedStatus === '2_por_comprar'"
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fef3c7; color: #b45309; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-amber-950/60 dark:text-amber-300"
                >
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #d97706;"></span>
                  Agotado en reserva ({{ prod.reservedStock }} en carritos)
                </span>

                <!-- Rojo: Sin Stock -->
                <span
                  v-else
                  style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fee2e2; color: #b91c1c; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;"
                  class="dark:bg-red-950/60 dark:text-red-300"
                >
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #dc2626;"></span>
                  Sin Stock
                </span>
              </td>

              <!-- Created At -->
              <td style="padding: 0.9rem 1.25rem;" class="text-slate-500 dark:text-slate-400">
                {{ formatDate(prod.createdAt) }}
              </td>

              <!-- Actions Dropdown ••• -->
              <td style="padding: 0.9rem 1.25rem; text-align: right; position: relative;">
                <div style="display: inline-block;">
                  <button
                    @click="activeActionMenuId = activeActionMenuId === prod._id ? null : prod._id"
                    style="background: transparent; border: none; padding: 0.4rem; border-radius: 6px; cursor: pointer;"
                    class="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                  >
                    <MoreVertical style="width: 18px; height: 18px;" />
                  </button>

                  <!-- Popover Dropdown -->
                  <div
                    v-if="activeActionMenuId === prod._id"
                    style="position: absolute; right: 1.25rem; top: 2.5rem; width: 170px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15); z-index: 40; padding: 0.4rem; text-align: left;"
                    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <button
                      v-if="authStore.hasPermission('products', 'edit')"
                      @click="openEditModal(prod)"
                      style="width: 100%; text-align: left; border: none; background: transparent; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
                      class="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit style="width: 15px; height: 15px; color: #3b82f6;" />
                      Editar
                    </button>

                    <button
                      v-if="authStore.hasPermission('products', 'manage_offers')"
                      @click="openOfferModal(prod)"
                      style="width: 100%; text-align: left; border: none; background: transparent; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
                      class="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Zap style="width: 15px; height: 15px; color: #c43ec7;" />
                      Enviar a Oferta
                    </button>

                    <button
                      v-if="authStore.hasPermission('products', 'delete')"
                      @click="handleDelete(prod)"
                      style="width: 100%; text-align: left; border: none; background: transparent; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
                      class="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <Trash2 style="width: 15px; height: 15px;" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" style="text-align: center; padding: 3rem 1rem;" class="text-slate-500 dark:text-slate-400">
                No se encontraron productos coincidentes en el inventario.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL FORM: Add / Edit Product (TailAdmin Structure) -->
    <div v-if="showModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1.5rem;">
      <div style="width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; border-radius: 16px; padding: 1.75rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="margin: 0; font-weight: 800; font-size: 1.25rem;" class="text-slate-900 dark:text-white">
            {{ isEditing ? 'Editar Producto' : 'Crear Nuevo Producto' }}
          </h2>
          <button @click="showModal = false" style="background: transparent; border: none; cursor: pointer;" class="text-slate-400 hover:text-slate-600">
            <X style="width: 22px; height: 22px;" />
          </button>
        </div>

        <form @submit.prevent="saveProduct" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Product Name & Category -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Product Name</label>
              <input v-model="form.name" type="text" placeholder="Ej. Champú Reparador Keratina" required style="width: 100%; padding: 0.65rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Category</label>
              <select v-model="form.category" required style="width: 100%; padding: 0.65rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                <option value="" disabled>Seleccionar Categoría</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Descripción detallada del producto..." style="width: 100%; padding: 0.65rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"></textarea>
          </div>

          <!-- Pricing & Stock Stepper -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Precio Regular ($ MXN)</label>
              <input v-model.number="form.price" type="number" step="0.01" min="0" required style="width: 100%; padding: 0.65rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Stock Quantity (Total)</label>
              <div style="display: flex; align-items: center; border-radius: 8px; overflow: hidden;" class="border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <button type="button" @click="form.stockTotal = Math.max(0, form.stockTotal - 1)" style="padding: 0.65rem 1rem; border: none; background: transparent; cursor: pointer; font-weight: 800;" class="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">-</button>
                <input v-model.number="form.stockTotal" type="number" min="0" required style="width: 100%; text-align: center; border: none; background: transparent; outline: none; font-weight: 700;" class="text-slate-900 dark:text-white" />
                <button type="button" @click="form.stockTotal++" style="padding: 0.65rem 1rem; border: none; background: transparent; cursor: pointer; font-weight: 800;" class="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">+</button>
              </div>
            </div>
          </div>

          <!-- Drag and Drop Image Upload Zone (Cloudinary) -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-300">Products Images</label>
            <div style="border: 2px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; position: relative;" class="dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <input type="file" accept="image/*" @change="handleFileUpload" style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;" />
              <UploadCloud style="width: 32px; height: 32px; margin: 0 auto 0.5rem;" class="text-[#3A113D] dark:text-[#f472b6]" />
              <p style="margin: 0; font-size: 0.85rem; font-weight: 600;" class="text-slate-700 dark:text-slate-300">
                <span style="color: #c43ec7;">Click to upload</span> or drag and drop image file
              </p>
              <p style="margin: 0.25rem 0 0; font-size: 0.75rem;" class="text-slate-400">PNG, JPG, WEBP (Max. 5MB)</p>
              <div v-if="form.imageUrl" style="margin-top: 0.75rem; font-size: 0.8rem; font-weight: 700; color: #10b981;">
                ✓ Imagen asignada: {{ form.imageUrl.slice(-25) }}
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
            <button type="button" @click="showModal = false" style="padding: 0.65rem 1.25rem; border-radius: 8px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; cursor: pointer;" class="dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Cancelar
            </button>
            <button type="submit" :disabled="submitting" style="padding: 0.65rem 1.5rem; border-radius: 8px; border: none; background: #3A113D; color: white; font-weight: 700; cursor: pointer;" class="hover:bg-[#2b0c2d]">
              {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Publish Product') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Enviar a Oferta -->
    <div v-if="showOfferModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1.5rem;">
      <div style="width: 100%; max-width: 480px; border-radius: 16px; padding: 1.5rem;" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;" class="text-slate-900 dark:text-white">
            <Zap style="width: 20px; height: 20px; color: #c43ec7;" />
            Enviar a Oferta con Vigencia
          </h3>
          <button @click="showOfferModal = false" style="background: transparent; border: none; cursor: pointer;" class="text-slate-400">
            <X style="width: 20px; height: 20px;" />
          </button>
        </div>

        <form @submit.prevent="saveOffer" style="display: flex; flex-direction: column; gap: 1.1rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem;" class="text-slate-700 dark:text-slate-300">Producto</label>
            <input :value="selectedProductForOffer?.name" disabled style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem;" class="text-slate-700 dark:text-slate-300">Precio Original</label>
              <input :value="`$${selectedProductForOffer?.price} MXN`" disabled style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem;" class="text-slate-700 dark:text-slate-300">Precio Oferta ($ MXN)</label>
              <input v-model.number="offerForm.salePrice" type="number" step="0.01" min="0" required style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem;" class="text-slate-700 dark:text-slate-300">Fecha de Expiración (Opcional)</label>
            <input v-model="offerForm.saleEndDate" type="datetime-local" style="width: 100%; padding: 0.6rem; border-radius: 8px; font-size: 0.875rem;" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" />
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem;">
            <input type="checkbox" id="saleActiveCheck" v-model="offerForm.saleActive" style="width: 18px; height: 18px; cursor: pointer;" />
            <label for="saleActiveCheck" style="font-weight: 700; font-size: 0.875rem; cursor: pointer;" class="text-slate-800 dark:text-slate-200">
              Activar Oferta Inmediatamente
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.75rem;">
            <button type="button" @click="showOfferModal = false" style="padding: 0.6rem 1.1rem; border-radius: 8px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; cursor: pointer;" class="dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Cancelar
            </button>
            <button type="submit" style="padding: 0.6rem 1.25rem; border-radius: 8px; border: none; background: #c43ec7; color: white; font-weight: 700; cursor: pointer;">
              Guardar Oferta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import {
  Search,
  Plus,
  Download,
  Package,
  MoreVertical,
  Edit,
  Trash2,
  Zap,
  X,
  UploadCloud,
} from 'lucide-vue-next';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_API_URL || '/api';

const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStockStatus = ref('');
const selectedProductIds = ref<string[]>([]);
const activeActionMenuId = ref<string | null>(null);

const showModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const currentEditingId = ref<string | null>(null);

const form = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  stockTotal: 0,
  imageUrl: '',
});

const showOfferModal = ref(false);
const selectedProductForOffer = ref<any>(null);
const offerForm = ref({
  salePrice: 0,
  saleActive: true,
  saleEndDate: '',
});

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

const fetchProducts = async () => {
  try {
    const res = await fetch(`${apiUrl}/products?showInactive=true`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      products.value = data.products || [];
    }
  } catch (e) {
    // Ignorar
  }
};

const fetchCategories = async () => {
  try {
    const res = await fetch(`${apiUrl}/categories?type=product`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      categories.value = data.categories || [];
    }
  } catch (e) {
    // Ignorar
  }
};

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesCategory = !selectedCategory.value || p.category?._id === selectedCategory.value;
    const matchesStock = !selectedStockStatus.value || p.computedStatus === selectedStockStatus.value;

    return matchesSearch && matchesCategory && matchesStock;
  });
});

const isAllSelected = computed(() => {
  return (
    filteredProducts.value.length > 0 &&
    selectedProductIds.value.length === filteredProducts.value.length
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProductIds.value = [];
  } else {
    selectedProductIds.value = filteredProducts.value.map((p) => p._id);
  }
};

const openAddModal = () => {
  isEditing.value = false;
  currentEditingId.value = null;
  form.value = {
    name: '',
    category: categories.value[0]?._id || '',
    description: '',
    price: 0,
    stockTotal: 10,
    imageUrl: '',
  };
  showModal.value = true;
};

const openEditModal = (prod: any) => {
  activeActionMenuId.value = null;
  isEditing.value = true;
  currentEditingId.value = prod._id;
  form.value = {
    name: prod.name,
    category: prod.category?._id || '',
    description: prod.description || '',
    price: prod.price,
    stockTotal: prod.stockTotal,
    imageUrl: prod.imageUrl || '',
  };
  showModal.value = true;
};

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    // Simulación de Cloudinary upload URL de muestra
    form.value.imageUrl = `https://res.cloudinary.com/appsalon/image/upload/${file.name}`;
  }
};

const saveProduct = async () => {
  submitting.value = true;
  try {
    const endpoint = isEditing.value
      ? `${apiUrl}/products/${currentEditingId.value}`
      : `${apiUrl}/products`;
    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(form.value),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al guardar producto');

    Swal.fire({
      icon: 'success',
      title: isEditing.value ? 'Producto Actualizado' : 'Producto Creado',
      timer: 1500,
      showConfirmButton: false,
    });
    showModal.value = false;
    fetchProducts();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message });
  } finally {
    submitting.value = false;
  }
};

const openOfferModal = (prod: any) => {
  activeActionMenuId.value = null;
  selectedProductForOffer.value = prod;
  offerForm.value = {
    salePrice: prod.salePrice || Math.round(prod.price * 0.8),
    saleActive: prod.saleActive !== false,
    saleEndDate: prod.saleEndDate ? new Date(prod.saleEndDate).toISOString().slice(0, 16) : '',
  };
  showOfferModal.value = true;
};

const saveOffer = async () => {
  try {
    const res = await fetch(`${apiUrl}/products/${selectedProductForOffer.value._id}/offer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(offerForm.value),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al configurar oferta');

    Swal.fire({ icon: 'success', title: '¡Oferta Configurada!', timer: 1500, showConfirmButton: false });
    showOfferModal.value = false;
    fetchProducts();
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error de Oferta', text: e.message });
  }
};

const handleDelete = async (prod: any) => {
  activeActionMenuId.value = null;
  const result = await Swal.fire({
    title: '¿Eliminar producto?',
    text: `El producto "${prod.name}" será desactivado del inventario.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${apiUrl}/products/${prod._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Producto desactivado', timer: 1500, showConfirmButton: false });
        fetchProducts();
      }
    } catch (e) {
      // Ignorar
    }
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const exportCSV = () => {
  const headers = ['ID', 'Nombre', 'Categoría', 'Precio', 'Precio Oferta', 'Stock Total', 'Reservado', 'Estado'];
  const rows = filteredProducts.value.map((p) => [
    p._id,
    `"${p.name}"`,
    `"${p.category?.name || ''}"`,
    p.price,
    p.salePrice || '',
    p.stockTotal,
    p.reservedStock,
    p.computedStatus,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `inventario_productos_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
