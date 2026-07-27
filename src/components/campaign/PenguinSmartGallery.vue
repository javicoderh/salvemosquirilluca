<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const images = [
  ["EDQ-01_paisaje_acantilados.jpg", "Acantilados de Quirilluca"],
  ["EDQ-02_fauna_piquero.jpg", "Piquero común"],
  ["EDQ-03_flora_quillay.jpg", "Quillay"],
  ["EDQ-04_flora_belloto_del_norte.jpg", "Belloto del norte"],
  ["EDQ-05_paisaje_geologia_cueva_costera.jpg", "Geología y cueva costera"],
  ["EDQ-06_fauna_lagartija_lemniscata.jpg", "Lagartija lemniscata"],
  ["EDQ-07_flora_capachito.jpg", "Capachito"],
  ["EDQ-08_fauna_aves_roquerio_marino.jpg", "Aves del roquerío marino"],
  ["EDQ-09_fungi_hongo_por_identificar.jpg", "Hongo del bosque costero"],
  ["EDQ-10_fauna_culebra_cola_larga.jpg", "Culebra de cola larga"],
  ["EDQ-11_flora_soldadito.jpg", "Soldadito"],
  ["EDQ-12_fungi_hongos_por_identificar.jpg", "Hongos de Quirilluca"],
  ["LSQ-01_paisaje_acantilados_portada.jpg", "Mar, bosque y acantilados"],
  ["LSQ-02_paisaje_playa_quirilluca.jpg", "Playa de Quirilluca"],
  ["LSQ-03_fauna_piquero_individual.jpg", "Piquero en los acantilados"],
  ["LSQ-05_fauna_piqueros_y_pichones_01.jpg", "Piquero y pichones"],
  ["LSQ-06_paisaje_acantilados_01.jpg", "Acantilados y océano"],
  ["LSQ-09_fauna_piquero_comun.jpg", "Piquero común"],
  ["LSQ-10_fauna_jote_cabeza_colorada_01.jpg", "Jote de cabeza colorada"],
  ["LSQ-11_flora_belloto_del_norte.jpg", "Bosque de belloto del norte"],
  ["LSQ-12_paisaje_acantilados_02.jpg", "Borde costero de Quirilluca"],
  ["LSQ-13_flora_matorral_esclerofilo_01.jpg", "Matorral esclerófilo"],
  ["LSQ-14_fauna_jote_cabeza_negra.jpg", "Jote de cabeza negra"],
  ["LSQ-15_paisaje_playa_quirilluca_02.jpg", "Playa y quebrada de Quirilluca"],
  ["LSQ-16_flora_matorral_esclerofilo_02.jpg", "Vegetación esclerófila costera"],
  ["LSQ-17_flora_chupalla_y_abejorro.jpg", "Chupalla y abejorro"],
  ["LSQ-18_fauna_piqueros_y_pichones_02.jpg", "Colonia de piqueros"],
  ["LSQ-19_fauna_piqueros_y_pichones_03.jpg", "Piqueros y pichones"],
  ["LSQ-20_fauna_jote_cabeza_colorada_02.jpg", "Jote sobre el territorio"],
  ["LSQ-21_flora_matorral_esclerofilo_03.jpg", "Matorral costero"],
  ["LSQ-22_fauna_lagarto_de_zapallar_01.jpg", "Lagarto de Zapallar"],
  ["LSQ-23_fauna_lagarto_de_zapallar_02.jpg", "Lagarto de Zapallar en su hábitat"],
  ["LSQ-24_fauna_churrete_costero.jpg", "Churrete costero"],
  ["LSQ-25_fauna_piqueros_y_pichones_04.jpg", "Zona de nidificación"],
  ["LSQ-26_flora_ananuca_de_la_gloria_01.jpg", "Añañuca de la gloria"],
  ["LSQ-27_flora_ananuca_de_la_gloria_02.jpg", "Floración de añañucas"],
  ["LSQ-28_flora_ananuca_de_la_gloria_03.jpg", "Añañucas en Quirilluca"],
  ["LSQ-29_fauna_piqueros_y_pichones_05.jpg", "Familia de piqueros"],
  ["OTR-02_paisaje_vista_aerea_acantilados.jpg", "Vista aérea de los acantilados"],
  ["OTR-03_paisaje_quebrada_playa_credito_salvemos_quirilluca_facebook.jpg", "Quebrada y playa de Quirilluca"]
].map(([file, name], index) => ({
  id: `quirilluca-${index}`,
  src: `/assets/quirilluca/${file}`,
  name
}));

const currentIndex = ref(0);
const modalOpen = ref(false);
let intervalId;
const visible = computed(() => [0, 1, 2, 3].map((offset) => images[(currentIndex.value + offset) % images.length]));
const current = computed(() => images[currentIndex.value]);

function next() { currentIndex.value = (currentIndex.value + 1) % images.length; }
function open(image) { currentIndex.value = images.findIndex((item) => item.id === image.id); modalOpen.value = true; }
function close() { modalOpen.value = false; }

onMounted(() => { intervalId = window.setInterval(next, 4200); });
onBeforeUnmount(() => window.clearInterval(intervalId));
</script>

<template>
  <div class="smart-gallery" aria-label="Archivo visual de Salvemos Quirilluca">
    <div class="smart-gallery__stage">
      <button v-for="(image, index) in visible" :key="image.id" type="button" class="smart-gallery__card" :class="`slot-${index + 1}`" @click="open(image)">
        <img :src="image.src" :alt="image.name" loading="lazy" />
        <span>{{ image.name }}</span>
      </button>
    </div>
    <div class="smart-gallery__controls">
      <button type="button" class="focus-ring" @click="next" aria-label="Siguiente imagen">Siguiente →</button>
    </div>
    <div v-if="modalOpen" class="smart-gallery__modal" role="dialog" aria-modal="true" @click.self="close">
      <button type="button" class="smart-gallery__close focus-ring" @click="close" aria-label="Cerrar imagen">×</button>
      <img :src="current.src" :alt="current.name" />
      <p>{{ current.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.smart-gallery { position: relative; min-height: 23rem; color: var(--campaign-text); }
.smart-gallery__stage { position: relative; min-height: 19rem; }
.smart-gallery__card { position: absolute; overflow: hidden; border: 1px solid rgba(215,192,155,.22); border-radius: 1.5rem; background: var(--campaign-surface); box-shadow: 0 20px 60px rgba(0,0,0,.35); transition: transform .45s ease, opacity .45s ease; }
.smart-gallery__card img { display: block; width: 100%; height: 100%; object-fit: cover; }
.smart-gallery__card span { position: absolute; left: .75rem; right: .75rem; bottom: .75rem; padding: .45rem .65rem; border-radius: .75rem; background: rgba(9,11,7,.78); font-size: .72rem; text-align: left; }
.slot-1 { inset: 0 22% 8% 0; z-index: 4; }
.slot-2 { inset: 12% 0 18% 42%; z-index: 3; transform: rotate(4deg); }
.slot-3 { inset: 32% 16% 0 30%; z-index: 2; transform: rotate(-3deg); }
.slot-4 { inset: 4% 42% 35% 12%; z-index: 1; opacity: .55; transform: rotate(-7deg); }
.smart-gallery__controls { display: flex; justify-content: flex-end; align-items: center; margin-top: .75rem; font-size: .75rem; color: var(--campaign-text-muted); }
.smart-gallery__controls button { color: var(--campaign-warm); font-weight: 700; }
.smart-gallery__modal { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; gap: 1rem; padding: 2rem; background: rgba(0,0,0,.88); }
.smart-gallery__modal img { max-width: min(92vw, 1100px); max-height: 78vh; border-radius: 1.5rem; object-fit: contain; }
.smart-gallery__modal p { color: white; font-size: 1rem; }
.smart-gallery__close { position: absolute; top: 1.5rem; right: 1.5rem; width: 3rem; height: 3rem; border: 1px solid rgba(255,255,255,.35); border-radius: 999px; color: white; font-size: 2rem; }
</style>
