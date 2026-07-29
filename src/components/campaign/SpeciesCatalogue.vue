<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import catalogue from "../../content/quirilluca-catalogue.json";

type Mode = "flora" | "fauna";
type CatalogueRecord = (typeof catalogue.records)[number];

const props = defineProps<{ mode: Mode }>();
const query = ref("");
const group = ref("Todos");
const evidence = ref("Todos");
const visibleLimit = ref(24);
const selected = ref<CatalogueRecord | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
const lastTrigger = ref<HTMLElement | null>(null);

const records = computed(() =>
  catalogue.records.filter((record) =>
    props.mode === "flora" ? record.group === "Flora" : record.group !== "Flora"
  )
);

const groups = computed(() =>
  props.mode === "flora" ? ["Todos"] : ["Todos", "Ave", "Mamífero", "Reptil"]
);

const filtered = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase("es");
  return records.value.filter((record) => {
    const matchesGroup = group.value === "Todos" || record.group === group.value;
    const matchesEvidence = evidence.value === "Todos" || record.evidence === evidence.value;
    const haystack = `${record.commonName} ${record.scientificName} ${record.acceptedName}`.toLocaleLowerCase("es");
    return matchesGroup && matchesEvidence && (!needle || haystack.includes(needle));
  });
});

const visible = computed(() => filtered.value.slice(0, visibleLimit.value));
const fieldCount = computed(() =>
  records.value.filter((record) => record.evidence === "field" || record.evidence === "current").length
);

const heading = computed(() =>
  props.mode === "flora" ? "Guía completa de flora" : "Bestiario completo de fauna"
);

const catalogueNote = computed(() =>
  props.mode === "flora"
    ? "179 taxa reunidos por el diagnóstico del Ministerio del Medio Ambiente, junto al catastro 2024 de la orquídea Bipinnula fimbriata."
    : "85 especies documentadas por las campañas de terreno y las líneas base reunidas en el diagnóstico del Ministerio del Medio Ambiente."
);

const evidenceOptions = computed(() =>
  props.mode === "flora"
    ? [
        { value: "Todos", label: "Todos los registros" },
        { value: "current", label: "Catastro 2024" },
        { value: "unified", label: "Catálogo MMA" }
      ]
    : [
        { value: "Todos", label: "Todos los registros" },
        { value: "field", label: "Campañas 2014" },
        { value: "literature", label: "Líneas base" }
      ]
);

function evidenceLabel(record: CatalogueRecord) {
  if (record.evidence === "current") return "Catastro 2024";
  if (record.evidence === "field") return "Registro en terreno";
  if (record.evidence === "literature") return "Fuente histórica";
  return "Catálogo unificado";
}

function evidenceStory(record: CatalogueRecord) {
  if (record.evidence === "current") {
    return "El catastro publicado en 2024 registró esta orquídea en los Acantilados de Quirilluca y aporta una fotografía reciente de su presencia.";
  }
  if (record.evidence === "field") {
    return "Las campañas de terreno realizadas para el diagnóstico ambiental la observaron o detectaron en Quirilluca durante 2014.";
  }
  if (record.evidence === "literature") {
    return "Su presencia forma parte de las líneas base levantadas entre 2007 y 2013 y reunidas por el diagnóstico ambiental de Quirilluca.";
  }
  return "Este taxón integra el catálogo florístico unificado del diagnóstico de 2015, construido con campañas de terreno y antecedentes técnicos del territorio.";
}

function isGenusRecord(record: CatalogueRecord) {
  return /\bsp\.$/i.test(record.scientificName);
}

function visualLabel(record: CatalogueRecord) {
  if (!record.imageSpecific) return "Paisaje representativo de su hábitat";
  if (isGenusRecord(record)) return "Referencia visual del género";
  return "Imagen de la especie";
}

function openRecord(record: CatalogueRecord, event: MouseEvent) {
  selected.value = record;
  lastTrigger.value = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  nextTick(() => closeButton.value?.focus());
}

function closeRecord() {
  selected.value = null;
  nextTick(() => lastTrigger.value?.focus());
}

function resetFilters() {
  query.value = "";
  group.value = "Todos";
  evidence.value = "Todos";
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && selected.value) closeRecord();
}

watch([query, group, evidence], () => {
  visibleLimit.value = 24;
});

watch(selected, (value) => {
  document.body.style.overflow = value ? "hidden" : "";
});

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <section class="catalogue" :class="`catalogue--${mode}`">
    <header class="catalogue__header">
      <div>
        <p class="catalogue__eyebrow">Inventario documentado</p>
        <h2>{{ heading }}</h2>
      </div>
      <div class="catalogue__summary">
        <strong>{{ records.length }}</strong>
        <p>{{ catalogueNote }}</p>
      </div>
    </header>

    <div class="catalogue__metrics" aria-label="Resumen del catálogo">
      <span><strong>{{ records.length }}</strong> fichas</span>
      <span v-if="mode === 'fauna'"><strong>{{ fieldCount }}</strong> registros de campaña</span>
      <span><strong>{{ filtered.length }}</strong> resultados visibles</span>
    </div>

    <div class="catalogue__toolbar">
      <label class="catalogue__search">
        <span>Buscar por nombre</span>
        <input v-model="query" type="search" placeholder="Ej. belloto, piquero…" />
      </label>

      <div v-if="groups.length > 1" class="catalogue__pills" aria-label="Filtrar por grupo">
        <button
          v-for="option in groups"
          :key="option"
          type="button"
          class="focus-ring"
          :class="{ 'is-active': group === option }"
          :aria-pressed="group === option"
          @click="group = option"
        >
          {{ option }}
        </button>
      </div>

      <label class="catalogue__select">
        <span>Origen del registro</span>
        <select v-model="evidence">
          <option v-for="option in evidenceOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="visible.length" class="catalogue__grid">
      <button
        v-for="(record, index) in visible"
        :key="record.id"
        type="button"
        class="catalogue-card focus-ring"
        :class="{ 'catalogue-card--wide': index % 11 === 0 }"
        :aria-label="`Abrir ficha de ${record.commonName}`"
        @click="openRecord(record, $event)"
      >
        <span class="catalogue-card__image">
          <img
            :src="record.image"
            :alt="record.imageSpecific && !isGenusRecord(record) ? record.commonName : visualLabel(record)"
            loading="lazy"
          />
          <span v-if="!record.imageSpecific || isGenusRecord(record)" class="catalogue-card__habitat">
            {{ isGenusRecord(record) ? "Referencia del género" : "Imagen de hábitat" }}
          </span>
        </span>
        <span class="catalogue-card__copy">
          <span class="catalogue-card__meta">{{ record.group }} · {{ evidenceLabel(record) }}</span>
          <strong>{{ record.commonName }}</strong>
          <em>{{ record.scientificName }}</em>
          <span class="catalogue-card__action">Ver ficha y fuentes <i aria-hidden="true">↗</i></span>
        </span>
      </button>
    </div>

    <div v-else class="catalogue__empty">
      <p>El catálogo espera otra combinación de búsqueda.</p>
      <button type="button" class="focus-ring" @click="resetFilters">Ver todas las especies</button>
    </div>

    <button
      v-if="visible.length < filtered.length"
      type="button"
      class="catalogue__more focus-ring"
      @click="visibleLimit += 24"
    >
      Mostrar 24 fichas más
      <span>{{ visible.length }} / {{ filtered.length }}</span>
    </button>

    <footer class="catalogue__sources">
      <p>Fuentes generales del inventario</p>
      <a
        v-for="source in catalogue.sources"
        :key="source.url"
        :href="source.url"
        target="_blank"
        rel="noreferrer"
      >
        {{ source.label }}
        <span aria-hidden="true">↗</span>
      </a>
    </footer>

    <Teleport to="body">
      <Transition name="catalogue-lightbox">
        <div
          v-if="selected"
          class="catalogue-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`catalogue-title-${selected.id}`"
          @click.self="closeRecord"
        >
          <article class="catalogue-modal__shell">
            <button
              ref="closeButton"
              type="button"
              class="catalogue-modal__close focus-ring"
              aria-label="Cerrar ficha"
              @click="closeRecord"
            >
              ×
            </button>

            <div class="catalogue-modal__visual">
              <img
                :src="selected.image"
                :alt="selected.imageSpecific && !isGenusRecord(selected) ? selected.commonName : visualLabel(selected)"
              />
              <span>{{ visualLabel(selected) }}</span>
            </div>

            <div class="catalogue-modal__content">
              <p class="catalogue-modal__eyebrow">{{ selected.group }} · {{ evidenceLabel(selected) }}</p>
              <h3 :id="`catalogue-title-${selected.id}`">{{ selected.commonName }}</h3>
              <p class="catalogue-modal__scientific">{{ selected.scientificName }}</p>
              <p v-if="selected.acceptedName && !isGenusRecord(selected)" class="catalogue-modal__accepted">
                Nombre aceptado consultado: <em>{{ selected.acceptedName }}</em>
              </p>
              <p class="catalogue-modal__story">{{ evidenceStory(selected) }}</p>

              <div class="catalogue-modal__links">
                <a :href="selected.sourceUrl" target="_blank" rel="noreferrer">
                  <span>Fuente del registro en Quirilluca</span>
                  <strong>{{ selected.source }} ↗</strong>
                </a>
                <a
                  v-if="selected.imageSourceUrl || selected.taxonUrl"
                  :href="selected.imageSourceUrl || selected.taxonUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Fuente de la imagen y ficha taxonómica</span>
                  <strong>Consultar origen ↗</strong>
                </a>
              </div>

              <dl class="catalogue-modal__credits">
                <div>
                  <dt>Crédito visual</dt>
                  <dd>{{ selected.imageCredit }}</dd>
                </div>
                <div>
                  <dt>Licencia</dt>
                  <dd>{{ selected.imageLicense }}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.catalogue {
  --catalogue-accent: #d6a85f;
  --catalogue-soft: rgba(214, 168, 95, 0.15);
  margin-top: clamp(3.5rem, 8vw, 7rem);
}

.catalogue--fauna {
  --catalogue-accent: #8fc6d2;
  --catalogue-soft: rgba(111, 177, 191, 0.15);
}

.catalogue__header {
  display: grid;
  gap: 1.4rem;
  align-items: end;
  margin-bottom: 1.25rem;
}

.catalogue__eyebrow,
.catalogue-modal__eyebrow {
  color: var(--catalogue-accent);
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.catalogue__header h2 {
  max-width: 12ch;
  margin-top: 0.55rem;
  color: white;
  font-size: clamp(2rem, 4.7vw, 3.75rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.catalogue__summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  max-width: 39rem;
  color: var(--campaign-text-muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.catalogue__summary strong {
  color: var(--catalogue-accent);
  font-size: clamp(2.3rem, 5vw, 4rem);
  line-height: 0.8;
}

.catalogue__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1rem;
}

.catalogue__metrics span {
  padding: 0.48rem 0.72rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  color: var(--campaign-text-muted);
  font-size: 0.71rem;
}

.catalogue__metrics strong {
  color: white;
}

.catalogue__toolbar {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.035);
}

.catalogue__search,
.catalogue__select {
  display: grid;
  gap: 0.4rem;
  color: var(--campaign-text-muted);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.catalogue__search input,
.catalogue__select select {
  width: 100%;
  min-height: 2.7rem;
  padding: 0 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.8rem;
  outline: 0;
  background: #151811;
  color: white;
  font: inherit;
  font-size: 0.8rem;
  letter-spacing: 0;
  text-transform: none;
}

.catalogue__search input:focus,
.catalogue__select select:focus {
  border-color: var(--catalogue-accent);
}

.catalogue__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: end;
}

.catalogue__pills button {
  min-height: 2.7rem;
  padding: 0 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: transparent;
  color: var(--campaign-text-muted);
  font-size: 0.72rem;
}

.catalogue__pills button.is-active {
  border-color: var(--catalogue-accent);
  background: var(--catalogue-soft);
  color: white;
}

.catalogue__grid {
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

.catalogue-card {
  display: grid;
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1.15rem;
  background: #11140e;
  color: white;
  text-align: left;
}

.catalogue-card--wide {
  grid-column: span 2;
  grid-template-columns: minmax(8rem, 1.7fr) minmax(6rem, 0.65fr);
}

.catalogue-card__image {
  position: relative;
  display: block;
  min-height: 10rem;
  overflow: hidden;
  background: #24271f;
}

.catalogue--flora .catalogue-card:first-child .catalogue-card__image {
  min-height: 7rem;
}

.catalogue-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 450ms ease, filter 300ms ease;
}

.catalogue-card:hover .catalogue-card__image img {
  filter: saturate(1.1);
  transform: scale(1.045);
}

.catalogue-card__habitat {
  position: absolute;
  top: 0.55rem;
  left: 0.55rem;
  padding: 0.28rem 0.45rem;
  border-radius: 999px;
  background: rgba(7, 9, 6, 0.78);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.54rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.catalogue-card__copy {
  display: flex;
  min-width: 0;
  padding: 0.58rem;
  flex-direction: column;
}

.catalogue-card__meta {
  overflow: hidden;
  color: var(--catalogue-accent);
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.catalogue-card strong {
  margin-top: 0.36rem;
  font-size: 0.78rem;
  line-height: 1.05;
}

.catalogue-card em {
  margin-top: 0.2rem;
  overflow: hidden;
  color: var(--campaign-text-muted);
  font-family: Georgia, serif;
  font-size: 0.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.catalogue-card__action {
  display: flex;
  gap: 0.3rem;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.8rem;
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.54rem;
  font-weight: 700;
}

.catalogue__more {
  display: flex;
  width: min(100%, 24rem);
  min-height: 3.2rem;
  margin: 1.3rem auto 0;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--catalogue-accent);
  border-radius: 999px;
  background: var(--catalogue-soft);
  color: white;
  font-weight: 800;
}

.catalogue__more span {
  color: var(--catalogue-accent);
  font-size: 0.7rem;
}

.catalogue__empty {
  padding: 3rem 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 1.2rem;
  color: var(--campaign-text-muted);
  text-align: center;
}

.catalogue__empty button {
  margin-top: 1rem;
  border-bottom: 1px solid var(--catalogue-accent);
  color: white;
}

.catalogue__sources {
  display: grid;
  gap: 0.6rem;
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.catalogue__sources p {
  color: var(--catalogue-accent);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.catalogue__sources a {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  color: var(--campaign-text-muted);
  font-size: 0.74rem;
  line-height: 1.4;
  text-decoration: none;
}

.catalogue__sources a:hover {
  color: white;
}

.catalogue-modal {
  position: fixed;
  z-index: 260;
  inset: 0;
  display: grid;
  padding: 1rem;
  place-items: center;
  overflow: auto;
  background: rgba(3, 5, 3, 0.9);
  backdrop-filter: blur(14px);
}

.catalogue-modal__shell {
  position: relative;
  display: grid;
  width: min(100%, 70rem);
  max-height: min(90vh, 43rem);
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 1.4rem;
  background: #10130d;
  box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.55);
}

.catalogue-modal__close {
  position: absolute;
  z-index: 2;
  top: 0.7rem;
  right: 0.7rem;
  display: grid;
  width: 2.4rem;
  height: 2.4rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(8, 10, 7, 0.85);
  color: white;
  font-size: 1.4rem;
}

.catalogue-modal__visual {
  position: relative;
  min-height: 14rem;
  overflow: hidden;
  background: #292c24;
}

.catalogue-modal__visual img {
  width: 100%;
  height: 100%;
  max-height: 26rem;
  object-fit: cover;
}

.catalogue-modal__visual span {
  position: absolute;
  bottom: 0.7rem;
  left: 0.7rem;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: rgba(7, 9, 6, 0.8);
  color: white;
  font-size: 0.6rem;
}

.catalogue-modal__content {
  padding: clamp(1.1rem, 3vw, 2rem);
}

.catalogue-modal h3 {
  max-width: 13ch;
  margin-top: 0.35rem;
  color: white;
  font-size: clamp(1.45rem, 3vw, 2.35rem);
  line-height: 0.94;
  letter-spacing: -0.045em;
}

.catalogue-modal__scientific {
  margin-top: 0.45rem;
  color: var(--catalogue-accent);
  font-family: Georgia, serif;
  font-size: 0.9rem;
  font-style: italic;
}

.catalogue-modal__accepted {
  margin-top: 0.35rem;
  color: var(--campaign-text-muted);
  font-size: 0.7rem;
}

.catalogue-modal__story {
  max-width: 42rem;
  margin-top: 1.15rem;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.75rem;
  line-height: 1.5;
}

.catalogue-modal__links {
  display: grid;
  gap: 0.55rem;
  margin-top: 1.25rem;
}

.catalogue-modal__links a {
  display: grid;
  gap: 0.2rem;
  padding: 0.72rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.035);
  color: var(--campaign-text-muted);
  font-size: 0.62rem;
  text-decoration: none;
}

.catalogue-modal__links strong {
  color: white;
  font-size: 0.74rem;
}

.catalogue-modal__credits {
  display: grid;
  gap: 0.65rem;
  margin-top: 1rem;
}

.catalogue-modal__credits div {
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.catalogue-modal__credits dt {
  color: var(--catalogue-accent);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.catalogue-modal__credits dd {
  margin-top: 0.25rem;
  color: var(--campaign-text-muted);
  font-size: 0.65rem;
  line-height: 1.45;
}

.catalogue-lightbox-enter-active,
.catalogue-lightbox-leave-active {
  transition: opacity 220ms ease;
}

.catalogue-lightbox-enter-active .catalogue-modal__shell,
.catalogue-lightbox-leave-active .catalogue-modal__shell {
  transition: transform 260ms ease;
}

.catalogue-lightbox-enter-from,
.catalogue-lightbox-leave-to {
  opacity: 0;
}

.catalogue-lightbox-enter-from .catalogue-modal__shell,
.catalogue-lightbox-leave-to .catalogue-modal__shell {
  transform: translateY(1rem) scale(0.98);
}

@media (min-width: 720px) {
  .catalogue__header {
    grid-template-columns: 0.8fr 1.2fr;
  }

  .catalogue__toolbar {
    grid-template-columns: minmax(13rem, 1.2fr) auto minmax(10rem, 0.8fr);
    align-items: end;
  }

  .catalogue__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .catalogue--flora .catalogue-card:nth-child(-n + 3) .catalogue-card__image {
    min-height: 7rem;
  }

  .catalogue-card--wide {
    grid-column: span 2;
  }

  .catalogue-modal__shell {
    grid-template-columns: minmax(24rem, 1.8fr) minmax(17rem, 0.62fr);
    overflow: hidden;
  }

  .catalogue-modal__visual {
    min-height: 40rem;
  }

  .catalogue-modal__visual img {
    max-height: none;
  }

  .catalogue-modal__content {
    overflow-y: auto;
  }

  .catalogue-modal__links,
  .catalogue-modal__credits {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .catalogue__grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .catalogue--flora .catalogue-card:nth-child(-n + 5) .catalogue-card__image {
    min-height: 7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .catalogue-card__image img,
  .catalogue-lightbox-enter-active,
  .catalogue-lightbox-leave-active,
  .catalogue-lightbox-enter-active .catalogue-modal__shell,
  .catalogue-lightbox-leave-active .catalogue-modal__shell {
    transition: none;
  }
}
</style>
