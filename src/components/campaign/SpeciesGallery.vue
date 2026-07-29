<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { TerritorySpecies } from "../../content/quirilluca-territory";

const props = defineProps<{
  eyebrow: string;
  title: string;
  intro: string;
  items: TerritorySpecies[];
  tone: "flora" | "fauna";
}>();

const selectedIndex = ref<number | null>(null);
const imageIndex = ref(0);
const closeButton = ref<HTMLButtonElement | null>(null);
const lastTrigger = ref<HTMLElement | null>(null);
const selected = computed(() =>
  selectedIndex.value === null ? null : props.items[selectedIndex.value]
);
const currentImage = computed(() => selected.value?.images[imageIndex.value] ?? null);

function openSpecies(index: number, event: MouseEvent) {
  lastTrigger.value = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  selectedIndex.value = index;
  imageIndex.value = 0;
  nextTick(() => closeButton.value?.focus());
}

function closeSpecies() {
  selectedIndex.value = null;
  imageIndex.value = 0;
  nextTick(() => lastTrigger.value?.focus());
}

function moveImage(direction: number) {
  if (!selected.value) return;
  const length = selected.value.images.length;
  imageIndex.value = (imageIndex.value + direction + length) % length;
}

function onKeydown(event: KeyboardEvent) {
  if (selectedIndex.value === null) return;
  if (event.key === "Escape") closeSpecies();
  if (event.key === "ArrowLeft") moveImage(-1);
  if (event.key === "ArrowRight") moveImage(1);
}

watch(selectedIndex, (value) => {
  document.body.style.overflow = value === null ? "" : "hidden";
});

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <section class="species-display" :class="`species-display--${tone}`">
    <header class="species-display__header">
      <div>
        <p class="species-display__eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <p>{{ intro }}</p>
    </header>

    <div class="species-display__mosaic">
      <button
        v-for="(species, index) in items"
        :key="species.id"
        type="button"
        class="species-card focus-ring"
        :class="`species-card--${index + 1}`"
        :aria-label="`Conocer ${species.name}`"
        @click="openSpecies(index, $event)"
      >
        <img :src="species.images[0].src" :alt="species.images[0].alt" loading="lazy" />
        <span class="species-card__veil"></span>
        <span class="species-card__number">{{ String(index + 1).padStart(2, "0") }}</span>
        <span class="species-card__copy">
          <span class="species-card__kind">{{ species.kind }}</span>
          <strong>{{ species.name }}</strong>
          <em>{{ species.scientificName }}</em>
          <span class="species-card__summary">{{ species.summary }}</span>
          <span class="species-card__action">
            Abrir historia
            <span aria-hidden="true">↗</span>
          </span>
        </span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="species-lightbox">
        <div
          v-if="selected && currentImage"
          class="species-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`species-modal-${selected.id}`"
          @click.self="closeSpecies"
        >
          <div class="species-modal__shell">
            <button
              ref="closeButton"
              type="button"
              class="species-modal__close focus-ring"
              aria-label="Cerrar ficha"
              @click="closeSpecies"
            >
              <span aria-hidden="true">×</span>
            </button>

            <div class="species-modal__visual">
              <img :src="currentImage.src" :alt="currentImage.alt" />
              <div class="species-modal__counter">
                {{ imageIndex + 1 }} / {{ selected.images.length }}
              </div>
              <template v-if="selected.images.length > 1">
                <button
                  type="button"
                  class="species-modal__arrow species-modal__arrow--prev focus-ring"
                  aria-label="Fotografía anterior"
                  @click="moveImage(-1)"
                >
                  ‹
                </button>
                <button
                  type="button"
                  class="species-modal__arrow species-modal__arrow--next focus-ring"
                  aria-label="Fotografía siguiente"
                  @click="moveImage(1)"
                >
                  ›
                </button>
              </template>
            </div>

            <article class="species-modal__story">
              <p class="species-modal__kind">{{ selected.kind }}</p>
              <h3 :id="`species-modal-${selected.id}`">{{ selected.name }}</h3>
              <p class="species-modal__scientific">{{ selected.scientificName }}</p>
              <p class="species-modal__narrative">{{ selected.story }}</p>

              <div class="species-modal__facts">
                <div>
                  <span>Función ecológica</span>
                  <p>{{ selected.ecologicalRole }}</p>
                </div>
                <div>
                  <span>Cómo mirar</span>
                  <p>{{ selected.observation }}</p>
                </div>
              </div>

              <div v-if="selected.images.length > 1" class="species-modal__thumbs" aria-label="Fotografías disponibles">
                <button
                  v-for="(image, index) in selected.images"
                  :key="image.src"
                  type="button"
                  class="focus-ring"
                  :class="{ 'is-active': index === imageIndex }"
                  :aria-label="`Ver fotografía ${index + 1}`"
                  :aria-current="index === imageIndex ? 'true' : undefined"
                  @click="imageIndex = index"
                >
                  <img :src="image.src" alt="" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.species-display {
  --accent: #d6a85f;
  --accent-soft: rgba(214, 168, 95, 0.14);
}

.species-display--fauna {
  --accent: #8fc6d2;
  --accent-soft: rgba(111, 177, 191, 0.14);
}

.species-display__header {
  display: grid;
  gap: 1.5rem;
  align-items: end;
  margin-bottom: 1.35rem;
}

.species-display__eyebrow,
.species-card__kind,
.species-modal__kind {
  color: var(--accent);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.species-card__kind {
  color: color-mix(in srgb, var(--accent) 82%, transparent);
  font-size: 0.55rem;
}

.species-display__header h2 {
  max-width: 12ch;
  margin-top: 0.5rem;
  color: white;
  font-size: clamp(2rem, 4.8vw, 3.8rem);
  font-weight: 900;
  line-height: 0.93;
  letter-spacing: -0.05em;
}

.species-display__header > p {
  max-width: 39rem;
  color: var(--campaign-text-muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

.species-display__mosaic {
  display: grid;
  grid-auto-flow: dense;
  grid-auto-rows: 5.6rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

.species-card {
  position: relative;
  grid-row: span 2;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 1.4rem;
  background: #11130d;
  color: white;
  text-align: left;
  isolation: isolate;
}

.species-card--1 {
  grid-column: span 2;
  grid-row: span 3;
}

.species-display--flora .species-card--1 {
  grid-row: span 2;
}

.species-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1), filter 400ms ease;
}

.species-card__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 58%, rgba(8, 10, 7, 0.74) 100%),
    linear-gradient(90deg, rgba(8, 10, 7, 0.12), transparent 52%);
}

.species-card__number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 999px;
  background: rgba(8, 10, 7, 0.24);
  font-size: 0.58rem;
  font-weight: 800;
  backdrop-filter: blur(10px);
}

.species-card__copy {
  position: absolute;
  right: 0.85rem;
  bottom: 0.85rem;
  left: 0.85rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.species-card__copy strong {
  margin-top: 0.18rem;
  font-size: clamp(0.95rem, 1.8vw, 1.35rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.035em;
}

.species-card__copy em {
  margin-top: 0.22rem;
  color: rgba(255, 255, 255, 0.58);
  font-family: Georgia, serif;
  font-size: 0.66rem;
}

.species-card__summary {
  display: none;
  max-width: 28rem;
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.82rem;
  line-height: 1.5;
}

.species-card__action {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.34rem;
  color: var(--accent);
  opacity: 0.72;
  font-size: 0.56rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.species-card:hover img {
  filter: saturate(1.08) contrast(1.04);
  transform: scale(1.045);
}

.species-card:hover .species-card__action span {
  transform: translate(0.15rem, -0.15rem);
}

@media (min-width: 700px) {
  .species-display__header {
    grid-template-columns: minmax(0, 0.95fr) minmax(18rem, 0.75fr);
  }

  .species-display__mosaic {
    grid-auto-rows: 4.9rem;
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .species-card {
    grid-column: span 2;
    grid-row: span 3;
  }

  .species-card--1 {
    grid-column: span 3;
    grid-row: span 4;
  }

  .species-card--2 {
    grid-column: span 3;
    grid-row: span 2;
  }

  .species-card--3 {
    grid-column: span 3;
    grid-row: span 2;
  }

  .species-card--7 {
    grid-column: span 6;
    grid-row: span 2;
  }

  .species-display--flora .species-card--1 {
    grid-column: span 4;
    grid-row: span 3;
  }

  .species-display--flora .species-card--2 {
    grid-column: span 2;
    grid-row: span 3;
  }

  .species-display--flora .species-card--3,
  .species-display--flora .species-card--4,
  .species-display--flora .species-card--5 {
    grid-column: span 2;
    grid-row: span 2;
  }

  .species-display--flora .species-card--6,
  .species-display--flora .species-card--7 {
    grid-column: span 3;
    grid-row: span 3;
  }
}

@media (min-width: 1024px) {
  .species-display__mosaic {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .species-card {
    grid-column: span 4;
  }

  .species-card--1 {
    grid-column: span 6;
    grid-row: span 4;
  }

  .species-card--2 {
    grid-column: span 3;
    grid-row: span 2;
  }

  .species-card--3 {
    grid-column: span 3;
    grid-row: span 2;
  }

  .species-card--4 {
    grid-column: span 3;
    grid-row: span 2;
  }

  .species-card--5 {
    grid-column: span 3;
    grid-row: span 2;
  }

  .species-card--6 {
    grid-column: span 5;
    grid-row: span 3;
  }

  .species-card--7 {
    grid-column: span 7;
    grid-row: span 3;
  }

  .species-display--flora .species-card--1 {
    grid-column: span 6;
    grid-row: span 3;
  }

  .species-display--flora .species-card--2,
  .species-display--flora .species-card--3 {
    grid-column: span 3;
    grid-row: span 3;
  }

  .species-display--flora .species-card--4,
  .species-display--flora .species-card--5 {
    grid-column: span 6;
    grid-row: span 2;
  }

  .species-display--flora .species-card--6 {
    grid-column: span 5;
    grid-row: span 3;
  }

  .species-display--flora .species-card--7 {
    grid-column: span 7;
    grid-row: span 3;
  }
}
</style>

<style>
.species-modal {
  position: fixed;
  inset: 0;
  z-index: 240;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(5, 7, 5, 0.9);
  backdrop-filter: blur(16px);
}

.species-modal__shell {
  position: relative;
  display: grid;
  width: min(76rem, 100%);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 1.5rem;
  background: #10130d;
  box-shadow: 0 2rem 8rem rgba(0, 0, 0, 0.58);
}

.species-modal__close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 4;
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 999px;
  background: rgba(8, 10, 7, 0.78);
  color: white;
  font-size: 1.8rem;
  line-height: 1;
}

.species-modal__visual {
  position: relative;
  display: grid;
  min-height: 17rem;
  place-items: center;
  overflow: hidden;
  background: #060705;
}

.species-modal__visual img {
  width: 100%;
  height: 100%;
  max-height: 56vh;
  object-fit: contain;
}

.species-modal__counter {
  position: absolute;
  bottom: 0.85rem;
  left: 0.85rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(8, 10, 7, 0.7);
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
}

.species-modal__arrow {
  position: absolute;
  top: 50%;
  display: grid;
  width: 2.8rem;
  height: 2.8rem;
  place-items: center;
  transform: translateY(-50%);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(8, 10, 7, 0.7);
  color: white;
  font-size: 2rem;
}

.species-modal__arrow--prev {
  left: 0.75rem;
}

.species-modal__arrow--next {
  right: 0.75rem;
}

.species-modal__story {
  padding: 1rem;
}

.species-modal__kind {
  color: #d6a85f;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.species-modal__story h3 {
  margin-top: 0.45rem;
  color: white;
  font-size: clamp(1.45rem, 2.8vw, 2.25rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.species-modal__scientific {
  margin-top: 0.4rem;
  color: #8fc6d2;
  font-family: Georgia, serif;
  font-style: italic;
}

.species-modal__narrative {
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.76rem;
  line-height: 1.5;
}

.species-modal__facts {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.species-modal__facts > div {
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
}

.species-modal__facts span {
  color: #d6a85f;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.species-modal__facts p {
  margin-top: 0.45rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.68rem;
  line-height: 1.42;
}

.species-modal__thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.9rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.species-modal__thumbs button {
  flex: 0 0 3.8rem;
  height: 2.7rem;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 0.7rem;
  opacity: 0.55;
}

.species-modal__thumbs button.is-active {
  border-color: #d6a85f;
  opacity: 1;
}

.species-modal__thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 900px) {
  .species-modal__shell {
    grid-template-columns: minmax(0, 1.85fr) minmax(16rem, 0.55fr);
    overflow: hidden;
  }

  .species-modal__visual {
    min-height: min(38rem, calc(100vh - 2rem));
  }

  .species-modal__visual img {
    max-height: calc(100vh - 2rem);
  }

  .species-modal__story {
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    padding: 2.1rem 1.15rem 1rem;
  }
}

.species-lightbox-enter-active,
.species-lightbox-leave-active {
  transition: opacity 220ms ease;
}

.species-lightbox-enter-active .species-modal__shell,
.species-lightbox-leave-active .species-modal__shell {
  transition: transform 280ms cubic-bezier(0.2, 0.75, 0.2, 1), opacity 220ms ease;
}

.species-lightbox-enter-from,
.species-lightbox-leave-to {
  opacity: 0;
}

.species-lightbox-enter-from .species-modal__shell {
  opacity: 0;
  transform: translateY(1rem) scale(0.975);
}

.species-lightbox-leave-to .species-modal__shell {
  opacity: 0;
  transform: translateY(0.5rem) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .species-lightbox-enter-active,
  .species-lightbox-leave-active,
  .species-lightbox-enter-active .species-modal__shell,
  .species-lightbox-leave-active .species-modal__shell {
    transition: none;
  }
}
</style>
