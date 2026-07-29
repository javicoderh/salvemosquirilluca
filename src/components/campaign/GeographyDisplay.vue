<script setup lang="ts">
const landscapeLayers = [
  {
    title: "Acantilado y terrazas",
    text: "Estratos y sedimentos marinos de la Formación Horcón levantan una memoria geológica frente al Pacífico.",
    image: "/assets/quirilluca/EDQ-05_paisaje_geologia_cueva_costera.jpg",
    alt: "Estratos geológicos y cueva costera de Quirilluca"
  },
  {
    title: "Quebradas y agua",
    text: "La red de quebradas, vertientes y escurrimientos conecta el interior con la playa y sostiene microhábitats.",
    image: "/assets/quirilluca/OTR-03_paisaje_quebrada_playa_credito_salvemos_quirilluca_facebook.jpg",
    alt: "Quebrada que desciende hacia la playa de Quirilluca"
  },
  {
    title: "Borde marino",
    text: "Playas, roqueríos e intermareal forman la franja cambiante donde se encuentran tierra y océano.",
    image: "/assets/quirilluca/LSQ-02_paisaje_playa_quirilluca.jpg",
    alt: "Playa y borde marino de Quirilluca"
  }
];

const economy = [
  {
    number: "01",
    title: "Pesca artesanal",
    text: "Caleta Horcón mantiene una relación productiva y cultural con el mar. La salud del borde costero también sostiene esa continuidad."
  },
  {
    number: "02",
    title: "Turismo y oficios locales",
    text: "Paisaje, gastronomía, artesanía y servicios reciben visitantes. Una experiencia cuidadosa mantiene el equilibrio de los sectores frágiles."
  },
  {
    number: "03",
    title: "Actividad industrial regional",
    text: "El territorio se inserta en la zona Quintero–Puchuncaví, marcada por actividad industrial y una larga historia de justicia ambiental."
  }
];
</script>

<template>
  <section class="geo-display">
    <header class="geo-display__header">
      <div>
        <p>Atlas sensible</p>
        <h2>Donde la tierra aprende el idioma del mar</h2>
      </div>
      <div class="geo-display__lead">
        <p>
          Quirilluca está en la costa de Puchuncaví, entre Horcón y Maitencillo. Es un sistema de
          acantilados, quebradas, bosque, playa y aguas costeras conectado con la vida
          comunal de la Región de Valparaíso.
        </p>
        <span>Localización comunal · resguardo de áreas sensibles</span>
      </div>
    </header>

    <div class="geo-display__panorama">
      <img
        src="/assets/quirilluca/LSQ-01_paisaje_acantilados_portada.jpg"
        alt="Acantilados, vegetación y océano en Quirilluca"
        loading="lazy"
      />
      <div class="geo-display__panorama-copy">
        <span>Pacífico suroriental</span>
        <strong>Un corredor costero tejido por múltiples paisajes</strong>
      </div>
      <div class="geo-display__coordinates" aria-hidden="true">
        <span>bosque</span><i></i><span>quebrada</span><i></i><span>acantilado</span><i></i><span>mar</span>
      </div>
    </div>

    <div class="geo-display__facts">
      <article>
        <span>Clima</span>
        <h3>Mediterráneo costero</h3>
        <p>Veranos secos, lluvias concentradas en invierno y una influencia marina que modera temperaturas, aporta humedad y mueve nieblas.</p>
      </article>
      <article>
        <span>Relieve</span>
        <h3>Terrazas, quebradas y farellones</h3>
        <p>El terreno desciende por quebradas hacia playas y roqueríos. Los acantilados exponen capas que cuentan antiguos ambientes marinos.</p>
      </article>
      <article>
        <span>Sistema vivo</span>
        <h3>1.045 hectáreas en relación</h3>
        <p>El ex Fundo Quirilluca abarca un mosaico donde agua, suelo, vegetación, fauna y memoria local se afectan mutuamente.</p>
      </article>
    </div>

    <div class="geo-display__layers">
      <article
        v-for="(layer, index) in landscapeLayers"
        :key="layer.title"
        class="geo-layer"
        :class="`geo-layer--${index + 1}`"
      >
        <img :src="layer.image" :alt="layer.alt" loading="lazy" />
        <div>
          <span>0{{ index + 1 }} · forma del territorio</span>
          <h3>{{ layer.title }}</h3>
          <p>{{ layer.text }}</p>
        </div>
      </article>
    </div>

    <div class="geo-display__map-grid">
      <figure class="political-map">
        <div class="political-map__heading">
          <div>
            <span>Mapa político esquemático</span>
            <h3>Región de Valparaíso</h3>
          </div>
          <p>Quirilluca se ubica en la comuna de Puchuncaví, provincia de Valparaíso.</p>
        </div>

        <svg viewBox="0 0 620 690" role="img" aria-labelledby="map-title map-description">
          <title id="map-title">Ubicación de Quirilluca en la Región de Valparaíso</title>
          <desc id="map-description">
            Mapa político esquemático de las provincias de la Región de Valparaíso, con una señal referencial
            en Puchuncaví para indicar el sector costero de Quirilluca.
          </desc>
          <defs>
            <filter id="marker-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="sea-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#183946" />
              <stop offset="1" stop-color="#0a171c" />
            </linearGradient>
          </defs>

          <rect width="620" height="690" rx="28" fill="url(#sea-gradient)" />
          <text x="50" y="350" class="map-sea" transform="rotate(-90 50 350)">OCÉANO PACÍFICO</text>

          <g class="map-provinces">
            <path class="province province--petorca" d="M182 48 350 63 405 122 373 190 257 208 158 164Z" />
            <path class="province province--san-felipe" d="M373 190 405 122 492 150 538 222 471 265 381 248Z" />
            <path class="province province--los-andes" d="M381 248 471 265 538 222 566 315 497 365 389 333Z" />
            <path class="province province--quillota" d="M158 164 257 208 373 190 381 248 327 307 210 291 146 244Z" />
            <path class="province province--valparaiso" d="M146 244 210 291 327 307 302 384 219 419 132 359 116 294Z" />
            <path class="province province--marga" d="M327 307 381 248 389 333 497 365 444 425 335 410 302 384Z" />
            <path class="province province--san-antonio" d="M132 359 219 419 302 384 335 410 318 514 252 608 157 578 109 476Z" />
          </g>

          <g class="map-labels" aria-hidden="true">
            <text x="245" y="126">PETORCA</text>
            <text x="439" y="205">SAN FELIPE</text>
            <text x="454" y="306">LOS ANDES</text>
            <text x="241" y="251">QUILLOTA</text>
            <text x="203" y="348">VALPARAÍSO</text>
            <text x="358" y="374">MARGA MARGA</text>
            <text x="184" y="499">SAN ANTONIO</text>
          </g>

          <g class="map-marker" transform="translate(164 270)">
            <circle r="25" class="map-marker__pulse" filter="url(#marker-glow)" />
            <circle r="10" class="map-marker__core" />
            <path d="M0 11 8 24 0 33-8 24Z" class="map-marker__pin" />
          </g>
          <path d="M174 270 C225 250 280 235 347 245" class="map-marker__line" />
          <g class="map-marker__label" transform="translate(347 218)">
            <rect width="218" height="58" rx="14" />
            <text x="16" y="24">QUIRILLUCA</text>
            <text x="16" y="43">Puchuncaví · costa continental</text>
          </g>

          <g class="map-insets" transform="translate(370 510)">
            <rect width="210" height="130" rx="18" />
            <path d="M22 42 46 27 69 38 53 57 29 59Z" />
            <path d="M91 43 110 32 127 42 116 55 96 57Z" />
            <text x="20" y="82">JUAN FERNÁNDEZ</text>
            <circle cx="170" cy="43" r="12" />
            <text x="145" y="82">RAPA NUI</text>
            <text x="20" y="108">Territorios insulares · esquemático</text>
          </g>
        </svg>

        <figcaption>
          Las divisiones ofrecen orientación editorial. La cartografía oficial entrega el detalle territorial.
          El marcador mantiene protegidas las coordenadas de nidos, flora amenazada y accesos frágiles.
        </figcaption>
      </figure>

      <aside class="geo-display__place">
        <span>Del mapa al lugar</span>
        <h3>Entre Horcón y Maitencillo</h3>
        <p>
          En la costa continental de la Región de Valparaíso, Quirilluca mira al poniente. Su posición conecta
          la vida de Caleta Horcón con quebradas, bosque esclerófilo, playas y una colonia reproductiva de piquero común.
        </p>
        <dl>
          <div><dt>Región</dt><dd>Valparaíso</dd></div>
          <div><dt>Provincia</dt><dd>Valparaíso</dd></div>
          <div><dt>Comuna</dt><dd>Puchuncaví</dd></div>
          <div><dt>Referencia</dt><dd>Horcón–Maitencillo</dd></div>
        </dl>
        <div class="geo-display__place-image">
          <img
            src="/assets/quirilluca/OTR-02_paisaje_vista_aerea_acantilados.jpg"
            alt="Vista aérea referencial de los acantilados de Quirilluca"
            loading="lazy"
          />
        </div>
      </aside>
    </div>

    <section class="geo-display__economy">
      <header>
        <p>Territorio habitado</p>
        <h3>Economías que también dependen del paisaje</h3>
      </header>
      <div>
        <article v-for="item in economy" :key="item.number">
          <span>{{ item.number }}</span>
          <h4>{{ item.title }}</h4>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <div class="geo-display__closing">
      <p>
        La geografía protagoniza esta historia:
        <strong>la forma física que permite que la vida, el trabajo y la memoria ocurran.</strong>
      </p>
    </div>
  </section>
</template>

<style scoped>
.geo-display {
  color: white;
}

.geo-display__header {
  display: grid;
  gap: 1.5rem;
  align-items: end;
}

.geo-display__header > div:first-child > p,
.political-map__heading span,
.geo-display__place > span,
.geo-display__economy header p {
  color: #8fc6d2;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.geo-display__header h2 {
  max-width: 14ch;
  margin-top: 0.55rem;
  font-size: clamp(2rem, 4.8vw, 3.8rem);
  font-weight: 900;
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.geo-display__lead > p {
  color: var(--campaign-text-muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

.geo-display__lead span {
  display: inline-flex;
  margin-top: 1rem;
  border: 1px solid rgba(143, 198, 210, 0.2);
  border-radius: 999px;
  background: rgba(143, 198, 210, 0.08);
  padding: 0.45rem 0.75rem;
  color: #8fc6d2;
  font-size: 0.68rem;
  font-weight: 700;
}

.geo-display__panorama {
  position: relative;
  min-height: clamp(24rem, 62vw, 44rem);
  margin-top: 1.35rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.6rem;
  background: #0c100b;
}

.geo-display__panorama::after {
  position: absolute;
  inset: 0;
  content: "";
  background:
    linear-gradient(180deg, transparent 35%, rgba(7, 9, 6, 0.84) 100%),
    linear-gradient(90deg, rgba(7, 9, 6, 0.45), transparent 65%);
}

.geo-display__panorama > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.geo-display__panorama-copy {
  position: absolute;
  bottom: 4.6rem;
  left: clamp(1.25rem, 4vw, 3rem);
  z-index: 1;
  max-width: 42rem;
}

.geo-display__panorama-copy span {
  color: #d6a85f;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.geo-display__panorama-copy strong {
  display: block;
  margin-top: 0.5rem;
  font-size: clamp(1.8rem, 5vw, 4.4rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.geo-display__coordinates {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  left: 1.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.geo-display__coordinates i {
  height: 1px;
  flex: 1;
  margin: 0 0.5rem;
  background: rgba(255, 255, 255, 0.26);
}

.geo-display__facts {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.geo-display__facts article {
  padding: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.035);
}

.geo-display__facts span,
.geo-layer span {
  color: #d6a85f;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.geo-display__facts h3 {
  margin-top: 0.45rem;
  font-size: 1.2rem;
  font-weight: 800;
}

.geo-display__facts p,
.geo-layer p {
  margin-top: 0.7rem;
  color: var(--campaign-text-muted);
  font-size: 0.82rem;
  line-height: 1.65;
}

.geo-display__layers {
  display: grid;
  gap: 0.75rem;
  margin-top: 3.5rem;
}

.geo-layer {
  position: relative;
  min-height: 25rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
}

.geo-layer::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(180deg, transparent 30%, rgba(7, 9, 6, 0.94) 100%);
}

.geo-layer img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms ease;
}

.geo-layer:hover img {
  transform: scale(1.035);
}

.geo-layer > div {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  left: 1.25rem;
  z-index: 1;
}

.geo-layer h3 {
  margin-top: 0.35rem;
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 900;
  line-height: 1;
}

.geo-display__map-grid {
  display: grid;
  gap: 0.75rem;
  margin-top: 3.5rem;
}

.political-map,
.geo-display__place {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  background: #11150f;
}

.political-map__heading {
  display: grid;
  gap: 1rem;
  padding: 1.4rem;
}

.political-map__heading h3,
.geo-display__place h3,
.geo-display__economy h3 {
  margin-top: 0.35rem;
  font-size: clamp(1.6rem, 4vw, 2.8rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.035em;
}

.political-map__heading > p {
  max-width: 28rem;
  color: var(--campaign-text-muted);
  font-size: 0.82rem;
  line-height: 1.55;
}

.political-map svg {
  display: block;
  width: 100%;
  height: auto;
  padding: 0 0.75rem;
}

.province {
  stroke: rgba(255, 255, 255, 0.42);
  stroke-width: 2;
  transition: filter 220ms ease, opacity 220ms ease;
}

.province:hover {
  filter: brightness(1.17);
}

.province--petorca { fill: #6d8052; }
.province--san-felipe { fill: #816e4b; }
.province--los-andes { fill: #6d654d; }
.province--quillota { fill: #56735c; }
.province--valparaiso { fill: #3f7772; }
.province--marga { fill: #705f6c; }
.province--san-antonio { fill: #4f6872; }

.map-labels text {
  fill: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-anchor: middle;
}

.map-sea {
  fill: rgba(143, 198, 210, 0.55);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.map-marker__pulse {
  fill: rgba(230, 142, 92, 0.42);
}

.map-marker__core,
.map-marker__pin {
  fill: #f09a69;
  stroke: white;
  stroke-width: 2;
}

.map-marker__line {
  fill: none;
  stroke: #f09a69;
  stroke-width: 2;
  stroke-dasharray: 5 6;
}

.map-marker__label rect {
  fill: rgba(8, 10, 7, 0.88);
  stroke: rgba(240, 154, 105, 0.55);
}

.map-marker__label text:first-of-type {
  fill: white;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.map-marker__label text:last-of-type {
  fill: #f09a69;
  font-size: 11px;
  font-weight: 700;
}

.map-insets rect {
  fill: rgba(255, 255, 255, 0.04);
  stroke: rgba(255, 255, 255, 0.18);
}

.map-insets path,
.map-insets circle {
  fill: #65745b;
  stroke: rgba(255, 255, 255, 0.38);
}

.map-insets text {
  fill: rgba(255, 255, 255, 0.75);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.map-insets text:last-child {
  fill: rgba(255, 255, 255, 0.45);
  font-size: 8px;
}

.political-map figcaption {
  padding: 1rem 1.4rem 1.4rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.7rem;
  line-height: 1.55;
}

.geo-display__place {
  padding: 1.4rem;
}

.geo-display__place > p {
  margin-top: 1.1rem;
  color: var(--campaign-text-muted);
  font-size: 0.9rem;
  line-height: 1.7;
}

.geo-display__place dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 1.5rem;
}

.geo-display__place dl > div {
  padding: 0.85rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.045);
}

.geo-display__place dt {
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}

.geo-display__place dd {
  margin-top: 0.3rem;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
}

.geo-display__place-image {
  height: 15rem;
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 1rem;
}

.geo-display__place-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.geo-display__economy {
  display: grid;
  gap: 1.75rem;
  margin-top: 3.5rem;
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at 10% 10%, rgba(214, 168, 95, 0.11), transparent 38%),
    rgba(255, 255, 255, 0.025);
}

.geo-display__economy > div {
  display: grid;
  gap: 0.75rem;
}

.geo-display__economy article {
  padding: 1.2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.geo-display__economy article > span {
  color: #d6a85f;
  font-size: 0.7rem;
  font-weight: 800;
}

.geo-display__economy h4 {
  margin-top: 0.45rem;
  font-size: 1.2rem;
  font-weight: 800;
}

.geo-display__economy article p {
  margin-top: 0.65rem;
  color: var(--campaign-text-muted);
  font-size: 0.82rem;
  line-height: 1.65;
}

.geo-display__closing {
  display: grid;
  min-height: 18rem;
  place-items: center;
  margin-top: 3.5rem;
  border-radius: 1.5rem;
  background:
    linear-gradient(rgba(8, 10, 7, 0.7), rgba(8, 10, 7, 0.86)),
    url("/assets/quirilluca/LSQ-12_paisaje_acantilados_02.jpg") center / cover;
  padding: 2rem;
  text-align: center;
}

.geo-display__closing p {
  max-width: 48rem;
  color: rgba(255, 255, 255, 0.74);
  font-family: Georgia, serif;
  font-size: clamp(1.25rem, 3.5vw, 2.2rem);
  line-height: 1.45;
}

.geo-display__closing strong {
  color: white;
  font-weight: 400;
}

@media (min-width: 760px) {
  .geo-display__header {
    grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.75fr);
  }

  .geo-display__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .geo-display__layers {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: repeat(2, 15rem);
  }

  .geo-layer {
    min-height: 0;
  }

  .geo-layer--1 {
    grid-column: span 7;
    grid-row: span 2;
  }

  .geo-layer--2,
  .geo-layer--3 {
    grid-column: span 5;
  }

  .political-map__heading {
    grid-template-columns: 1fr minmax(15rem, 0.75fr);
    align-items: end;
  }

  .geo-display__economy {
    grid-template-columns: minmax(15rem, 0.55fr) 1fr;
  }

  .geo-display__economy > div {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .geo-display__map-grid {
    grid-template-columns: minmax(0, 1.45fr) minmax(20rem, 0.55fr);
  }
}
</style>
