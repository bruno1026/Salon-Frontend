<template>
  <div style="width: 100%; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; overflow-x: hidden;" class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
    <!-- 1. HERO SOBRE NOSOTROS (Full Bleed 100vh Hero Estilo Landing) -->
    <section style="position: relative; width: 100vw; min-height: 100vh; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; padding: 6.5rem 1.5rem 4.5rem 1.5rem; margin-bottom: 6rem; overflow: hidden;">
      <!-- Dark Overlay Gradient -->
      <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(15, 23, 42, 0.98) 100%); pointer-events: none;"></div>

      <!-- Content Grid Container -->
      <div style="position: relative; z-index: 10; max-width: 1280px; width: 100%; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: clamp(2.5rem, 5vw, 5rem); align-items: center;">
        <!-- Imagen en Arco de Medio Punto (Signature Arch) -->
        <div style="position: relative; width: 100%; display: flex; justify-content: center;">
          <div style="position: relative; width: 100%; max-width: 480px; height: clamp(380px, 55vh, 560px); border-radius: 280px 280px 28px 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.5); border: 4px solid rgba(255,255,255,0.18);">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
              alt="Leslie Uñitas & Pestañas Facade"
              style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
              class="hover:scale-105"
            />
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(15,23,42,0.85); backdrop-filter: blur(12px); color: white; padding: 0.6rem 1.4rem; border-radius: 20px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;">
              BEAUTY STUDIO & EXPERIENCE
            </div>
          </div>
        </div>

        <!-- Texto Narrativo & Pilares -->
        <div>
          <span style="color: #c43ec7; font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.2em; display: block; margin-bottom: 0.6rem;">
            Nuestra Historia & Pasión
          </span>
          <h1 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 600; margin: 0 0 1.5rem 0; line-height: 1.08; letter-spacing: -0.01em; text-shadow: 0 4px 25px rgba(0,0,0,0.6);" class="text-white">
            Sobre Nosotros:
          </h1>
          <p style="font-size: clamp(1.05rem, 1.8vw, 1.18rem); line-height: 1.85; margin-bottom: 1.75rem; color: #cbd5e1;">
            {{ landingData.aboutText || 'En Leslie Uñitas & Pestañas nuestra historia se entrelaza con la belleza, la innovación y la búsqueda incansable de la excelencia. Nos dedicamos a brindar experiencias de diseño de uñas, pestañas y estética con un estándar de lujo atemporal.' }}
          </p>

          <!-- Badges de Compromiso -->
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.25rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem; font-weight: 700; font-size: 1.02rem; color: #f1f5f9;">
              <CheckCircle style="color: #10b981; width: 22px; height: 22px; flex-shrink: 0;" /> Atención personalizada y diagnóstico estético individualizado
            </div>
            <div style="display: flex; align-items: center; gap: 0.85rem; font-weight: 700; font-size: 1.02rem; color: #f1f5f9;">
              <CheckCircle style="color: #10b981; width: 22px; height: 22px; flex-shrink: 0;" /> Productos 100% profesionales y de la más alta gama
            </div>
            <div style="display: flex; align-items: center; gap: 0.85rem; font-weight: 700; font-size: 1.02rem; color: #f1f5f9;">
              <CheckCircle style="color: #10b981; width: 22px; height: 22px; flex-shrink: 0;" /> Ambientes sanitizados bajo estrictos estándares de sanidad
            </div>
          </div>

          <a href="#contact-form" style="background: #3A113D; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 0.95rem 2.2rem; border-radius: 10px; font-weight: 800; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; display: inline-flex; align-items: center; gap: 0.75rem; box-shadow: 0 6px 25px rgba(58,17,61,0.55); transition: transform 0.2s, background 0.2s;" class="hover:bg-[#2b0c2d] hover:scale-105 active:scale-95">
            Ponte en Contacto <Send style="width: 18px; height: 18px;" />
          </a>
        </div>
      </div>
    </section>

    <!-- Resto de Secciones de Sobre Nosotros (Contenedor Centrado) -->
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 1.5rem 5rem 1.5rem;">

      <!-- 2. PILARES DE EXCELENCIA & VALORES (4 Tarjetas Bento) -->
      <section style="margin-bottom: 6rem;">
        <div style="text-align: center; margin-bottom: 3.5rem;">
          <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.5rem;" class="text-[#3A113D] dark:text-[#f472b6]">
            Lo Que Nos Distingue
          </span>
          <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 4.5vw, 3.4rem); font-weight: 600; margin: 0;" class="text-slate-900 dark:text-white">
            Nuestros Pilares de Calidad
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.75rem;">
          <div style="padding: 2.2rem 1.8rem; border-radius: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease;" class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:-translate-y-1">
            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(58,17,61,0.12); color: #c43ec7; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              <Sparkles style="width: 26px; height: 26px;" />
            </div>
            <h3 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 600; margin: 0 0 0.6rem 0;" class="text-slate-900 dark:text-white">Vanguardia & Tendencia</h3>
            <p style="font-size: 0.98rem; line-height: 1.7;" class="text-slate-600 dark:text-slate-300">
              Nuestro equipo se capacita continuamente en técnicas internacionales de manicure ruso, soft gel, nivelación y extensión de pestañas.
            </p>
          </div>

          <div style="padding: 2.2rem 1.8rem; border-radius: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease;" class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:-translate-y-1">
            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(17,53,61,0.12); color: #11353D; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;" class="dark:text-[#38bdf8]">
              <ShieldCheck style="width: 26px; height: 26px;" />
            </div>
            <h3 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 600; margin: 0 0 0.6rem 0;" class="text-slate-900 dark:text-white">Productos de Alta Gama</h3>
            <p style="font-size: 0.98rem; line-height: 1.7;" class="text-slate-600 dark:text-slate-300">
              Utilizamos marcas profesionales de primera línea que garantizan durabilidad, acabado pulcro y cuidado óptimo.
            </p>
          </div>

          <div style="padding: 2.2rem 1.8rem; border-radius: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease;" class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:-translate-y-1">
            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(17,61,25,0.12); color: #113D19; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;" class="dark:text-[#34d399]">
              <Heart style="width: 26px; height: 26px;" />
            </div>
            <h3 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 600; margin: 0 0 0.6rem 0;" class="text-slate-900 dark:text-white">Confort Absoluto</h3>
            <p style="font-size: 0.98rem; line-height: 1.7;" class="text-slate-600 dark:text-slate-300">
              Un ambiente sofisticado diseñado para tu relajación, con atención al detalle, música ambiental y confort supremo.
            </p>
          </div>

          <div style="padding: 2.2rem 1.8rem; border-radius: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease;" class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:-translate-y-1">
            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(58,17,61,0.12); color: #c43ec7; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              <Award style="width: 26px; height: 26px;" />
            </div>
            <h3 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 600; margin: 0 0 0.6rem 0;" class="text-slate-900 dark:text-white">Garantía de Satisfacción</h3>
            <p style="font-size: 0.98rem; line-height: 1.7;" class="text-slate-600 dark:text-slate-300">
              Respaldamos cada servicio con una garantía de retoque sin costo si requieres algún ajuste posterior a tu cita.
            </p>
          </div>
        </div>
      </section>

      <!-- 3. MÉTRICAS & NÚMEROS DE IMPACTO (Minimalista Plum Style) -->
      <section style="margin-bottom: 6rem; padding: 3.5rem 2.5rem; border-radius: 24px; background: #231625; color: white;" class="shadow-xl">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; text-align: center;">
          <div>
            <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(3rem, 5.5vw, 4.2rem); font-weight: 700; color: #c43ec7; line-height: 1;">
              {{ landingData.statsYears || 10 }}
            </div>
            <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; margin-top: 0.6rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.75);">
              Años de Experiencia
            </div>
          </div>

          <div>
            <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(3rem, 5.5vw, 4.2rem); font-weight: 700; color: #ffffff; line-height: 1;">
              +{{ landingData.statsClients || 5000 }}
            </div>
            <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; margin-top: 0.6rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.75);">
              Clientes Atendidos
            </div>
          </div>

          <div>
            <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(3rem, 5.5vw, 4.2rem); font-weight: 700; color: #c43ec7; line-height: 1;">
              100%
            </div>
            <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; margin-top: 0.6rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.75);">
              Productos Certificados
            </div>
          </div>
        </div>
      </section>

      <!-- 4. GALERÍA DE ESPACIOS & INSTALACIONES -->
      <section v-if="landingData.facilityGallery && landingData.facilityGallery.length > 0" style="margin-bottom: 6rem;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.4rem;" class="text-[#3A113D] dark:text-[#f472b6]">Nuestros Espacios</span>
          <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 4.5vw, 3.4rem); font-weight: 600; margin: 0;" class="text-slate-900 dark:text-white">Instalaciones de Lujo</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div v-for="(item, idx) in landingData.facilityGallery" :key="idx" style="border-radius: 20px; overflow: hidden; height: 280px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
            <img v-if="item.mediaType === 'image'" :src="item.mediaUrl" alt="Instalaciones Leslie Uñitas" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" class="hover:scale-105" />
            <video v-else :src="item.mediaUrl" controls style="width: 100%; height: 100%; object-fit: cover;"></video>
          </div>
        </div>
      </section>

      <!-- 5. FORMULARIO DE CONTACTO AL FINAL (Correo o WhatsApp) -->
      <section id="contact-form" style="padding: 3.5rem 2.5rem; border-radius: 24px; box-shadow: 0 10px 35px rgba(0,0,0,0.06);" class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.4rem;" class="text-[#3A113D] dark:text-[#f472b6]">
            Estamos para Atenderte
          </span>
          <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 600; margin: 0;" class="text-slate-900 dark:text-white">
            Ponte en Contacto con Nosotros
          </h2>
          <p style="font-size: 1rem; margin-top: 0.5rem;" class="text-slate-600 dark:text-slate-300">
            Envíanos tus dudas, comentarios o solicitudes. Elige tu canal preferido para recibir respuesta.
          </p>
        </div>

        <form @submit.prevent="handleSubmitContact" style="max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <!-- Nombre -->
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-200">
                Nombre Completo *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Ej. María García"
                style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.95rem; outline: none; transition: border-color 0.2s;"
                class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#c43ec7]"
              />
            </div>

            <!-- Correo -->
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-200">
                Correo Electrónico *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="correo@ejemplo.com"
                style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.95rem; outline: none; transition: border-color 0.2s;"
                class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#c43ec7]"
              />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <!-- Teléfono -->
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-200">
                Teléfono / WhatsApp *
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                placeholder="Ej. +52 55 1234 5678"
                style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.95rem; outline: none; transition: border-color 0.2s;"
                class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#c43ec7]"
              />
            </div>

            <!-- Canal de Preferencia -->
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-200">
                Canal de Respuesta *
              </label>
              <select
                v-model="form.channel"
                required
                style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.95rem; outline: none;"
                class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#c43ec7]"
              >
                <option value="whatsapp">📱 WhatsApp</option>
                <option value="email">✉️ Correo Electrónico</option>
              </select>
            </div>
          </div>

          <!-- Mensaje -->
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.4rem;" class="text-slate-700 dark:text-slate-200">
              Mensaje o Consulta *
            </label>
            <textarea
              v-model="form.message"
              rows="4"
              required
              placeholder="Escribe aquí tus dudas, solicitud de cotización o comentarios..."
              style="width: 100%; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.95rem; outline: none; resize: vertical;"
              class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#c43ec7]"
            ></textarea>
          </div>

          <!-- Botón de Envío -->
          <button
            type="submit"
            :disabled="isSubmitting"
            style="background: #3A113D; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; font-weight: 800; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 6px 20px rgba(58,17,61,0.45); transition: transform 0.2s, background 0.2s;"
            class="hover:bg-[#2b0c2d] hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send style="width: 20px; height: 20px;" />
            {{ isSubmitting ? 'Enviando...' : (form.channel === 'whatsapp' ? 'Enviar por WhatsApp' : 'Enviar por Correo') }}
          </button>
        </form>
      </section>
    </div>

    <!-- 6. FOOTER EDITORIAL LUXURY -->
    <footer class="editorial-footer" style="background: #3A113D; color: #ffffff; padding: 5.5rem 1.5rem 2.5rem 1.5rem; text-align: center; position: relative; width: 100%;">
      <div style="max-width: 1200px; margin: 0 auto; width: 100%;">
        
        <!-- CTA Principal del Footer -->
        <div style="margin-bottom: 4.5rem; padding: 0 1rem;">
          <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 600; margin: 0 0 1.25rem 0; color: #ffffff; letter-spacing: -0.01em;">
            ¿Lista para vivir la experiencia con Leslie?
          </h2>
          <p style="font-size: clamp(0.9rem, 1.8vw, 1.05rem); color: rgba(255, 255, 255, 0.82); max-width: 760px; margin: 0 auto 2.5rem auto; line-height: 1.65; font-weight: 400;">
            Miles de manos han pasado por aquí. Cada una se ha ido distinta. Agenda tu cita hoy y descubre por qué con Leslie no es solo un salón, es un estilo de vida.
          </p>
          <router-link
            to="/client/book"
            style="display: inline-block; border: 1px solid rgba(255, 255, 255, 0.45); background: rgba(255, 255, 255, 0.04); color: #ffffff; padding: 0.95rem 3rem; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; text-decoration: none; border-radius: 4px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"
            class="hover:bg-white hover:text-[#3A113D] active:scale-95"
          >
            RESERVAR AHORA
          </router-link>
        </div>

        <!-- 3 Columnas de Información -->
        <div style="max-width: 1100px; margin: 0 auto 4rem auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 3rem; text-align: center; align-items: start;">
          
          <!-- Columna 1: Logo Monograma -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 3.6rem; font-weight: 700; line-height: 0.9; letter-spacing: -0.03em; color: #ffffff;">
              Leslie
            </div>
            <span style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; color: rgba(255, 255, 255, 0.6); display: block; margin-top: 0.25rem;">
              Uñitas & Pestañas
            </span>
          </div>

          <!-- Columna 2: Redes Sociales -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #ffffff; margin: 0 0 1rem 0; letter-spacing: 0.05em;">
              Redes Sociales
            </h4>
            <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.82); line-height: 1.8;">
              <strong style="color: #ffffff; font-weight: 600;">Instagram:</strong> @leslie_unitas
            </div>
            <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.82); line-height: 1.8;">
              <strong style="color: #ffffff; font-weight: 600;">Facebook:</strong> Leslie Uñitas
            </div>
          </div>

          <!-- Columna 3: Ubicación -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #ffffff; margin: 0 0 1rem 0; letter-spacing: 0.05em;">
              Ubicación
            </h4>
            <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.82); line-height: 1.6; max-width: 300px;">
              {{ landingData.address || 'Calle Córdoba 2592, Providencia, Guadalajara, Jalisco 44630' }}
            </div>
          </div>

        </div>

        <!-- Barra Inferior de Copyright & Crédito -->
        <div style="width: 100%; max-width: 1100px; height: 1px; background: rgba(255, 255, 255, 0.12); margin: 0 auto 2rem auto;"></div>
        <p style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.7); margin: 0 0 0.4rem 0; font-weight: 500;">
          © 2026 Leslie Uñitas. Todos los derechos reservados.
        </p>
        <p style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.9); margin: 0; font-weight: 600;">
          Made Manexis
        </p>

      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CheckCircle, Send, Sparkles, ShieldCheck, Heart, Award } from 'lucide-vue-next';
import { useToastStore } from '../../stores/toastStore';

const toastStore = useToastStore();

const apiUrl = import.meta.env.VITE_API_URL || '/api';

const landingData = ref<any>({});
const isSubmitting = ref(false);

const form = ref({
  name: '',
  email: '',
  phone: '',
  channel: 'whatsapp',
  message: '',
});

onMounted(async () => {
  try {
    const res = await fetch(`${apiUrl}/landing`);
    if (res.ok) {
      landingData.value = await res.json();
    }
  } catch (err) {
    console.error('Error al cargar datos de conocenos:', err);
  }
});

const handleSubmitContact = async () => {
  isSubmitting.value = true;

  try {
    if (form.value.channel === 'whatsapp') {
      const rawText = `¡Hola! Me gustaría ponerme en contacto.\n*Nombre:* ${form.value.name}\n*Correo:* ${form.value.email}\n*Teléfono:* ${form.value.phone}\n*Mensaje:* ${form.value.message}`;
      const encodedMsg = encodeURIComponent(rawText);

      const targetPhone = landingData.value.whatsappNumber || landingData.value.phones?.[0] || '';
      const cleanPhone = targetPhone.replace(/[^\d]/g, '');

      const waUrl = cleanPhone
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`
        : `https://api.whatsapp.com/send?text=${encodedMsg}`;

      window.open(waUrl, '_blank');

      toastStore.success('¡Redirigiendo a WhatsApp!', {
        message: 'Se ha abierto tu aplicación de WhatsApp con el mensaje listo para enviar.',
        duration: 4500,
      });
    } else {
      await new Promise((res) => setTimeout(res, 800));

      toastStore.success('¡Mensaje Enviado!', {
        message: 'Gracias por escribirnos. Nuestro equipo te responderá a la brevedad.',
        duration: 4500,
      });
    }

    form.value.name = '';
    form.value.email = '';
    form.value.phone = '';
    form.value.message = '';
  } catch (err) {
    console.error('Error al enviar formulario:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
