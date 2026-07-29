<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import FloraDisplay from "./FloraDisplay.vue";
import FaunaDisplay from "./FaunaDisplay.vue";
import GeographyDisplay from "./GeographyDisplay.vue";

type TerritorySection = "flora" | "fauna" | "geografia";

function useState<T>(initialValue: T) {
  const state = ref(initialValue);
  const setState = (nextValue: T) => {
    state.value = nextValue;
  };
  return [state, setState] as const;
}

const choices: Array<{
  id: TerritorySection;
  label: string;
  kicker: string;
  image: string;
  alt: string;
  component: Component;
}> = [
  {
    id: "flora",
    label: "Flora",
    kicker: "Bosque y matorral",
    image: "/assets/quirilluca/LSQ-11_flora_belloto_del_norte.jpg",
    alt: "Bosque de belloto del norte en Quirilluca",
    component: FloraDisplay
  },
  {
    id: "fauna",
    label: "Fauna",
    kicker: "Alas y escamas",
    image: "/assets/quirilluca/LSQ-05_fauna_piqueros_y_pichones_01.jpg",
    alt: "Colonia de piqueros comunes en los acantilados",
    component: FaunaDisplay
  },
  {
    id: "geografia",
    label: "Geografía",
    kicker: "Roca, agua y memoria",
    image: "/assets/quirilluca/OTR-02_paisaje_vista_aerea_acantilados.jpg",
    alt: "Vista aérea del sistema costero de Quirilluca",
    component: GeographyDisplay
  }
];

const [activeSection, setActiveSection] = useState<TerritorySection>("flora");
const activeChoice = computed(() => choices.find((choice) => choice.id === activeSection.value) ?? choices[0]);

function selectSection(section: TerritorySection) {
  setActiveSection(section);
  requestAnimationFrame(() => {
    document.querySelector("#territory-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
</script>

<template>
  <div class="quirilluca-explorer">
    <section class="quirilluca-intro">
      <div class="quirilluca-intro__image" aria-hidden="true">
        <img src="/assets/quirilluca/LSQ-01_paisaje_acantilados_portada.jpg" alt="" />
      </div>
      <div class="quirilluca-intro__veil"></div>
      <div class="quirilluca-intro__copy">
        <p class="quirilluca-intro__eyebrow">El territorio vivo</p>
        <h1>Quirilluca:<br /><em>la orilla que recuerda</em></h1>
        <div class="quirilluca-intro__text">
          <p>
            El océano escribe sobre la roca desde hace miles de años. Los acantilados guardan antiguos
            sedimentos marinos, mientras el bosque esclerófilo conserva el agua y alimenta las quebradas.
          </p>
          <p>
            Bellotos, piqueros, oficios del mar y memoria comunitaria entrelazan una historia viva. La ciencia
            revela sus vínculos; conocerlos y cuidarlos permite que Quirilluca continúe escribiéndola.
          </p>
        </div>
        <span class="quirilluca-intro__prompt">Elige una puerta para comenzar</span>
      </div>
    </section>

    <nav class="territory-choices" aria-label="Explorar el territorio">
      <button
        v-for="(choice, index) in choices"
        :key="choice.id"
        type="button"
        class="territory-choice focus-ring"
        :class="{ 'is-active': activeSection === choice.id }"
        :aria-pressed="activeSection === choice.id"
        @click="selectSection(choice.id)"
      >
        <img :src="choice.image" :alt="choice.alt" />
        <span class="territory-choice__veil"></span>
        <span class="territory-choice__index">0{{ index + 1 }}</span>
        <span class="territory-choice__copy">
          <small>{{ choice.kicker }}</small>
          <strong>{{ choice.label }}</strong>
          <span>Explorar <i aria-hidden="true">→</i></span>
        </span>
      </button>
    </nav>

    <div id="territory-content" class="territory-content">
      <Transition name="territory-swap" mode="out-in">
        <component :is="activeChoice.component" :key="activeChoice.id" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.quirilluca-explorer {
  position: relative;
}

.quirilluca-intro {
  position: relative;
  display: grid;
  min-height: clamp(25rem, 50vh, 30rem);
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 1.75rem;
  isolation: isolate;
}

.quirilluca-intro__image,
.quirilluca-intro__veil {
  position: absolute;
  inset: 0;
}

.quirilluca-intro__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.015);
}

.quirilluca-intro__veil {
  background:
    linear-gradient(180deg, rgba(7, 9, 6, 0.03) 42%, rgba(7, 9, 6, 0.78) 100%),
    linear-gradient(90deg, rgba(7, 9, 6, 0.38), transparent 68%);
}

.quirilluca-intro__copy {
  position: relative;
  z-index: 1;
  align-self: end;
  max-width: 46rem;
  padding: clamp(1.15rem, 3vw, 2.35rem);
}

.quirilluca-intro__eyebrow {
  color: #d6a85f;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.quirilluca-intro h1 {
  max-width: 12ch;
  margin-top: 0.6rem;
  color: white;
  font-size: clamp(2rem, 4.4vw, 3.65rem);
  font-weight: 900;
  line-height: 0.84;
  letter-spacing: -0.065em;
}

.quirilluca-intro h1 em {
  color: #d6a85f;
  font-family: Georgia, serif;
  font-size: 0.72em;
  font-weight: 400;
  letter-spacing: -0.04em;
}

.quirilluca-intro__text {
  display: grid;
  max-width: 40rem;
  gap: 0.35rem;
  margin-top: 0.95rem;
}

.quirilluca-intro__text p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.72rem;
  line-height: 1.48;
}

.quirilluca-intro__prompt {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.9rem;
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.quirilluca-intro__prompt::before {
  width: 2.8rem;
  height: 1px;
  content: "";
  background: #d6a85f;
}

.territory-choices {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.territory-choice {
  position: relative;
  min-height: 18rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 1.4rem;
  background: #0d110c;
  color: white;
  text-align: left;
  isolation: isolate;
}

.territory-choice::after {
  position: absolute;
  inset: 0;
  z-index: 3;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
  transition: border-color 240ms ease;
}

.territory-choice.is-active::after {
  border-color: #d6a85f;
}

.territory-choice > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1), filter 300ms ease;
}

.territory-choice__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 56%, rgba(6, 8, 5, 0.72) 100%);
}

.territory-choice__index {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 999px;
  background: rgba(7, 9, 6, 0.24);
  font-size: 0.6rem;
  font-weight: 800;
  backdrop-filter: blur(10px);
}

.territory-choice__copy {
  position: absolute;
  right: 0.9rem;
  bottom: 0.9rem;
  left: 0.9rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.territory-choice__copy small {
  color: rgba(214, 168, 95, 0.82);
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.territory-choice__copy strong {
  margin-top: 0.18rem;
  font-size: clamp(1.35rem, 3vw, 2.25rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.045em;
}

.territory-choice__copy > span {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-top: 0.4rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.territory-choice__copy i {
  color: #d6a85f;
  font-style: normal;
  transition: transform 200ms ease;
}

.territory-choice:hover > img {
  filter: saturate(1.08);
  transform: scale(1.045);
}

.territory-choice:hover .territory-choice__copy i {
  transform: translateX(0.25rem);
}

.territory-content {
  scroll-margin-top: 6rem;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
}

.territory-swap-enter-active,
.territory-swap-leave-active {
  transition: opacity 260ms ease, transform 260ms ease;
}

.territory-swap-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.territory-swap-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

@media (min-width: 760px) {
  .territory-choices {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .territory-choice {
    min-height: 23rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .territory-choice > img,
  .territory-choice__copy i,
  .territory-swap-enter-active,
  .territory-swap-leave-active {
    transition: none;
  }
}
</style>
