<template>
  <div class="slides-wrapper" style="width: 100%; overflow-x: hidden; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;">
    <!-- 1. HERO SWIPER SECTION (SECTION 1) -->
    <section id="hero" class="section section-1" style="position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #0f172a;">
      <div class="section-content" style="width: 100%; height: 100%;">
        <div class="section-inner" style="width: 100%; height: 100%;">
          <swiper
            @swiper="onSwiperInit"
            @slideChange="onSlideChange"
            :modules="swiperModules"
            :slides-per-view="1"
            :loop="true"
            :autoplay="{ delay: 6000, disableOnInteraction: false }"
            :effect="'fade'"
            :fade-effect="{ crossFade: true }"
            style="width: 100%; height: 100%;"
          >
            <swiper-slide v-for="(slide, idx) in heroSlides" :key="idx">
              <div style="position: relative; width: 100%; height: 100%;">
                <!-- Media: Video o Imagen -->
                <video v-if="slide.mediaType === 'video'" :src="slide.mediaUrl" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                <img v-else :src="slide.mediaUrl" :alt="slide.heading" style="width: 100%; height: 100%; object-fit: cover;" />
                  
                <!-- Dark Overlay Gradient -->
                <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.45) 50%, rgba(15, 23, 42, 0.92) 100%);"></div>

                <!-- Overlaid Content -->
                <div style="position: absolute; inset: 0; max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.25rem, 5vw, 3rem); display: flex; flex-direction: column; justify-content: center; color: white;">
                  <div style="max-width: 820px;">
                    <span v-if="slide.eyebrowText" style="font-size: clamp(0.75rem, 2.5vw, 0.95rem); font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #c43ec7; margin-bottom: 0.75rem; display: block;">
                      {{ slide.eyebrowText }}
                    </span>
                    <h1 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 600; line-height: 1.05; margin: 0 0 1.5rem 0; letter-spacing: -0.01em; text-shadow: 0 4px 25px rgba(0,0,0,0.6);">
                      {{ slide.heading }}
                    </h1>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                      <router-link to="/client/book" style="background: #3A113D; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 0.85rem 1.8rem; border-radius: 8px; font-weight: 800; text-decoration: none; font-size: clamp(0.85rem, 2vw, 0.95rem); text-transform: uppercase; letter-spacing: 0.08em; box-shadow: 0 6px 20px rgba(58,17,61,0.55); transition: transform 0.2s, background 0.2s;" class="hover:bg-[#2b0c2d] hover:scale-105 active:scale-95">
                        Agendar Cita
                      </router-link>
                      <router-link to="/client/shop" style="background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.85rem 1.8rem; border-radius: 8px; font-weight: 800; text-decoration: none; font-size: clamp(0.85rem, 2vw, 0.95rem); text-transform: uppercase; letter-spacing: 0.08em; transition: background 0.2s;" class="hover:bg-white/20 active:scale-95">
                        Ver Tienda
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>

          <!-- Control Slider PREV - Dots - NEXT -->
          <div style="position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); z-index: 30; display: flex; align-items: center; gap: 1rem; color: white; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em;">
            <button @click="slidePrev" style="background: transparent; border: none; color: white; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; cursor: pointer; text-transform: uppercase; padding: 0.4rem;" class="hover:text-[#c43ec7] active:scale-95">
              PREV
            </button>

            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div style="width: clamp(20px, 4vw, 40px); height: 1px; background: rgba(255,255,255,0.3);"></div>
              <div
                v-for="(_, i) in heroSlides"
                :key="i"
                @click="goToSlide(i)"
                :style="{
                  width: currentSlideIndex === i ? '10px' : '7px',
                  height: currentSlideIndex === i ? '10px' : '7px',
                  borderRadius: '50%',
                  background: currentSlideIndex === i ? '#c43ec7' : 'rgba(255,255,255,0.5)',
                  border: currentSlideIndex === i ? '2px solid white' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }"
              ></div>
              <div style="width: clamp(20px, 4vw, 40px); height: 1px; background: rgba(255,255,255,0.3);"></div>
            </div>

            <button @click="slideNext" style="background: transparent; border: none; color: white; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; cursor: pointer; text-transform: uppercase; padding: 0.4rem;" class="hover:text-pink-400 active:scale-95">
              NEXT
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SECCIÓN CONÓCENOS PREVIEW (SECTION 2) -->
    <section id="about" ref="aboutSectionRef" class="section section-2 bg-slate-50 dark:bg-slate-900" style="position: relative; width: 100%; padding: 6rem 1.5rem;">
      <div class="section-content" style="max-width: 1280px; margin: 0 auto; width: 100%;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(2rem, 4vw, 4rem); align-items: center;">
          <!-- Imagen Temporal en Marco en Arco (Estilo OnlyNails) -->
          <div style="position: relative; width: 100%; display: flex; justify-content: center;">
            <div style="position: relative; width: 100%; max-width: 440px; height: clamp(320px, 42vh, 480px); border-radius: 220px 220px 24px 24px; overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.25); border: 4px solid #ffffff;" class="dark:border-slate-700">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                alt="AppSalon Espacio Principal (Temporal)"
                style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;"
                class="hover:scale-105"
              />
              <!-- Subtitle Badge -->
              <div style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(15,23,42,0.85); backdrop-filter: blur(12px); color: white; padding: 0.5rem 1.2rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;">
                Salon Experience
              </div>
            </div>
          </div>

          <!-- Contenido Texto & Métricas -->
          <div>
            <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.5rem;" class="text-[#3A113D] dark:text-[#f472b6]">
              Conócenos
            </span>
            <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 600; margin-top: 0; margin-bottom: 1.25rem; line-height: 1.1; letter-spacing: -0.01em;" class="text-slate-900 dark:text-white">
              Pasión & Innovación en Estilo
            </h2>
            <p style="font-size: clamp(0.95rem, 1.8vw, 1.1rem); line-height: 1.8; margin-bottom: 1.75rem;" class="text-slate-600 dark:text-slate-300">
              {{ landingData.aboutText || 'Transformamos tu imagen con técnicas internacionales vanguardistas y un trato completamente personalizado.' }}
            </p>

            <!-- Métricas Minimalistas Elegantes (Anti-Slop Design) -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(1.5rem, 3vw, 2.5rem); margin-bottom: 2.25rem; border-top: 1px solid rgba(148, 163, 184, 0.2); border-bottom: 1px solid rgba(148, 163, 184, 0.2); padding: 1.75rem 0;" class="dark:border-slate-800/80">
              <div style="border-left-width: 2px; border-left-style: solid; padding-left: 1.25rem;" class="border-l-[#3A113D] dark:border-l-[#f472b6]">
                <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.6rem, 5.5vw, 4rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1;" class="text-slate-900 dark:text-white">
                  {{ displayYears }}
                </div>
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; margin-top: 0.5rem;" class="text-slate-500 dark:text-slate-400">
                  Años de Trayectoria
                </div>
              </div>

              <div style="border-left-width: 2px; border-left-style: solid; padding-left: 1.25rem;" class="border-l-[#3A113D] dark:border-l-[#f472b6]">
                <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.6rem, 5.5vw, 4rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1;" class="text-slate-900 dark:text-white">
                  +{{ displayClients }}
                </div>
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; margin-top: 0.5rem;" class="text-slate-500 dark:text-slate-400">
                  Clientes Satisfechos
                </div>
              </div>
            </div>

            <!-- Botón a Vista Dedicada /about -->
            <router-link
              to="/about"
              style="background: #3A113D; color: white; border: none; padding: 0.9rem 1.8rem; border-radius: 10px; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; display: inline-flex; align-items: center; gap: 0.75rem; box-shadow: 0 6px 20px rgba(58,17,61,0.45); transition: transform 0.2s, background 0.2s;"
              class="hover:bg-[#2b0c2d] hover:scale-105 active:scale-95"
            >
              Conoce Más Sobre Nosotros <ArrowRight style="width: 18px; height: 18px;" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SECCIÓN NUESTRO TRABAJO (GALERÍA BENTO LIMPIA Y SCROLLABLE FULL WIDTH) -->
    <section id="work" class="section section-3 bg-slate-950 text-white" style="position: relative; width: 100%; padding: 6rem 1.5rem;">
      <div class="section-content" style="width: 100%;">
        <!-- Título de Sección -->
        <div style="text-align: center; margin-bottom: 3rem; max-width: 800px; margin-left: auto; margin-right: auto; padding: 0 1rem;">
          <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.4rem;" class="text-[#f472b6]">
            Galería Cinemática
          </span>
          <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 600; margin: 0 0 0.75rem 0; color: white;">
            Nuestro Trabajo & Arte
          </h2>
          <p style="font-size: 1.05rem; color: #94a3b8; max-width: 650px; margin: 0 auto; line-height: 1.6;">
            Cada look es diseñado a la medida combinando tendencias internacionales con productos profesionales de alta gama.
          </p>
        </div>
        <div class="bento-grid-container">
          <div
            v-for="(item, idx) in bentoItems"
            :key="idx"
            class="bento-item group"
            @click="openLightbox(idx)"
          >
            <img :src="item.mediaUrl" :alt="item.title" class="bento-img" />
            <div class="bento-overlay">
              <div style="width: 100%;">
                <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.2rem;" class="text-[#f472b6]">
                  {{ item.category }}
                </span>
                <h3 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: 1.35rem; font-weight: 600; color: white; margin: 0 0 0.6rem 0; line-height: 1.2;">
                  {{ item.title }}
                </h3>
                <span class="bento-badge">Ver Trabajo &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. SECCIÓN NUESTROS SERVICIOS (SECTION 4 - EDITORIAL LUXURY DESIGN) -->
    <section id="services" class="section section-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" style="position: relative; width: 100%; padding: 6rem 1.5rem; overflow: hidden;">
      <div class="section-content" style="width: 100%; display: flex; justify-content: center;">
        <div class="section-inner" style="max-width: 1280px; width: 100%;">
          
          <!-- Encabezado Editorial -->
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 600; margin: 0 0 0.5rem 0; letter-spacing: -0.01em;" class="text-slate-900 dark:text-white">
              Nuestros servicios
            </h2>
            <p style="font-size: clamp(0.9rem, 1.8vw, 1.05rem); color: #64748b; font-weight: 500; margin: 0; letter-spacing: 0.02em;" class="dark:text-slate-400">
              Técnica, diseño y detalle en cada servicio que ofrecemos
            </p>
          </div>

          <!-- Grid 3 Columnas Editorial (Izquierda - Centro Imagen + CTA - Derecha) -->
          <div class="services-editorial-grid">
            
            <!-- Columna Izquierda (3 Servicios) -->
            <div class="services-column services-column-left">
              <!-- Servicio 1 -->
              <div class="service-item service-item-left">
                <div class="service-text">
                  <h3 class="service-title">Manicure Ruso</h3>
                  <p class="service-desc">
                    Técnica avanzada en seco para una limpieza minuciosa de cutículas. Acabado pulcro y elegante de alta duración.
                  </p>
                  <span class="service-tag">Ideal para precisión extrema y resultados impecables.</span>
                </div>
                <div class="service-icon-wrapper">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="service-svg-icon">
                    <path d="M14 28c0-4 3-8 8-8s8 4 8 8" />
                    <path d="M22 20v-8m0 0l-3 3m3-3l3 3" />
                    <path d="M12 36h20a4 4 0 004-4v-4H12v4a4 4 0 004 4z" />
                  </svg>
                </div>
              </div>

              <!-- Servicio 2 -->
              <div class="service-item service-item-left">
                <div class="service-text">
                  <h3 class="service-title">Nivelación Rubber</h3>
                  <p class="service-desc">
                    Corrige imperfecciones logrando una base lisa y perfectamente estructurada. Protege la uña de quiebres.
                  </p>
                  <span class="service-tag">Ideal para acabado natural con máxima durabilidad.</span>
                </div>
                <div class="service-icon-wrapper">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="service-svg-icon">
                    <path d="M16 38V22c0-4.4 3.6-8 8-8s8 3.6 8 8v16" />
                    <path d="M24 14V8" />
                    <path d="M34 14l4-4M10 10l4 4" />
                  </svg>
                </div>
              </div>

              <!-- Servicio 3 -->
              <div class="service-item service-item-left">
                <div class="service-text">
                  <h3 class="service-title">Uñas Soft Gel</h3>
                  <p class="service-desc">
                    Técnica moderna con tips preformados de gel flexible. Sin limado excesivo ni químicos agresivos.
                  </p>
                  <span class="service-tag">Ideal para uñas largas de forma rápida y cómoda.</span>
                </div>
                <div class="service-icon-wrapper">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="service-svg-icon">
                    <path d="M18 12c0-2.2 2.7-4 6-4s6 1.8 6 4v24c0 2.2-2.7 4-6 4s-6-1.8-6-4V12z" />
                    <path d="M18 20h12" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Columna Central (Imagen Hero + Botón Agendar Cita) -->
            <div class="services-column-center">
              <div class="service-hero-image-wrapper">
                <img :src="dedoImg" alt="Servicios de Uñas & Estilo" class="service-hero-img" />
              </div>
              <router-link to="/client/book" class="service-cta-button">
                AGENDAR CITA
              </router-link>
            </div>

            <!-- Columna Derecha (3 Servicios) -->
            <div class="services-column services-column-right">
              <!-- Servicio 4 -->
              <div class="service-item service-item-right">
                <div class="service-icon-wrapper">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="service-svg-icon">
                    <path d="M18 36c4 0 8-3 8-7V16c0-4-3-8-8-8s-8 4-8 8v13c0 4 4 7 8 7z" />
                    <circle cx="32" cy="14" r="2" />
                    <circle cx="36" cy="19" r="1.5" />
                    <circle cx="38" cy="25" r="1.5" />
                  </svg>
                </div>
                <div class="service-text">
                  <h3 class="service-title">Pedi LOA</h3>
                  <p class="service-desc">
                    Combinamos lo mejor del pedicure spa con la técnica rusa. Limpieza meticulosa de cutículas y perfeccionamiento del contorno.
                  </p>
                  <span class="service-tag">Ideal para un pedicure estéticamente impecable.</span>
                </div>
              </div>

              <!-- Servicio 5 -->
              <div class="service-item service-item-right">
                <div class="service-icon-wrapper">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="service-svg-icon">
                    <path d="M20 40V18c0-5 3.6-9 8-9s8 4 8 9v22" />
                    <path d="M20 28h16" />
                  </svg>
                </div>
                <div class="service-text">
                  <h3 class="service-title">Uñas de Poligel</h3>
                  <p class="service-desc">
                    Técnica híbrida que combina lo mejor del acrílico y el gel. Resistencia con flexibilidad y ligereza.
                  </p>
                  <span class="service-tag">Ideal para extensiones duraderas de apariencia natural.</span>
                </div>
              </div>

              <!-- Servicio 6 -->
              <div class="service-item service-item-right">
                <div class="service-icon-wrapper">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="service-svg-icon">
                    <path d="M12 20h24v20H12z" />
                    <path d="M24 12v28" />
                    <path d="M16 16c-3 0-5-2-5-4s3-4 5-1l8 5-8 0zM32 16c3 0 5-2 5-4s-3-4-5-1l-8 5 8 0z" />
                  </svg>
                </div>
                <div class="service-text">
                  <h3 class="service-title">Paquetes LOA</h3>
                  <p class="service-desc">
                    Combinaciones exclusivas de nuestros servicios estrella para una experiencia completa y personalizada.
                  </p>
                  <span class="service-tag">Haz clic para conocer nuestros paquetes especiales.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- 5. SECCIÓN ¿POR QUÉ ELEGIRNOS? & FEED SOCIAL (SECTION 5) -->
    <section id="why-us" class="section section-5 bg-white dark:bg-slate-900" style="position: relative; width: 100%; padding: 6rem 1.5rem;">
      <div class="section-content" style="width: 100%; display: flex; justify-content: center;">
        <div class="section-inner" style="max-width: 1280px; width: 100%;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(2rem, 5vw, 4rem); align-items: center;">
            <div>
              <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.5rem;" class="text-[#3A113D] dark:text-[#f472b6]">Excelencia Garantizada</span>
              <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 600; margin-top: 0; margin-bottom: 1.25rem;" class="text-slate-900 dark:text-white">
                ¿Por Qué Elegir AppSalon?
              </h2>
              <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;" class="text-slate-600 dark:text-slate-300">
                {{ landingData.whyChooseUsText || 'Ofrecemos una combinación única de talento artesanal, ambiente exclusivo y tecnología de vanguardia.' }}
              </p>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem; font-weight: 700; font-size: 1.05rem;" class="text-slate-800 dark:text-slate-200">
                  <CheckCircle style="color: #10b981; width: 24px; height: 24px; flex-shrink: 0;" /> Estilistas y especialistas altamente certificadas
                </div>
                <div style="display: flex; align-items: center; gap: 0.85rem; font-weight: 700; font-size: 1.05rem;" class="text-slate-800 dark:text-slate-200">
                  <CheckCircle style="color: #10b981; width: 24px; height: 24px; flex-shrink: 0;" /> Productos 100% profesionales y de alta gama
                </div>
                <div style="display: flex; align-items: center; gap: 0.85rem; font-weight: 700; font-size: 1.05rem;" class="text-slate-800 dark:text-slate-200">
                  <CheckCircle style="color: #10b981; width: 24px; height: 24px; flex-shrink: 0;" /> Protocolos strictly de higiene y confort supremo
                </div>
              </div>
            </div>

            <!-- Feed Social Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem;">
              <div v-for="(img, idx) in landingData.socialGridImages" :key="idx" style="border-radius: 20px; overflow: hidden; height: clamp(160px, 25vw, 220px); box-shadow: 0 8px 20px rgba(0,0,0,0.08);" @click="activeLightboxItem = img" class="cursor-pointer">
                <img :src="img.mediaUrl" alt="Feed Social" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. SECCIÓN UBICACIÓN & CONTACTO (SECTION 6 - FINAL) -->
    <section id="contact" class="section section-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50" style="position: relative; width: 100%; padding: 6rem 1.5rem;">
      <div class="section-content" style="max-width: 1280px; margin: 0 auto; width: 100%;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <span style="font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.18em; display: block; margin-bottom: 0.4rem;" class="text-[#3A113D] dark:text-[#f472b6]">Visítanos</span>
          <h2 style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 600; margin: 0;" class="text-slate-900 dark:text-white">Ubicación & Contacto</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(2rem, 5vw, 3rem); align-items: center;">
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            <div style="display: flex; gap: 1.25rem; align-items: flex-start;">
              <MapPin style="width: 26px; height: 26px; flex-shrink: 0; margin-top: 0.2rem;" class="text-[#3A113D] dark:text-[#f472b6]" />
              <div>
                <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.25rem;" class="text-slate-900 dark:text-white">Dirección</div>
                <div style="font-size: 1rem; margin-top: 0.25rem;" class="text-slate-600 dark:text-slate-300">{{ landingData.address || 'Calle Córdoba 2592, Providencia, Guadalajara, Jalisco 44630' }}</div>
              </div>
            </div>

            <div style="display: flex; gap: 1.25rem; align-items: flex-start;">
              <Clock style="width: 26px; height: 26px; flex-shrink: 0; margin-top: 0.2rem;" class="text-[#3A113D] dark:text-[#f472b6]" />
              <div>
                <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.25rem;" class="text-slate-900 dark:text-white">Horarios</div>
                <div style="font-size: 1rem; margin-top: 0.25rem;" class="text-slate-600 dark:text-slate-300">{{ landingData.hours || 'Lunes a Sábado: 9:00 AM - 8:00 PM' }}</div>
              </div>
            </div>

            <div style="display: flex; gap: 1.25rem; align-items: flex-start;">
              <Phone style="width: 26px; height: 26px; flex-shrink: 0; margin-top: 0.2rem;" class="text-[#3A113D] dark:text-[#f472b6]" />
              <div>
                <div style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.25rem;" class="text-slate-900 dark:text-white">Teléfonos</div>
                <template v-if="landingData.phones && landingData.phones.length > 0">
                  <div v-for="(p, idx) in landingData.phones" :key="idx" style="font-size: 1rem; margin-top: 0.25rem;" class="text-slate-600 dark:text-slate-300">
                    {{ p }}
                  </div>
                </template>
                <template v-else>
                  <div style="font-size: 1rem; margin-top: 0.25rem;" class="text-slate-600 dark:text-slate-300">
                    +52 33 1234 5678
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div style="border-radius: 20px; overflow: hidden; height: clamp(260px, 40vh, 340px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); border: 1px solid #cbd5e1;" class="dark:border-slate-700">
            <iframe
              width="100%"
              height="100%"
              style="border:0;"
              loading="lazy"
              allowfullscreen
              :src="`https://maps.google.com/maps?q=${encodeURIComponent(landingData.address)}&output=embed`"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. FOOTER EDITORIAL LUXURY (SECTION 7 - LOA NAIL MASTERS / APPSALON) -->
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
            class="hover:bg-white hover:text-[#231625] active:scale-95"
          >
            RESERVAR AHORA
          </router-link>
        </div>

        <!-- 3 Columnas de Información (Logo - Redes Sociales - Ubicación) -->
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

    <!-- LIGHTBOX MODAL ANIMADO CON DESCRIPCIÓN DE TRABAJO -->
    <transition name="lightbox-anim">
      <div v-if="activeLightboxItem" class="lightbox-backdrop" @click="closeLightbox">
        <div class="lightbox-card border border-slate-700/60 bg-slate-900/95 text-white" @click.stop>
          <!-- Botón de Cerrar Modal -->
          <button @click="closeLightbox" class="lightbox-close-btn" title="Cerrar (Esc)">&times;</button>

          <div class="lightbox-content-grid">
            <!-- Media Visual (Imagen o Video) -->
            <div class="lightbox-media-container">
              <img
                v-if="activeLightboxItem.mediaType === 'image'"
                :src="activeLightboxItem.mediaUrl"
                :alt="activeLightboxItem.title"
                class="lightbox-media"
              />
              <video
                v-else
                :src="activeLightboxItem.mediaUrl"
                controls
                autoplay
                class="lightbox-media"
              ></video>

              <!-- Navegación Anterior / Siguiente posicionada en la zona de imagen -->
              <button @click.stop="prevLightboxItem" class="lightbox-media-nav-btn prev-btn" title="Anterior (←)">
                <ChevronLeft style="width: 24px; height: 24px;" />
              </button>
              <button @click.stop="nextLightboxItem" class="lightbox-media-nav-btn next-btn" title="Siguiente (→)">
                <ChevronRight style="width: 24px; height: 24px;" />
              </button>
            </div>

            <!-- Detalles del Trabajo / Servicio -->
            <div class="lightbox-details">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.6rem;">
                <span class="lightbox-category-badge">{{ activeLightboxItem.category || 'Servicio Profesional' }}</span>
                <span class="lightbox-counter-badge">{{ (activeLightboxIndex ?? 0) + 1 }} / {{ bentoItems.length }}</span>
              </div>

              <h2 class="lightbox-title" style="font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 600;">{{ activeLightboxItem.title }}</h2>
              <p class="lightbox-description">
                {{ activeLightboxItem.description }}
              </p>

              <div class="lightbox-divider"></div>

              <!-- CTA para Agendar Cita de este servicio -->
              <div class="lightbox-actions">
                <router-link
                  to="/client/book"
                  @click="closeLightbox"
                  class="lightbox-cta-btn"
                >
                  Agendar Cita Para Este Estilo &rarr;
                </router-link>
              </div>
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { MapPin, Clock, Phone, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import dedoImg from '../../assets/dedo.png';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL || '/api';
const swiperModules = [Navigation, Autoplay, EffectFade, Pagination];

const landingData = ref<any>({
  heroSlides: [],
  aboutText: 'Transformamos tu imagen con técnicas internacionales vanguardistas y un trato completamente personalizado.',
  statsYears: 10,
  statsClients: 5000,
  workGallery: [],
  facilityGallery: [],
  whyChooseUsText: 'Ofrecemos una combinación única de talento artesanal, ambiente exclusivo y tecnología de vanguardia.',
  socialGridImages: [],
  address: 'Calle Córdoba 2592, Providencia, Guadalajara, Jalisco 44630',
  hours: 'Lunes a Sábado: 9:00 AM - 8:00 PM',
  phones: ['+52 33 1234 5678', '+52 33 8765 4321'],
});

const defaultHeroSlides = [
  {
    mediaUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
    mediaType: 'image',
    eyebrowText: 'Bienvenida a tu espacio de belleza',
    heading: 'Estilo, Arte & Elegancia en Cada Detalle',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
    mediaType: 'image',
    eyebrowText: 'Especialistas Certificadas',
    heading: 'Transformaciones Increíbles & Colorimetría Avanzada',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=80',
    mediaType: 'image',
    eyebrowText: 'Experiencia Exclusiva',
    heading: 'Cuidado Capilar de Alta Gama & Tendencias',
  }
];

const heroSlides = computed(() => {
  if (landingData.value?.heroSlides && landingData.value.heroSlides.length > 0) {
    return landingData.value.heroSlides;
  }
  return defaultHeroSlides;
});

const defaultBentoFallback = [
  {
    mediaUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    title: 'Estilismo & Transformación Capilar',
    category: 'Corte & Peinado',
    description: 'Transformación integral con técnicas de degradado moderno, lavado nutritivo y peinado profesional de alta durabilidad.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    title: 'Balayage & Colorimetría Avanzada',
    category: 'Color & Luces',
    description: 'Diseño de color personalizado con matices luminosos, manteniendo la salud del cabello con elixires de queratina orgánicos.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    title: 'Brushing & Secado de Alta Gama',
    category: 'Tratamientos & Estilo',
    description: 'Modelado con cepillo térmico e hidratación intensiva para lograr brillo deslumbrante y sedosidad incomparable.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    title: 'Maquillaje & Peinado para Eventos',
    category: 'Social & Novias',
    description: 'Look de gala diseñado a la medida para ocasiones especiales con fijación de larga duración y acabado editorial.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    title: 'Herramientas & Cuidado Térmico Profesional',
    category: 'Equipo & Tecnología',
    description: 'Utilizamos planchas y tenacillas cerámicas con control inteligente de temperatura para proteger la fibra capilar.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    title: 'Corte Bob Elegante & Texturizado',
    category: 'Diseño de Corte',
    description: 'Corte estructural de precisión geométrica que resalta los rasgos faciales y brinda movimiento natural.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    title: 'Tratamiento de Reestructuración Capilar',
    category: 'Cuidado Intensivo',
    description: 'Riterapia de aminoácidos y colágeno para restaurar cabellos procesados o maltratados por el calor y químicos.'
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    title: 'Rubios Platinados & Deco Responsable',
    category: 'Color Profesional',
    description: 'Decoloración segura paso a paso con protectores de puentes disulfuro para conseguir rubios luminosos sin daño.'
  }
];

const bentoItems = computed(() => {
  const items = landingData.value.workGallery || [];
  const result = [];
  for (let i = 0; i < 8; i++) {
    const fallback = defaultBentoFallback[i];
    if (items[i] && items[i].mediaUrl) {
      result.push({
        mediaUrl: items[i].mediaUrl,
        mediaType: items[i].mediaType || 'image',
        title: items[i].title || items[i].heading || fallback.title,
        category: items[i].category || fallback.category,
        description: items[i].description || items[i].subtitle || fallback.description
      });
    } else {
      result.push({
        mediaUrl: fallback.mediaUrl,
        mediaType: 'image',
        title: fallback.title,
        category: fallback.category,
        description: fallback.description
      });
    }
  }
  return result;
});

const swiperInstance = ref<any>(null);
const currentSlideIndex = ref(0);
const displayYears = ref(10);
const displayClients = ref(5000);

const activeLightboxIndex = ref<number | null>(null);

const activeLightboxItem = computed(() => {
  if (activeLightboxIndex.value === null) return null;
  return bentoItems.value[activeLightboxIndex.value] || null;
});

const openLightbox = (index: number) => {
  activeLightboxIndex.value = index;
};

const closeLightbox = () => {
  activeLightboxIndex.value = null;
};

const prevLightboxItem = (e?: Event) => {
  if (e) e.stopPropagation();
  if (activeLightboxIndex.value === null) return;
  activeLightboxIndex.value = (activeLightboxIndex.value - 1 + bentoItems.value.length) % bentoItems.value.length;
};

const nextLightboxItem = (e?: Event) => {
  if (e) e.stopPropagation();
  if (activeLightboxIndex.value === null) return;
  activeLightboxIndex.value = (activeLightboxIndex.value + 1) % bentoItems.value.length;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (activeLightboxIndex.value === null) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLightboxItem();
  if (e.key === 'ArrowRight') nextLightboxItem();
};

const onSwiperInit = (swiper: any) => {
  swiperInstance.value = swiper;
};

const onSlideChange = (swiper: any) => {
  currentSlideIndex.value = swiper.realIndex;
};

const slidePrev = () => {
  if (swiperInstance.value) swiperInstance.value.slidePrev();
};

const slideNext = () => {
  if (swiperInstance.value) swiperInstance.value.slideNext();
};

const goToSlide = (index: number) => {
  if (swiperInstance.value) swiperInstance.value.slideToLoop(index);
};

const animateMetrics = () => {
  const targetYears = landingData.value?.statsYears || 10;
  const targetClients = landingData.value?.statsClients || 5000;

  const state = { years: 0, clients: 0 };

  gsap.to(state, {
    years: targetYears,
    clients: targetClients,
    duration: 2.2,
    ease: 'power2.out',
    onUpdate: () => {
      displayYears.value = Math.round(state.years);
      displayClients.value = Math.round(state.clients);
    },
  });
};

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);

  nextTick(() => {
    animateMetrics();
  });

  const isLandingEnabled = (window as any).MODULE_CONFIG?.landingEnabled ?? true;
  if (!isLandingEnabled) {
    const isAppointmentsEnabled = (window as any).MODULE_CONFIG?.appointmentsEnabled ?? true;
    const isEcommerceEnabled = (window as any).MODULE_CONFIG?.ecommerceEnabled ?? true;
    if (isAppointmentsEnabled) {
      router.replace('/client/book');
    } else if (isEcommerceEnabled) {
      router.replace('/client/shop');
    } else {
      router.replace('/login');
    }
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/landing`);
    if (res.ok) {
      landingData.value = await res.json();
      animateMetrics();
    }
  } catch (err) {
    console.error('Error al cargar la landing:', err);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');

.slides-wrapper {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

h1, h2, h3, .lightbox-title {
  font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif !important;
}

.section {
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

.section-content {
  width: 100%;
}

.section-inner {
  width: 100%;
}

/* CUADRÍCULA BENTO RESPONSIVA Y LIMPIA */
.bento-grid-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  width: 100%;
}

@media (min-width: 640px) {
  .bento-grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .bento-grid-container {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, clamp(300px, 36vh, 460px));
  }

  .bento-item:nth-child(1) {
    grid-column: span 2;
    grid-row: span 2;
  }

  .bento-item:nth-child(4) {
    grid-column: span 2;
  }
}

.bento-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  min-height: 220px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease;
}

.bento-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 45px rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.5);
}

.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.bento-item:hover .bento-img {
  transform: scale(1.06);
}

.bento-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bento-item:hover .bento-overlay {
  opacity: 1;
}

.bento-badge {
  background: rgba(236, 72, 153, 0.95);
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.5rem 1.1rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
  display: inline-block;
}

/* LIGHTBOX MODAL ANIMATIONS & STYLING */
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 15, 25, 0.88);
  backdrop-filter: blur(12px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.lightbox-card {
  width: 100%;
  max-width: 980px;
  max-height: 90vh;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

.lightbox-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  transition: background 0.2s, transform 0.2s;
}

.lightbox-close-btn:hover {
  background: #3A113D;
  transform: scale(1.08);
}

.lightbox-media-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 35;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transition: background 0.2s, transform 0.2s, border-color 0.2s;
}

.lightbox-media-nav-btn:hover {
  background: #3A113D;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.12);
}

.lightbox-media-nav-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.lightbox-media-nav-btn.prev-btn {
  left: 12px;
}

.lightbox-media-nav-btn.next-btn {
  right: 12px;
}

.lightbox-counter-badge {
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.lightbox-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .lightbox-content-grid {
    grid-template-columns: 1.2fr 1fr;
    max-height: 85vh;
  }
}

.lightbox-media-container {
  width: 100%;
  height: clamp(280px, 45vh, 520px);
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .lightbox-media-container {
    height: 100%;
    min-height: 420px;
  }
}

.lightbox-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lightbox-details {
  padding: 2.25rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.lightbox-category-badge {
  color: #c43ec7;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.6rem;
  display: inline-block;
}

.lightbox-title {
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.25;
  color: white;
}

.lightbox-description {
  font-size: 0.98rem;
  line-height: 1.7;
  color: #cbd5e1;
  margin: 0 0 1.5rem 0;
}

.lightbox-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 1.5rem;
}

.lightbox-actions {
  display: flex;
  gap: 1rem;
}

.lightbox-cta-btn {
  background: #3A113D;
  color: white;
  padding: 0.85rem 1.6rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(58, 17, 61, 0.45);
  transition: transform 0.2s ease, background 0.2s ease;
  width: 100%;
  text-align: center;
}

.lightbox-cta-btn:hover {
  transform: scale(1.03);
  background: #db2777;
}

/* TRANSICIÓN DE ENTRADA Y SALIDA DEL MODAL */
.lightbox-anim-enter-active,
.lightbox-anim-leave-active {
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.lightbox-anim-enter-active .lightbox-card,
.lightbox-anim-leave-active .lightbox-card {
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease;
}

.lightbox-anim-enter-from,
.lightbox-anim-leave-to {
  opacity: 0;
}

.lightbox-anim-enter-from .lightbox-card {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}

.lightbox-anim-leave-to .lightbox-card {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

/* ESTILOS EDITORIAL DE SECCIÓN NUESTROS SERVICIOS */
.services-editorial-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .services-editorial-grid {
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: clamp(2rem, 3.5vw, 4rem);
  }
}

.services-column {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.service-item {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  transition: transform 0.25s ease;
}

.service-item:hover {
  transform: translateY(-2px);
}

.service-item-left {
  text-align: right;
  flex-direction: row;
  justify-content: flex-end;
}

.service-item-right {
  text-align: left;
  flex-direction: row;
  justify-content: flex-start;
}

@media (max-width: 1023px) {
  .service-item-left {
    text-align: left;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
}

.service-title {
  font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  font-size: clamp(1.35rem, 2.2vw, 1.6rem);
  font-weight: 700;
  margin: 0 0 0.35rem 0;
  color: #3b1d3d;
  line-height: 1.2;
}

.dark .service-title {
  color: #f8fafc;
}

.service-desc {
  font-size: 0.85rem;
  line-height: 1.55;
  color: #64748b;
  margin: 0 0 0.4rem 0;
}

.dark .service-desc {
  color: #94a3b8;
}

.service-tag {
  font-size: 0.78rem;
  font-style: italic;
  color: #4a2c4b;
  display: block;
  line-height: 1.4;
  font-weight: 500;
}

.dark .service-tag {
  color: #f472b6;
}

.service-icon-wrapper {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a2c4b;
  margin-top: 2px;
}

.dark .service-icon-wrapper {
  color: #f472b6;
}

.service-svg-icon {
  width: 32px;
  height: 32px;
}

.services-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.25rem;
}

.service-hero-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 340px;
  display: flex;
  justify-content: center;
}

.service-hero-img {
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  filter: drop-shadow(0 15px 30px rgba(74, 44, 75, 0.15));
  transition: transform 0.4s ease;
}

.service-hero-img:hover {
  transform: scale(1.04);
}

.service-cta-button {
  background: #4a2c4b;
  color: #ffffff;
  padding: 0.95rem 2.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 8px 24px rgba(74, 44, 75, 0.25);
  transition: all 0.25s ease;
}

.service-cta-button:hover {
  background: #361f37;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(74, 44, 75, 0.35);
}

/* Swiper Fade Transition Fix (Evita texto empalmado entre slides) */
:deep(.swiper-slide) {
  opacity: 0 !important;
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
}
:deep(.swiper-slide-active) {
  opacity: 1 !important;
  pointer-events: auto;
}
</style>

