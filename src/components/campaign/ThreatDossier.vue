<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  dossierSources,
  evidenceImages,
  impactChapters,
  landUseLayers,
  legalIssues,
  legalMilestones,
  projectMetrics
} from "../../content/maratue-dossier";

function useState<T>(initialValue: T) {
  const state = ref(initialValue);
  const setState = (value: T) => {
    state.value = value;
  };
  return [state, setState] as const;
}

const [activeLandUse, setActiveLandUse] = useState(landUseLayers[0].id);
const [activeImpact, setActiveImpact] = useState(impactChapters[0].id);
const [activeMilestone, setActiveMilestone] = useState(
  legalMilestones[legalMilestones.length - 1].id
);
const [activeIssue, setActiveIssue] = useState(legalIssues[0].id);
const comparisonPosition = ref(52);
const comparisonStage = ref<HTMLElement | null>(null);
const isComparing = ref(false);
const activeSection = ref("radiografia");
let observer: IntersectionObserver | null = null;

const selectedLandUse = computed(
  () => landUseLayers.find((item) => item.id === activeLandUse.value) ?? landUseLayers[0]
);
const selectedImpact = computed(
  () => impactChapters.find((item) => item.id === activeImpact.value) ?? impactChapters[0]
);
const selectedMilestone = computed(
  () => legalMilestones.find((item) => item.id === activeMilestone.value) ?? legalMilestones[0]
);
const selectedIssue = computed(
  () => legalIssues.find((item) => item.id === activeIssue.value) ?? legalIssues[0]
);

const navigation = [
  {
    id: "radiografia",
    number: "01",
    label: "Radiografía territorial",
    description: "Compara el paisaje con el escenario proyectado."
  },
  {
    id: "anatomia",
    number: "02",
    label: "Anatomía del plan",
    description: "Lee cómo se distribuiría la superficie urbana."
  },
  {
    id: "huella",
    number: "03",
    label: "Huella física",
    description: "Sigue la transformación material del territorio."
  },
  {
    id: "imagenes",
    number: "04",
    label: "Imágenes del proyecto",
    description: "Contrasta promesa visual y obligación documental."
  },
  {
    id: "expediente",
    number: "05",
    label: "Batalla jurídica",
    description: "Recorre nueve años de decisiones y reclamaciones."
  },
  {
    id: "disputa",
    number: "06",
    label: "Materias en disputa",
    description: "Examina los argumentos enfrentados."
  },
  {
    id: "fuentes",
    number: "07",
    label: "Sala de documentos",
    description: "Abre la evidencia en sus fuentes de origen."
  }
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateComparison(clientX: number) {
  const bounds = comparisonStage.value?.getBoundingClientRect();
  if (!bounds) return;
  const position = ((clientX - bounds.left) / bounds.width) * 100;
  comparisonPosition.value = Math.min(92, Math.max(8, Math.round(position * 10) / 10));
}

function startComparison(event: PointerEvent) {
  isComparing.value = true;
  comparisonStage.value?.setPointerCapture?.(event.pointerId);
  updateComparison(event.clientX);
}

function moveComparison(event: PointerEvent) {
  if (isComparing.value) updateComparison(event.clientX);
}

function stopComparison(event: PointerEvent) {
  isComparing.value = false;
  if (comparisonStage.value?.hasPointerCapture?.(event.pointerId)) {
    comparisonStage.value.releasePointerCapture(event.pointerId);
  }
}

function nudgeComparison(direction: number) {
  comparisonPosition.value = Math.min(92, Math.max(8, comparisonPosition.value + direction));
}

function handleComparisonKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") nudgeComparison(-2);
  else if (event.key === "ArrowRight") nudgeComparison(2);
  else if (event.key === "Home") comparisonPosition.value = 8;
  else if (event.key === "End") comparisonPosition.value = 92;
  else return;
  event.preventDefault();
}

function statusLabel(status: string) {
  if (status === "citizen") return "Acción ciudadana";
  if (status === "authority") return "Decisión administrativa";
  if (status === "court") return "Control judicial";
  return "Proceso actual";
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) activeSection.value = visible.target.id;
    },
    { rootMargin: "-28% 0px -58% 0px", threshold: [0.05, 0.25, 0.55] }
  );

  navigation.forEach(({ id }) => {
    const element = document.getElementById(id);
    if (element) observer?.observe(element);
  });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="threat-dossier">
    <section class="threat-hero">
      <img
        class="threat-hero__land"
        src="/assets/quirilluca/OTR-02_paisaje_vista_aerea_acantilados.jpg"
        alt="Vista aérea de los Acantilados de Quirilluca"
      />
      <div class="threat-hero__grid" aria-hidden="true"></div>
      <div class="threat-hero__scan" aria-hidden="true"></div>

      <div class="threat-hero__content">
        <div class="threat-hero__stamp">
          <span>Expediente territorial</span>
          <strong>MARATUÉ / 2017—2026</strong>
        </div>

        <p class="threat-hero__eyebrow">La amenaza</p>
        <h1>Una ciudad podría levantarse<br /><em>sobre un territorio vivo</em></h1>
        <p class="threat-hero__lead">
          De consolidarse su aprobación y ejecutarse como fue concebido, Maratué convertiría el ex
          Fundo Quirilluca en cifras, polígonos y vialidades. Detrás de cada línea del plano
          permanecerían suelo, agua, bosque y memoria. Las 14.180 viviendas previstas durante 45
          años implicarían una transformación territorial cuya evaluación reconoce impactos
          significativos sobre el bosque esclerófilo y el hábitat de fauna terrestre. Esta es la
          escala de lo que podría ocurrir y la historia jurídica de una comunidad que sigue
          examinándola.
        </p>

        <div class="threat-hero__metrics">
          <article v-for="metric in projectMetrics" :key="metric.label">
            <strong>{{ metric.value }}</strong>
            <span>{{ metric.label }}</span>
            <small>{{ metric.note }}</small>
          </article>
        </div>

        <div class="threat-hero__status">
          <span class="threat-hero__pulse" aria-hidden="true"></span>
          <p>
            <strong>Estado verificado · 29 julio 2026</strong>
            RCA favorable con condiciones. Dos reclamaciones judiciales fueron ingresadas en junio.
          </p>
          <a :href="dossierSources.judicial2026" target="_blank" rel="noreferrer">
            Ver último registro público ↗
          </a>
        </div>
      </div>
    </section>

    <nav class="dossier-index" aria-labelledby="dossier-index-title">
      <header class="dossier-index__header">
        <div>
          <p>Índice interactivo / EXP–MQ26</p>
          <h2 id="dossier-index-title">El territorio,<br /><em>capítulo por capítulo.</em></h2>
        </div>
      </header>
      <div class="dossier-index__chapters">
        <button
          v-for="item in navigation"
          :key="item.id"
          type="button"
          class="focus-ring"
          :class="{ 'is-active': activeSection === item.id }"
          @click="scrollToSection(item.id)"
        >
          <span>{{ item.number }}</span>
          <div>
            <strong>{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </div>
          <i aria-hidden="true">↘</i>
        </button>
      </div>
    </nav>

    <section id="radiografia" class="dossier-section dossier-section--scanner">
      <header class="dossier-heading">
        <div>
          <p>01 / Radiografía territorial</p>
          <h2>Dos imágenes.<br />Una transformación.</h2>
        </div>
        <p>
          El paisaje actual y la visualización difundida por el proyecto expresan dos estados
          distintos. Arrastra la línea central sobre la imagen para leer el contraste entre
          continuidad natural y ocupación urbana proyectada.
        </p>
      </header>

      <div class="territory-compare">
        <div
          ref="comparisonStage"
          class="territory-compare__stage"
          :class="{ 'is-dragging': isComparing }"
          @pointerdown="startComparison"
          @pointermove="moveComparison"
          @pointerup="stopComparison"
          @pointercancel="stopComparison"
        >
          <img
            class="territory-compare__base"
            src="/assets/quirilluca/OTR-02_paisaje_vista_aerea_acantilados.jpg"
            alt="Vista aérea actual de los Acantilados de Quirilluca"
          />
          <div
            class="territory-compare__project"
            :style="{ width: `${comparisonPosition}%` }"
          >
            <img
              src="/assets/quirilluca/LSQ-04_proyecto_masterplan_01.jpg"
              alt="Visualización conceptual difundida por el proyecto Maratué"
            />
          </div>
          <button
            type="button"
            class="territory-compare__divider"
            :style="{ left: `${comparisonPosition}%` }"
            role="slider"
            aria-valuemin="8"
            aria-valuemax="92"
            :aria-valuenow="Math.round(comparisonPosition)"
            aria-label="Arrastrar para comparar el territorio y el escenario proyectado"
            @keydown="handleComparisonKeydown"
          >
            <span>↔</span>
          </button>
          <span class="territory-compare__label territory-compare__label--project">
            Proyecto / imagen conceptual
          </span>
          <span class="territory-compare__label territory-compare__label--land">
            Territorio / registro aéreo
          </span>
        </div>

        <label class="territory-compare__control">
          <span>Territorio</span>
          <input
            v-model.number="comparisonPosition"
            type="range"
            min="8"
            max="92"
            aria-label="Comparar territorio actual con visualización del proyecto"
          />
          <span>Proyecto</span>
        </label>

        <div class="territory-compare__note">
          <span>Lectura responsable</span>
          <p>
            Las imágenes tienen encuadres diferentes. El paralelo comunica el cambio de escala y
            uso; constituye una comparación editorial, no una simulación exacta del resultado final.
          </p>
          <a :href="dossierSources.masterplan" target="_blank" rel="noreferrer">
            Origen de la visualización ↗
          </a>
        </div>
      </div>
    </section>

    <section id="anatomia" class="dossier-section land-ledger">
      <header class="dossier-heading dossier-heading--compact">
        <div>
          <p>02 / Anatomía del plan</p>
          <h2>1.014 hectáreas urbanas,<br />distribuidas por función.</h2>
        </div>
        <p>
          El predio completo comprende 1.045 hectáreas: 1.014 urbanas y 31 rurales. El proyecto
          declara que sus obras se concentran en la superficie urbana.
        </p>
      </header>

      <div class="land-ledger__layout">
        <div class="land-ledger__plan">
          <img
            src="/assets/quirilluca/LSQ-07_proyecto_masterplan_02.jpg"
            alt="Plan maestro conceptual del proyecto Maratué"
          />
          <div class="land-ledger__plan-grid" aria-hidden="true"></div>
          <span>Plano conceptual del proponente</span>
        </div>

        <div class="land-ledger__data">
          <div class="land-ledger__bar" aria-label="Distribución de la superficie urbana">
            <button
              v-for="layer in landUseLayers"
              :key="layer.id"
              type="button"
              class="focus-ring"
              :class="{ 'is-active': activeLandUse === layer.id }"
              :style="{ flexGrow: layer.value, '--segment': layer.color }"
              :aria-label="`${layer.label}: ${layer.value} hectáreas`"
              @click="setActiveLandUse(layer.id)"
            >
              <span>{{ layer.percentage }}</span>
            </button>
          </div>

          <div class="land-ledger__keys">
            <button
              v-for="layer in landUseLayers"
              :key="layer.id"
              type="button"
              class="focus-ring"
              :class="{ 'is-active': activeLandUse === layer.id }"
              @click="setActiveLandUse(layer.id)"
            >
              <i :style="{ background: layer.color }"></i>
              <span>{{ layer.label }}</span>
              <strong>{{ layer.value }} {{ layer.unit }}</strong>
            </button>
          </div>

          <Transition name="dossier-detail" mode="out-in">
            <article :key="selectedLandUse.id" class="land-ledger__detail">
              <span>{{ selectedLandUse.percentage }} de la superficie urbana</span>
              <h3>{{ selectedLandUse.title }}</h3>
              <p>{{ selectedLandUse.description }}</p>
              <div>
                <small>Lectura física</small>
                <p>{{ selectedLandUse.physicalReading }}</p>
              </div>
              <a :href="dossierSources.ice" target="_blank" rel="noreferrer">
                Ver distribución en el ICE oficial ↗
              </a>
            </article>
          </Transition>
        </div>
      </div>
    </section>

    <section id="huella" class="dossier-section impact-chain">
      <header class="dossier-heading">
        <div>
          <p>03 / Huella física</p>
          <h2>Del plano<br />al territorio.</h2>
        </div>
        <p>
          Una urbanización de esta escala funciona como una secuencia material. Cada acción modifica
          condiciones que sostienen la siguiente.
        </p>
      </header>

      <div class="impact-chain__layout">
        <div class="impact-chain__visual">
          <Transition name="impact-image" mode="out-in">
            <img
              :key="selectedImpact.id"
              :src="selectedImpact.image"
              :alt="selectedImpact.alt"
            />
          </Transition>
          <div class="impact-chain__visual-grid" aria-hidden="true"></div>
          <span>{{ selectedImpact.number }} / {{ selectedImpact.title }}</span>
        </div>

        <div class="impact-chain__steps">
          <article
            v-for="chapter in impactChapters"
            :key="chapter.id"
            class="impact-step"
            :class="{ 'is-active': activeImpact === chapter.id }"
          >
            <button
              type="button"
              class="impact-step__trigger focus-ring"
              :aria-expanded="activeImpact === chapter.id"
              @click="setActiveImpact(chapter.id)"
            >
              <span class="impact-step__number">{{ chapter.number }}</span>
              <span class="impact-step__copy">
                <small>{{ chapter.action }}</small>
                <strong>{{ chapter.title }}</strong>
                <em>{{ chapter.consequence }}</em>
              </span>
            </button>
            <span v-if="activeImpact === chapter.id" class="impact-step__evidence">
              {{ chapter.evidence }}
              <a :href="chapter.sourceUrl" target="_blank" rel="noreferrer">
                {{ chapter.sourceLabel }} ↗
              </a>
            </span>
          </article>
        </div>
      </div>

      <div class="impact-chain__recognized">
        <span>Impactos significativos reconocidos por la evaluación</span>
        <strong>C-FLORA3</strong>
        <p>Alteración de las comunidades florísticas del bosque esclerófilo.</p>
        <strong>C-FAUNA3</strong>
        <p>Pérdida de hábitat de fauna terrestre.</p>
        <a :href="dossierSources.ice" target="_blank" rel="noreferrer">Abrir evidencia oficial ↗</a>
      </div>
    </section>

    <section id="imagenes" class="dossier-section evidence-wall">
      <header class="dossier-heading dossier-heading--compact">
        <div>
          <p>04 / Imágenes del proyecto</p>
          <h2>Promesa visual.<br />Obligación documental.</h2>
        </div>
        <p>
          Los renders y planos cuentan cómo el proponente imagina Maratué. El expediente ambiental
          establece aquello que puede fiscalizarse.
        </p>
      </header>

      <div class="evidence-wall__grid">
        <article
          v-for="(item, index) in evidenceImages"
          :key="item.image"
          :class="`evidence-card evidence-card--${index + 1}`"
        >
          <img :src="item.image" :alt="item.title" loading="lazy" />
          <div class="evidence-card__veil"></div>
          <span>{{ item.label }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
            <a :href="item.sourceUrl" target="_blank" rel="noreferrer">Ver publicación de origen ↗</a>
          </div>
        </article>
      </div>
    </section>

    <section id="expediente" class="dossier-section legal-dossier">
      <header class="dossier-heading">
        <div>
          <p>05 / Batalla jurídica</p>
          <h2>Nueve años<br />dentro del expediente.</h2>
        </div>
        <p>
          La historia avanza mediante observaciones ciudadanas, decisiones administrativas y control
          judicial. Selecciona un hito para leer qué ocurrió y cuál fue su efecto real.
        </p>
      </header>

      <div class="legal-dossier__layout">
        <div class="legal-timeline" aria-label="Cronología jurídica de Maratué">
          <button
            v-for="milestone in legalMilestones"
            :key="milestone.id"
            type="button"
            class="legal-timeline__item focus-ring"
            :class="[
              `legal-timeline__item--${milestone.status}`,
              { 'is-active': activeMilestone === milestone.id }
            ]"
            @click="setActiveMilestone(milestone.id)"
          >
            <span>{{ milestone.year }}</span>
            <i aria-hidden="true"></i>
            <strong>{{ milestone.title }}</strong>
          </button>
        </div>

        <Transition name="dossier-detail" mode="out-in">
          <article :key="selectedMilestone.id" class="legal-file">
            <div class="legal-file__top">
              <span>EXP / {{ selectedMilestone.year }}</span>
              <em>{{ statusLabel(selectedMilestone.status) }}</em>
            </div>
            <p class="legal-file__date">{{ selectedMilestone.date }} · {{ selectedMilestone.phase }}</p>
            <h3>{{ selectedMilestone.title }}</h3>
            <p class="legal-file__summary">{{ selectedMilestone.summary }}</p>
            <div class="legal-file__result">
              <span>Efecto procesal</span>
              <p>{{ selectedMilestone.result }}</p>
            </div>
            <a :href="selectedMilestone.sourceUrl" target="_blank" rel="noreferrer">
              {{ selectedMilestone.sourceLabel }} ↗
            </a>
          </article>
        </Transition>
      </div>

      <div class="legal-dossier__current">
        <span>Situación actual</span>
        <strong>La RCA está vigente. La discusión judicial sigue abierta.</strong>
        <p>
          Las reclamaciones ingresadas en junio buscan revisar la legalidad de la evaluación y
          obtener la anulación de la aprobación ambiental. Una reclamación presentada constituye una
          acción en curso; su resultado corresponde al Tribunal.
        </p>
      </div>
    </section>

    <section id="disputa" class="dossier-section disputed-issues">
      <header class="dossier-heading dossier-heading--compact">
        <div>
          <p>06 / Materias en disputa</p>
          <h2>Cuatro preguntas<br />que sostienen la causa.</h2>
        </div>
        <p>
          El Acuerdo 9/2026 ordena el debate en cuatro componentes. Aquí se muestran lado a lado la
          posición reclamada y la respuesta administrativa.
        </p>
      </header>

      <div class="disputed-issues__tabs" role="tablist" aria-label="Materias jurídicas">
        <button
          v-for="issue in legalIssues"
          :key="issue.id"
          type="button"
          role="tab"
          class="focus-ring"
          :aria-selected="activeIssue === issue.id"
          :class="{ 'is-active': activeIssue === issue.id }"
          @click="setActiveIssue(issue.id)"
        >
          <span>{{ issue.article }}</span>
          <strong>{{ issue.title }}</strong>
        </button>
      </div>

      <Transition name="dossier-detail" mode="out-in">
        <div :key="selectedIssue.id" class="disputed-issues__panel">
          <article>
            <span>Lo que reclama la ciudadanía</span>
            <p>{{ selectedIssue.citizenPosition }}</p>
          </article>
          <article>
            <span>Lo que resolvió la autoridad</span>
            <p>{{ selectedIssue.authorityPosition }}</p>
          </article>
          <div>
            <span>Huella verificable en el expediente</span>
            <p>{{ selectedIssue.trace }}</p>
            <a :href="selectedIssue.sourceUrl" target="_blank" rel="noreferrer">
              Revisar documento completo ↗
            </a>
          </div>
        </div>
      </Transition>
    </section>

    <section id="fuentes" class="dossier-section source-room">
      <div class="source-room__intro">
        <p>07 / Sala de documentos</p>
        <h2>La evidencia también se abre.</h2>
        <span>
          Cada cifra y cada estado procesal puede revisarse en su documento de origen. Las fechas
          corresponden a la última actualización editorial del 29 de julio de 2026.
        </span>
      </div>

      <div class="source-room__files">
        <a :href="dossierSources.expediente" target="_blank" rel="noreferrer">
          <span>SEA / Expediente completo</span>
          <strong>Evaluación ambiental de Maratué</strong>
          <em>2017—2026 ↗</em>
        </a>
        <a :href="dossierSources.ice" target="_blank" rel="noreferrer">
          <span>SEA / Informe técnico</span>
          <strong>Informe Consolidado de Evaluación</strong>
          <em>438 páginas ↗</em>
        </a>
        <a :href="dossierSources.acuerdo2026" target="_blank" rel="noreferrer">
          <span>Comité de Ministros</span>
          <strong>Acuerdo N°9/2026</strong>
          <em>102 páginas ↗</em>
        </a>
        <a :href="dossierSources.tribunal2022" target="_blank" rel="noreferrer">
          <span>Segundo Tribunal Ambiental</span>
          <strong>Causas R-310 y R-311</strong>
          <em>Sentencia y expediente ↗</em>
        </a>
        <a :href="dossierSources.corte2023" target="_blank" rel="noreferrer">
          <span>Corte Suprema</span>
          <strong>Rol N°3.363-2023</strong>
          <em>Resolución ↗</em>
        </a>
        <a :href="dossierSources.judicial2026" target="_blank" rel="noreferrer">
          <span>Estado público reciente</span>
          <strong>Reclamaciones de junio de 2026</strong>
          <em>Seguimiento periodístico ↗</em>
        </a>
      </div>
    </section>

    <section class="threat-closing">
      <img
        src="/assets/quirilluca/LSQ-06_paisaje_acantilados_01.jpg"
        alt="Acantilados y bosque de Quirilluca"
        loading="lazy"
      />
      <div></div>
      <article>
        <p>El expediente sigue abierto</p>
        <h2>Defender también es<br /><em>leer el territorio.</em></h2>
        <span>
          Comparte la evidencia, revisa los documentos y fortalece una defensa ciudadana construida
          con memoria, ciencia y acción jurídica.
        </span>
        <div>
          <a href="/sumate#firma">Sumar mi firma</a>
          <a href="/participa">Formas de participar</a>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.threat-dossier {
  --threat-red: #e15b43;
  --threat-orange: #ee9a55;
  --threat-paper: #e8e0d3;
  --threat-muted: #a9aaa4;
  --threat-line: rgba(255, 255, 255, 0.14);
  position: relative;
  color: var(--threat-paper);
}

.threat-hero {
  position: relative;
  min-height: min(48rem, 82vh);
  overflow: hidden;
  border: 1px solid rgba(225, 91, 67, 0.34);
  border-radius: 0.35rem;
  background: #090a09;
  isolation: isolate;
}

.threat-hero__land,
.threat-hero__grid,
.threat-hero__scan {
  position: absolute;
  inset: 0;
}

.threat-hero__land {
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.75) contrast(1.12) brightness(0.62);
}

.threat-hero::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: "";
  background:
    linear-gradient(90deg, rgba(7, 8, 7, 0.96) 0%, rgba(7, 8, 7, 0.77) 51%, rgba(7, 8, 7, 0.38)),
    linear-gradient(0deg, rgba(7, 8, 7, 0.92), transparent 50%);
}

.threat-hero__grid,
.land-ledger__plan-grid,
.impact-chain__visual-grid {
  z-index: 1;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(225, 91, 67, 0.42) 1px, transparent 1px),
    linear-gradient(90deg, rgba(225, 91, 67, 0.42) 1px, transparent 1px);
  background-size: 3.2rem 3.2rem;
  mask-image: linear-gradient(90deg, black, transparent 80%);
}

.threat-hero__scan {
  z-index: 2;
  width: 1px;
  background: var(--threat-red);
  box-shadow: 0 0 2rem rgba(225, 91, 67, 0.75);
  animation: territorial-scan 8s ease-in-out infinite alternate;
}

@keyframes territorial-scan {
  from { transform: translateX(4vw); }
  to { transform: translateX(82vw); }
}

.threat-hero__content {
  position: relative;
  z-index: 3;
  display: flex;
  min-height: inherit;
  padding: clamp(1.2rem, 4vw, 3.5rem);
  flex-direction: column;
  justify-content: flex-end;
}

.threat-hero__stamp {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: grid;
  gap: 0.2rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(225, 91, 67, 0.6);
  color: rgba(255, 255, 255, 0.7);
  font-family: "Courier New", monospace;
  font-size: 0.57rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: rotate(1.5deg);
}

.threat-hero__stamp strong {
  color: var(--threat-red);
  font-size: 0.66rem;
}

.threat-hero__eyebrow,
.dossier-heading > div > p,
.source-room__intro > p,
.threat-closing article > p {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.threat-hero h1 {
  max-width: 12ch;
  margin-top: 0.65rem;
  color: white;
  font-size: clamp(2.8rem, 7vw, 6.8rem);
  font-weight: 900;
  line-height: 0.83;
  letter-spacing: -0.07em;
}

.threat-hero h1 em,
.threat-closing h2 em {
  color: var(--threat-red);
  font-family: Georgia, serif;
  font-size: 0.76em;
  font-weight: 400;
}

.threat-hero__lead {
  max-width: 46rem;
  margin-top: 1.2rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(0.82rem, 1.25vw, 0.98rem);
  line-height: 1.65;
}

.threat-hero__metrics {
  display: grid;
  gap: 1px;
  margin-top: 1.35rem;
  background: var(--threat-line);
}

.threat-hero__metrics article {
  display: grid;
  min-width: 0;
  padding: 0.75rem;
  background: rgba(8, 9, 8, 0.72);
  backdrop-filter: blur(10px);
}

.threat-hero__metrics strong {
  color: white;
  font-size: clamp(1.45rem, 3vw, 2.4rem);
  line-height: 1;
  letter-spacing: -0.045em;
}

.threat-hero__metrics span {
  margin-top: 0.25rem;
  color: var(--threat-red);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.threat-hero__metrics small {
  margin-top: 0.35rem;
  color: var(--threat-muted);
  font-size: 0.6rem;
  line-height: 1.3;
}

.threat-hero__status {
  display: grid;
  gap: 0.7rem;
  align-items: center;
  margin-top: 1px;
  padding: 0.75rem;
  background: rgba(225, 91, 67, 0.13);
  font-size: 0.66rem;
}

.threat-hero__status p {
  display: grid;
  color: var(--threat-muted);
  line-height: 1.45;
}

.threat-hero__status strong {
  color: white;
}

.threat-hero__status a,
.territory-compare__note a,
.land-ledger__detail > a,
.legal-file > a,
.impact-chain__recognized a {
  color: var(--threat-red);
  font-weight: 800;
  text-decoration: none;
}

.threat-hero__pulse {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--threat-red);
  box-shadow: 0 0 0 0 rgba(225, 91, 67, 0.7);
  animation: dossier-pulse 1.8s infinite;
}

@keyframes dossier-pulse {
  70% { box-shadow: 0 0 0 0.7rem rgba(225, 91, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(225, 91, 67, 0); }
}

.dossier-index {
  position: relative;
  margin-top: 0.55rem;
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  border: 1px solid var(--threat-line);
  background:
    linear-gradient(rgba(225, 91, 67, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(225, 91, 67, 0.045) 1px, transparent 1px),
    #0a0b0a;
  background-size: 2.2rem 2.2rem;
}

.dossier-index::after {
  position: absolute;
  top: -6rem;
  right: -5rem;
  width: 16rem;
  height: 16rem;
  border: 1px solid rgba(225, 91, 67, 0.22);
  border-radius: 50%;
  content: "";
  box-shadow:
    0 0 0 2.8rem rgba(225, 91, 67, 0.025),
    0 0 0 5.6rem rgba(225, 91, 67, 0.018);
  pointer-events: none;
}

.dossier-index__header {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
  margin-bottom: 1.3rem;
  align-items: end;
}

.dossier-index__header p {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dossier-index__header h2 {
  max-width: 15ch;
  margin-top: 0.55rem;
  color: white;
  font-size: clamp(1.9rem, 4vw, 3.5rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.dossier-index__header h2 em {
  color: var(--threat-red);
  font-family: Georgia, serif;
  font-size: 0.8em;
  font-weight: 400;
}

.dossier-index__header > span {
  max-width: 31rem;
  color: var(--threat-muted);
  font-size: 0.74rem;
  line-height: 1.6;
}

.dossier-index__chapters {
  position: relative;
  z-index: 1;
  display: grid;
  grid-auto-columns: minmax(14rem, 82vw);
  grid-auto-flow: column;
  gap: 1px;
  overflow-x: auto;
  background: var(--threat-line);
  scroll-snap-type: x mandatory;
}

.dossier-index__chapters button {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.8rem;
  min-height: 6.5rem;
  padding: 0.9rem;
  align-items: start;
  overflow: hidden;
  background: rgba(12, 13, 12, 0.96);
  color: var(--threat-muted);
  text-align: left;
  scroll-snap-align: start;
  transition:
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.dossier-index__chapters button::before {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  content: "";
  background: var(--threat-red);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms ease;
}

.dossier-index__chapters button:hover,
.dossier-index__chapters button.is-active {
  background: rgba(225, 91, 67, 0.1);
  color: white;
}

.dossier-index__chapters button:hover::before,
.dossier-index__chapters button.is-active::before {
  transform: scaleX(1);
}

.dossier-index__chapters button > span {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.62rem;
  font-weight: 800;
}

.dossier-index__chapters button > div {
  display: grid;
  gap: 0.35rem;
}

.dossier-index__chapters strong {
  color: white;
  font-size: 0.78rem;
}

.dossier-index__chapters small {
  max-width: 25ch;
  font-family: Georgia, serif;
  font-size: 0.65rem;
  line-height: 1.4;
}

.dossier-index__chapters i {
  color: var(--threat-red);
  font-size: 0.8rem;
  font-style: normal;
  transition: transform 180ms ease;
}

.dossier-index__chapters button:hover i {
  transform: translate(0.18rem, 0.18rem);
}

.dossier-section {
  scroll-margin-top: 8rem;
  padding-top: clamp(4rem, 9vw, 8rem);
}

.dossier-heading {
  display: grid;
  gap: 1.4rem;
  align-items: end;
  margin-bottom: 1.5rem;
}

.dossier-heading h2,
.source-room__intro h2,
.threat-closing h2 {
  max-width: 13ch;
  margin-top: 0.5rem;
  color: white;
  font-size: clamp(2.25rem, 5.4vw, 4.8rem);
  line-height: 0.91;
  letter-spacing: -0.06em;
}

.dossier-heading > p {
  max-width: 38rem;
  color: var(--threat-muted);
  font-size: 0.86rem;
  line-height: 1.65;
}

.territory-compare {
  border: 1px solid var(--threat-line);
  background: #0a0b0a;
}

.territory-compare__stage {
  position: relative;
  min-height: clamp(22rem, 58vw, 43rem);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: none;
  user-select: none;
}

.territory-compare__stage.is-dragging {
  cursor: grabbing;
}

.territory-compare__stage img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.territory-compare__base {
  filter: saturate(0.78) contrast(1.05);
}

.territory-compare__project {
  position: absolute;
  z-index: 2;
  inset: 0 auto 0 0;
  overflow: hidden;
  border-right: 1px solid var(--threat-red);
}

.territory-compare__project img {
  width: calc(100vw - 2.5rem);
  max-width: 80rem;
  filter: saturate(0.82) contrast(1.06);
}

.territory-compare__divider {
  position: absolute;
  z-index: 4;
  top: 0;
  bottom: 0;
  padding: 0;
  border: 0;
  width: 1px;
  background: transparent;
  color: inherit;
  cursor: ew-resize;
  touch-action: none;
}

.territory-compare__divider span {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 2.8rem;
  height: 2.8rem;
  place-items: center;
  border: 1px solid var(--threat-red);
  border-radius: 50%;
  background: #0a0b0a;
  color: white;
  transform: translate(-50%, -50%);
  transition:
    width 160ms ease,
    height 160ms ease,
    background 160ms ease;
}

.territory-compare__divider::after {
  position: absolute;
  top: calc(50% + 2rem);
  left: 50%;
  padding: 0.26rem 0.4rem;
  content: "Arrastra";
  border: 1px solid rgba(225, 91, 67, 0.42);
  background: rgba(10, 11, 10, 0.88);
  color: white;
  font-family: "Courier New", monospace;
  font-size: 0.48rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: translateX(-50%);
}

.territory-compare__divider:hover span,
.territory-compare__divider:focus-visible span,
.territory-compare__stage.is-dragging .territory-compare__divider span {
  width: 3.25rem;
  height: 3.25rem;
  background: var(--threat-red);
  outline: 2px solid rgba(255, 255, 255, 0.72);
  outline-offset: 3px;
}

.territory-compare__label {
  position: absolute;
  z-index: 5;
  top: 0.8rem;
  padding: 0.42rem 0.55rem;
  background: rgba(8, 9, 8, 0.84);
  color: white;
  font-family: "Courier New", monospace;
  font-size: 0.57rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.territory-compare__label--project { left: 0.8rem; }
.territory-compare__label--land { right: 0.8rem; }

.territory-compare__control {
  display: grid;
  grid-template-columns: auto minmax(8rem, 1fr) auto;
  gap: 0.8rem;
  padding: 0.85rem;
  align-items: center;
  border-top: 1px solid var(--threat-line);
  color: var(--threat-muted);
  font-family: "Courier New", monospace;
  font-size: 0.58rem;
  text-transform: uppercase;
}

.territory-compare__control input {
  width: 100%;
  accent-color: var(--threat-red);
}

.territory-compare__note {
  display: grid;
  gap: 0.6rem;
  padding: 0.9rem;
  border-top: 1px solid var(--threat-line);
  color: var(--threat-muted);
  font-size: 0.67rem;
  line-height: 1.5;
}

.territory-compare__note > span {
  color: var(--threat-orange);
  font-family: "Courier New", monospace;
  font-weight: 800;
  text-transform: uppercase;
}

.land-ledger__layout,
.impact-chain__layout,
.legal-dossier__layout {
  display: grid;
  gap: 0.75rem;
}

.land-ledger__plan {
  position: relative;
  min-height: 27rem;
  overflow: hidden;
  border: 1px solid var(--threat-line);
  background: #dad9d2;
}

.land-ledger__plan > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.land-ledger__plan-grid,
.impact-chain__visual-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.land-ledger__plan > span,
.impact-chain__visual > span {
  position: absolute;
  z-index: 2;
  bottom: 0.75rem;
  left: 0.75rem;
  padding: 0.4rem 0.5rem;
  background: rgba(8, 9, 8, 0.83);
  color: white;
  font-family: "Courier New", monospace;
  font-size: 0.57rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.land-ledger__data {
  padding: 0.8rem;
  border: 1px solid var(--threat-line);
  background: #0d0e0d;
}

.land-ledger__bar {
  display: flex;
  min-height: 4.2rem;
  gap: 2px;
}

.land-ledger__bar button {
  position: relative;
  min-width: 0.55rem;
  background: color-mix(in srgb, var(--segment) 55%, #101110);
  opacity: 0.5;
  transition: opacity 180ms ease, transform 180ms ease;
}

.land-ledger__bar button.is-active {
  z-index: 1;
  opacity: 1;
  transform: translateY(-0.25rem);
}

.land-ledger__bar span {
  color: white;
  font-size: 0.55rem;
  font-weight: 800;
  writing-mode: vertical-rl;
}

.land-ledger__keys {
  display: grid;
  gap: 1px;
  margin-top: 0.7rem;
  background: var(--threat-line);
}

.land-ledger__keys button {
  display: grid;
  grid-template-columns: 0.55rem 1fr auto;
  gap: 0.7rem;
  padding: 0.7rem;
  align-items: center;
  background: #0d0e0d;
  color: var(--threat-muted);
  text-align: left;
}

.land-ledger__keys button.is-active {
  background: rgba(225, 91, 67, 0.09);
  color: white;
}

.land-ledger__keys i {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
}

.land-ledger__keys span {
  font-size: 0.69rem;
}

.land-ledger__keys strong {
  font-family: "Courier New", monospace;
  font-size: 0.65rem;
}

.land-ledger__detail {
  margin-top: 0.8rem;
  padding: 1rem;
  border-left: 2px solid var(--threat-red);
  background: rgba(255, 255, 255, 0.025);
}

.land-ledger__detail > span,
.legal-file__date {
  color: var(--threat-orange);
  font-family: "Courier New", monospace;
  font-size: 0.6rem;
  text-transform: uppercase;
}

.land-ledger__detail h3,
.legal-file h3 {
  margin-top: 0.45rem;
  color: white;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.land-ledger__detail > p,
.land-ledger__detail > div p {
  margin-top: 0.7rem;
  color: var(--threat-muted);
  font-size: 0.73rem;
  line-height: 1.55;
}

.land-ledger__detail > div {
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--threat-line);
}

.land-ledger__detail small {
  color: white;
  font-family: "Courier New", monospace;
  font-size: 0.58rem;
  text-transform: uppercase;
}

.land-ledger__detail > a {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.68rem;
}

.impact-chain__visual {
  position: relative;
  min-height: 25rem;
  overflow: hidden;
  border: 1px solid var(--threat-line);
  background: #151713;
}

.impact-chain__visual img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.7) contrast(1.08);
}

.impact-chain__visual::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(0deg, rgba(7, 8, 7, 0.72), transparent 55%);
}

.impact-chain__steps {
  display: grid;
  gap: 1px;
  background: var(--threat-line);
}

.impact-step {
  background: #0d0e0d;
  color: var(--threat-muted);
}

.impact-step.is-active {
  background: rgba(225, 91, 67, 0.08);
}

.impact-step__trigger {
  display: grid;
  grid-template-columns: 2.4rem minmax(0, 1fr);
  gap: 0.7rem;
  width: 100%;
  padding: 0.8rem;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.impact-step__number {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.65rem;
}

.impact-step__copy {
  display: flex;
  flex-direction: column;
}

.impact-step small {
  color: var(--threat-orange);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.impact-step strong {
  margin-top: 0.2rem;
  color: white;
  font-size: 1.15rem;
}

.impact-step em {
  margin-top: 0.25rem;
  font-family: Georgia, serif;
  font-size: 0.72rem;
  line-height: 1.4;
}

.impact-step__evidence {
  display: grid;
  gap: 0.65rem;
  margin: 0 0.8rem 0.8rem 3.9rem;
  padding-top: 0.7rem;
  border-top: 1px solid var(--threat-line);
  color: var(--threat-muted);
  font-size: 0.67rem;
  line-height: 1.5;
}

.impact-step__evidence a {
  color: var(--threat-red);
  font-weight: 800;
  text-decoration: none;
}

.impact-chain__recognized {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(225, 91, 67, 0.36);
  background:
    linear-gradient(90deg, rgba(225, 91, 67, 0.11), transparent),
    #0c0d0c;
}

.impact-chain__recognized > span {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.61rem;
  font-weight: 800;
  text-transform: uppercase;
}

.impact-chain__recognized strong {
  color: white;
  font-size: 1.4rem;
}

.impact-chain__recognized p {
  color: var(--threat-muted);
  font-size: 0.73rem;
}

.impact-chain__recognized a {
  margin-top: 0.4rem;
  font-size: 0.67rem;
}

.evidence-wall__grid {
  display: grid;
  grid-auto-rows: 17rem;
  gap: 0.65rem;
}

.evidence-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--threat-line);
  background: #111;
}

.evidence-card > img,
.evidence-card__veil {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.evidence-card > img {
  object-fit: cover;
  transition: transform 600ms ease;
}

.evidence-card:hover > img { transform: scale(1.035); }

.evidence-card__veil {
  background: linear-gradient(0deg, rgba(6, 7, 6, 0.97), rgba(6, 7, 6, 0.08) 80%);
}

.evidence-card > span {
  position: absolute;
  z-index: 1;
  top: 0.7rem;
  left: 0.7rem;
  padding: 0.35rem 0.45rem;
  background: rgba(8, 9, 8, 0.78);
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.evidence-card > div:last-child {
  position: absolute;
  z-index: 1;
  right: 0.9rem;
  bottom: 0.9rem;
  left: 0.9rem;
}

.evidence-card h3 {
  color: white;
  font-size: clamp(1.3rem, 3vw, 2.15rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.evidence-card p {
  max-width: 39rem;
  margin-top: 0.45rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.68rem;
  line-height: 1.45;
}

.evidence-card a {
  display: inline-block;
  margin-top: 0.6rem;
  color: var(--threat-orange);
  font-size: 0.62rem;
  font-weight: 800;
  text-decoration: none;
}

.legal-timeline {
  position: relative;
  display: grid;
  gap: 0.35rem;
}

.legal-timeline::before {
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  left: 4rem;
  width: 1px;
  content: "";
  background: var(--threat-line);
}

.legal-timeline__item {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 3.2rem 1rem minmax(0, 1fr);
  gap: 0.4rem;
  padding: 0.7rem;
  align-items: center;
  background: #0d0e0d;
  color: var(--threat-muted);
  text-align: left;
}

.legal-timeline__item > span {
  font-family: "Courier New", monospace;
  font-size: 0.64rem;
  font-weight: 800;
}

.legal-timeline__item i {
  width: 0.65rem;
  height: 0.65rem;
  border: 2px solid #0d0e0d;
  border-radius: 50%;
  outline: 1px solid var(--threat-muted);
  background: #0d0e0d;
}

.legal-timeline__item strong {
  font-size: 0.71rem;
  line-height: 1.25;
}

.legal-timeline__item.is-active {
  background: rgba(225, 91, 67, 0.09);
  color: white;
}

.legal-timeline__item.is-active i {
  outline-color: var(--threat-red);
  background: var(--threat-red);
}

.legal-timeline__item--current > span,
.legal-timeline__item--current strong { color: var(--threat-red); }

.legal-file {
  position: relative;
  min-height: 28rem;
  padding: clamp(1.1rem, 3vw, 2rem);
  overflow: hidden;
  border: 1px solid rgba(225, 91, 67, 0.34);
  background:
    linear-gradient(rgba(225, 91, 67, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(225, 91, 67, 0.05) 1px, transparent 1px),
    #111210;
  background-size: 2rem 2rem;
}

.legal-file::after {
  position: absolute;
  top: 2rem;
  right: -1.2rem;
  padding: 0.45rem 1.4rem;
  border: 2px solid rgba(225, 91, 67, 0.28);
  content: "EXPEDIENTE";
  color: rgba(225, 91, 67, 0.28);
  font-family: "Courier New", monospace;
  font-size: 0.78rem;
  font-weight: 900;
  transform: rotate(9deg);
}

.legal-file__top {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  color: var(--threat-muted);
  font-family: "Courier New", monospace;
  font-size: 0.58rem;
  text-transform: uppercase;
}

.legal-file__top em {
  color: var(--threat-red);
  font-style: normal;
}

.legal-file__date { margin-top: 2rem; }

.legal-file__summary {
  max-width: 38rem;
  margin-top: 1rem;
  color: var(--threat-muted);
  font-size: 0.78rem;
  line-height: 1.65;
}

.legal-file__result {
  margin-top: 1.2rem;
  padding: 0.85rem;
  border-left: 2px solid var(--threat-red);
  background: rgba(225, 91, 67, 0.07);
}

.legal-file__result span {
  color: var(--threat-orange);
  font-family: "Courier New", monospace;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.legal-file__result p {
  margin-top: 0.35rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.72rem;
  line-height: 1.5;
}

.legal-file > a {
  display: inline-block;
  margin-top: 1.2rem;
  font-size: 0.67rem;
}

.legal-dossier__current {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--threat-line);
  background: #0b0c0b;
}

.legal-dossier__current span {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.legal-dossier__current strong {
  color: white;
  font-size: 1.1rem;
}

.legal-dossier__current p {
  max-width: 53rem;
  color: var(--threat-muted);
  font-size: 0.7rem;
  line-height: 1.55;
}

.disputed-issues__tabs {
  display: grid;
  gap: 1px;
  background: var(--threat-line);
}

.disputed-issues__tabs button {
  display: grid;
  gap: 0.3rem;
  padding: 0.8rem;
  background: #0d0e0d;
  color: var(--threat-muted);
  text-align: left;
}

.disputed-issues__tabs button.is-active {
  background: rgba(225, 91, 67, 0.1);
}

.disputed-issues__tabs span,
.disputed-issues__panel span {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
}

.disputed-issues__tabs strong {
  color: white;
  font-size: 0.73rem;
}

.disputed-issues__panel {
  display: grid;
  gap: 1px;
  margin-top: 1px;
  background: var(--threat-line);
}

.disputed-issues__panel > * {
  padding: 1rem;
  background: #101110;
}

.disputed-issues__panel p {
  margin-top: 0.55rem;
  color: var(--threat-muted);
  font-size: 0.72rem;
  line-height: 1.6;
}

.disputed-issues__panel > div {
  background:
    linear-gradient(90deg, rgba(225, 91, 67, 0.09), transparent),
    #101110;
}

.disputed-issues__panel a {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--threat-orange);
  font-size: 0.63rem;
  font-weight: 800;
  text-decoration: none;
}

.source-room {
  display: grid;
  gap: 1.5rem;
}

.source-room__intro > span {
  display: block;
  max-width: 37rem;
  margin-top: 1rem;
  color: var(--threat-muted);
  font-size: 0.77rem;
  line-height: 1.6;
}

.source-room__files {
  display: grid;
  gap: 1px;
  background: var(--threat-line);
}

.source-room__files a {
  position: relative;
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  overflow: hidden;
  background: #0e0f0e;
  color: var(--threat-muted);
  text-decoration: none;
  transition: background 180ms ease;
}

.source-room__files a::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  content: "";
  background: var(--threat-red);
  transform: scaleY(0);
  transition: transform 180ms ease;
}

.source-room__files a:hover {
  background: rgba(225, 91, 67, 0.08);
}

.source-room__files a:hover::before { transform: scaleY(1); }

.source-room__files span {
  color: var(--threat-red);
  font-family: "Courier New", monospace;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.source-room__files strong {
  color: white;
  font-size: 0.82rem;
}

.source-room__files em {
  font-size: 0.63rem;
  font-style: normal;
}

.threat-closing {
  position: relative;
  min-height: 32rem;
  margin-top: clamp(4rem, 9vw, 8rem);
  overflow: hidden;
  border: 1px solid var(--threat-line);
  isolation: isolate;
}

.threat-closing > img,
.threat-closing > div {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.threat-closing > img {
  z-index: -2;
  object-fit: cover;
  filter: grayscale(0.65) contrast(1.1);
}

.threat-closing > div {
  z-index: -1;
  background: linear-gradient(90deg, rgba(7, 8, 7, 0.95), rgba(7, 8, 7, 0.38));
}

.threat-closing article {
  display: flex;
  min-height: inherit;
  padding: clamp(1.2rem, 4vw, 3.4rem);
  flex-direction: column;
  justify-content: center;
}

.threat-closing article > span {
  display: block;
  max-width: 35rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.8rem;
  line-height: 1.6;
}

.threat-closing article > div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.25rem;
}

.threat-closing a {
  padding: 0.75rem 1rem;
  border: 1px solid var(--threat-red);
  background: var(--threat-red);
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  text-decoration: none;
}

.threat-closing a + a {
  background: rgba(8, 9, 8, 0.48);
}

.dossier-detail-enter-active,
.dossier-detail-leave-active,
.impact-image-enter-active,
.impact-image-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.dossier-detail-enter-from,
.dossier-detail-leave-to {
  opacity: 0;
  transform: translateY(0.45rem);
}

.impact-image-enter-from,
.impact-image-leave-to {
  opacity: 0;
  transform: scale(1.025);
}

@media (min-width: 640px) {
  .dossier-index__chapters {
    grid-auto-columns: initial;
    grid-auto-flow: row;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow-x: visible;
  }

  .threat-hero__metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .threat-hero__status {
    grid-template-columns: auto 1fr auto;
  }

  .territory-compare__note {
    grid-template-columns: auto 1fr auto;
    align-items: center;
  }

  .impact-chain__recognized {
    grid-template-columns: minmax(12rem, 1.4fr) auto minmax(12rem, 1fr);
    align-items: center;
  }

  .impact-chain__recognized > span,
  .impact-chain__recognized > a {
    grid-column: 1 / -1;
  }

  .evidence-wall__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evidence-card--1 {
    grid-column: span 2;
    grid-row: span 2;
  }

  .disputed-issues__tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .disputed-issues__panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .disputed-issues__panel > div {
    grid-column: span 2;
  }

  .source-room__files {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 800px) {
  .dossier-index__chapters {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .dossier-index__chapters button:first-child {
    grid-column: span 2;
  }

  .dossier-heading {
    grid-template-columns: minmax(0, 0.9fr) minmax(20rem, 1.1fr);
  }

  .land-ledger__layout {
    grid-template-columns: minmax(0, 1.25fr) minmax(20rem, 0.75fr);
  }

  .land-ledger__plan {
    min-height: 40rem;
  }

  .impact-chain__layout {
    grid-template-columns: minmax(18rem, 0.85fr) minmax(24rem, 1.15fr);
    align-items: start;
  }

  .impact-chain__visual {
    position: sticky;
    top: 8rem;
    min-height: 40rem;
  }

  .legal-dossier__layout {
    grid-template-columns: minmax(18rem, 0.75fr) minmax(25rem, 1.25fr);
  }

  .legal-file {
    min-height: 35rem;
  }

  .source-room {
    grid-template-columns: minmax(18rem, 0.7fr) minmax(25rem, 1.3fr);
    align-items: start;
  }
}

@media (min-width: 1060px) {
  .threat-hero__content {
    padding-right: 23%;
  }

  .evidence-wall__grid {
    grid-template-columns: 1.25fr 0.75fr;
    grid-template-rows: repeat(2, 18rem);
  }

  .evidence-card--1 {
    grid-column: auto;
    grid-row: span 2;
  }

  .disputed-issues__tabs {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .disputed-issues__panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .disputed-issues__panel > div {
    grid-column: auto;
  }

  .source-room__files {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .threat-hero__scan,
  .threat-hero__pulse {
    animation: none;
  }

  .evidence-card > img,
  .dossier-detail-enter-active,
  .dossier-detail-leave-active,
  .impact-image-enter-active,
  .impact-image-leave-active {
    transition: none;
  }
}
</style>
