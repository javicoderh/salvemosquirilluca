<script setup lang="ts">
import SpeciesGallery from "./SpeciesGallery.vue";
import SpeciesCatalogue from "./SpeciesCatalogue.vue";
import { floraSpecies } from "../../content/quirilluca-territory";
</script>

<template>
  <div class="territory-species-view">
    <SpeciesGallery
      eyebrow="Herbario vivo"
      title="La paciencia verde"
      intro="En Quirilluca la flora administra el agua, afirma el suelo y transforma cada quebrada en refugio. Abre una ficha para recorrer todas las fotografías y descubrir la historia ecológica detrás de cada presencia."
      :items="floraSpecies"
      tone="flora"
    />
    <SpeciesCatalogue mode="flora" />
  </div>
</template>
