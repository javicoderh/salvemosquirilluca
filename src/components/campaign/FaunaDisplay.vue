<script setup lang="ts">
import SpeciesGallery from "./SpeciesGallery.vue";
import SpeciesCatalogue from "./SpeciesCatalogue.vue";
import { faunaSpecies } from "../../content/quirilluca-territory";
</script>

<template>
  <div class="territory-species-view">
    <SpeciesGallery
      eyebrow="Bestiario costero"
      title="Vidas entre mar y roca"
      intro="Alas, escamas y huellas enlazan el océano con el matorral. Esta galería abre el recorrido con especies protagonistas; el bestiario documentado continúa más abajo con aves, mamíferos y reptiles."
      :items="faunaSpecies"
      tone="fauna"
    />
    <SpeciesCatalogue mode="fauna" />
  </div>
</template>
