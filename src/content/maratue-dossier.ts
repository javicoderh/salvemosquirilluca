export type LandUseLayer = {
  id: string;
  label: string;
  value: number;
  unit: string;
  color: string;
  percentage: string;
  title: string;
  description: string;
  physicalReading: string;
};

export type ImpactChapter = {
  id: string;
  number: string;
  title: string;
  action: string;
  consequence: string;
  evidence: string;
  image: string;
  alt: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type LegalMilestone = {
  id: string;
  date: string;
  year: string;
  phase: string;
  title: string;
  summary: string;
  result: string;
  status: "citizen" | "authority" | "court" | "current";
  sourceLabel: string;
  sourceUrl: string;
};

export type LegalIssue = {
  id: string;
  article: string;
  title: string;
  citizenPosition: string;
  authorityPosition: string;
  trace: string;
  sourceUrl: string;
};

export const dossierSources = {
  expediente:
    "https://seia.sea.gob.cl/expediente/ficha/fichaPrincipal.php?modo=normal&id_expediente=2132710903",
  ice:
    "https://documento.elasticambiental.dss.cl/documentos/indexados/1462571_Informe%20consolidado%20de%20la%20evaluaci%C3%B3n%20de%20impacto%20ambiental%20%28ICE%29_2132710903.pdf",
  acuerdo2026:
    "https://recursos.sea.gob.cl/storage/documents/2026/05/05/173635_422_2164047479_Acuerdo_Comit_de_Ministros.pdf",
  acta2026:
    "https://www.sea.gob.cl/sites/default/files/imce/archivos/2026/05/06/Acta%20sesion%20Ext%20N%C2%B04.pdf",
  admisibilidad2025:
    "https://firma.sea.gob.cl/publicaciones/2025/01/24/1737753566_2164267362",
  tribunal2022:
    "https://tribunalambiental.cl/sentencia-r-310-311-2021-comite-ministros-proyecto-maratue/",
  corte2023:
    "https://tribunalambiental.cl/wp-content/uploads/2023/06/R-310-2022_CS.pdf",
  judicial2026:
    "https://www.biobiochile.cl/noticias/nacional/region-de-valparaiso/2026/06/25/presentan-dos-recursos-de-reclamacion-por-aprobacion-ambiental-de-megaproyecto-maratue-en-puchuncavi.shtml",
  masterplan:
    "https://laderasur.com/articulo/proyecto-maratue-es-aprobado-y-organizaciones-locales-se-preparan-para-abordar-proteccion-de-quirilluca/"
};

export const projectMetrics = [
  {
    value: "14.180",
    label: "viviendas",
    note: "máximo contemplado por el proyecto"
  },
  {
    value: "1.045",
    label: "hectáreas",
    note: "superficie del ex Fundo Quirilluca"
  },
  {
    value: "45",
    label: "años",
    note: "horizonte de construcción"
  },
  {
    value: "US$2.000",
    label: "millones",
    note: "inversión declarada ante el SEA"
  }
];

export const landUseLayers: LandUseLayer[] = [
  {
    id: "housing",
    label: "Sectores habitacionales",
    value: 702,
    unit: "ha",
    color: "#d9563f",
    percentage: "69,2%",
    title: "La mayor pieza del plano",
    description:
      "El Informe Consolidado de Evaluación asigna 702 hectáreas urbanas al desarrollo habitacional. Allí se distribuye el máximo de 14.180 casas y departamentos a lo largo de 45 años.",
    physicalReading:
      "Cada sector requiere trazado, escarpe, cortes o rellenos, redes, pavimentos y obras de aguas lluvias antes de recibir edificación."
  },
  {
    id: "infrastructure",
    label: "Vialidades y urbanización",
    value: 166,
    unit: "ha",
    color: "#eb8b49",
    percentage: "16,4%",
    title: "La red que transforma el suelo",
    description:
      "El expediente reúne 166 hectáreas bajo la categoría “otros”: vialidades, urbanización, cesiones y obras asociadas. Su efecto físico conecta y fragmenta simultáneamente el predio.",
    physicalReading:
      "Las vías incorporan trazado, movimiento de tierra, mejoramiento de suelo, pavimentación, veredas, drenaje, electricidad, alumbrado y paisajismo."
  },
  {
    id: "conservation",
    label: "Área de conservación",
    value: 125.2,
    unit: "ha",
    color: "#6f8f65",
    percentage: "12,3%",
    title: "Compensación dentro del proyecto",
    description:
      "La RCA contempla 66,6 hectáreas de zona núcleo y 58,6 de amortiguación. Esta medida busca compensar impactos significativos sobre bosque esclerófilo y hábitat de fauna terrestre.",
    physicalReading:
      "La ciudadanía sostiene que el polígono de protección requiere mayor extensión y continuidad ecológica; el Comité de Ministros consideró adecuada la medida e incorporó complementos."
  },
  {
    id: "facilities",
    label: "Equipamiento",
    value: 21,
    unit: "ha",
    color: "#a68873",
    percentage: "2,1%",
    title: "Servicios para una nueva escala urbana",
    description:
      "Veintiuna hectáreas se destinan a sectores de equipamiento vinculados a las funciones de habitar, producir y circular.",
    physicalReading:
      "El equipamiento acompaña el crecimiento residencial y amplía la intensidad de uso, los desplazamientos y la demanda cotidiana sobre el territorio."
  }
];

export const impactChapters: ImpactChapter[] = [
  {
    id: "soil",
    number: "01",
    title: "Suelo",
    action: "Escarpe, cortes y rellenos",
    consequence: "La topografía se convierte en plataforma urbana.",
    evidence:
      "El ICE describe limpieza de la capa vegetal y movimientos de tierra para nivelar sectores destinados a edificación y urbanización. El Acuerdo 9/2026 añadió un plan de coberturas para puntos con excedencias residenciales de arsénico y plomo.",
    image: "/assets/quirilluca/LSQ-13_flora_matorral_esclerofilo_01.jpg",
    alt: "Matorral esclerófilo sobre el suelo de Quirilluca",
    sourceLabel: "ICE y Acuerdo 9/2026 · SEA",
    sourceUrl: dossierSources.acuerdo2026
  },
  {
    id: "water",
    number: "02",
    title: "Agua",
    action: "Impermeabilización y encauzamiento",
    consequence: "La lluvia encuentra nuevas superficies y recorridos.",
    evidence:
      "El expediente identifica potenciales alteraciones del escurrimiento, la infiltración y ecosistemas acuáticos. El titular las califica como impactos no significativos y compromete franjas libres de edificación y monitoreos en los humedales.",
    image: "/assets/quirilluca/OTR-03_paisaje_quebrada_playa_credito_salvemos_quirilluca_facebook.jpg",
    alt: "Quebrada que conecta el interior de Quirilluca con la costa",
    sourceLabel: "ICE 2024 · capítulos de hidrología y humedales",
    sourceUrl: dossierSources.ice
  },
  {
    id: "habitat",
    number: "03",
    title: "Hábitat",
    action: "Urbanización de bosque y matorral",
    consequence: "La continuidad ecológica se divide en piezas.",
    evidence:
      "La evaluación reconoce como impactos significativos la alteración de comunidades florísticas del bosque esclerófilo y la pérdida de hábitat de fauna terrestre. La compensación propuesta incluye conservación y mejoramiento de bosque nativo.",
    image: "/assets/quirilluca/LSQ-21_flora_matorral_esclerofilo_03.jpg",
    alt: "Continuidad del bosque y matorral esclerófilo de Quirilluca",
    sourceLabel: "ICE 2024 · C-FLORA3 y C-FAUNA3",
    sourceUrl: dossierSources.ice
  },
  {
    id: "movement",
    number: "04",
    title: "Movilidad",
    action: "Nuevos caminos y mayor flujo",
    consequence: "La escala del proyecto se extiende hacia toda la comuna.",
    evidence:
      "La reclamación ciudadana aborda el aumento en los tiempos de desplazamiento. El área de influencia vial estudiada incorpora rutas regionales y calles locales entre Puchuncaví, Campiche, Maitencillo y Horcón.",
    image: "/assets/quirilluca/LSQ-08_proyecto_puente_verde.jpg",
    alt: "Representación conceptual del puente verde y la vialidad de Maratué",
    sourceLabel: "Acuerdo 9/2026 y material conceptual de Maratué",
    sourceUrl: dossierSources.acuerdo2026
  },
  {
    id: "community",
    number: "05",
    title: "Vida comunitaria",
    action: "Una nueva población sobre la trama existente",
    consequence: "Servicios, accesos y memoria reciben una presión de otra magnitud.",
    evidence:
      "Desde la participación ciudadana de 2017, habitantes han planteado preocupaciones sobre agua, saneamiento, tránsito, acceso a la costa, actividades tradicionales y carácter territorial. Esas observaciones sostienen la disputa administrativa y judicial.",
    image: "/assets/quirilluca/OTR-01_comunidad_manifestacion_salvemos_quirilluca.jpg",
    alt: "Manifestación ciudadana por la defensa de Quirilluca",
    sourceLabel: "Participación ciudadana y expediente judicial",
    sourceUrl: dossierSources.tribunal2022
  }
];

export const legalMilestones: LegalMilestone[] = [
  {
    id: "eia-2017",
    date: "14 septiembre 2017",
    year: "2017",
    phase: "Evaluación ambiental",
    title: "El EIA ingresa al sistema",
    summary:
      "La Comisión de Evaluación de Valparaíso admite a trámite el Estudio de Impacto Ambiental. El proceso de participación ciudadana se desarrolla entre septiembre de 2017 y febrero de 2018.",
    result: "El ICE más reciente consigna 192 observaciones ciudadanas admisibles.",
    status: "citizen",
    sourceLabel: "Informe Consolidado de Evaluación",
    sourceUrl: dossierSources.ice
  },
  {
    id: "rca-2019",
    date: "29 julio 2019",
    year: "2019",
    phase: "Primera aprobación",
    title: "RCA N°16/2019 favorable",
    summary:
      "La Comisión regional califica favorablemente el proyecto. Observantes presentan dos reclamaciones administrativas por la consideración de sus observaciones.",
    result: "La primera aprobación abre una revisión administrativa que cambiará el curso del expediente.",
    status: "authority",
    sourceLabel: "Segundo Tribunal Ambiental",
    sourceUrl: dossierSources.tribunal2022
  },
  {
    id: "retroaction-2021",
    date: "29 septiembre 2021",
    year: "2021",
    phase: "Reclamación administrativa",
    title: "El Comité ordena retrotraer",
    summary:
      "El Comité de Ministros acoge parcialmente las reclamaciones al constatar que materias ciudadanas requerían análisis complementario.",
    result:
      "La evaluación vuelve a la etapa previa al ICSARA para profundizar salud, flora, fauna, humedales y movilidad.",
    status: "citizen",
    sourceLabel: "Resolución y síntesis del Tribunal Ambiental",
    sourceUrl: dossierSources.tribunal2022
  },
  {
    id: "tribunal-2022",
    date: "5 octubre 2022",
    year: "2022",
    phase: "Control judicial",
    title: "R-310 y R-311 pierden objeto",
    summary:
      "La COEVA había dejado sin efecto las actuaciones posteriores al ICSARA y la RCA de 2019. El Tribunal concluye que ese cambio hizo desaparecer el objeto de las reclamaciones judiciales.",
    result:
      "El Tribunal rechaza por pérdida sobreviniente del objeto y omite pronunciarse sobre el fondo de esas alegaciones.",
    status: "court",
    sourceLabel: "Sentencia R-310-2021, acumulada R-311-2021",
    sourceUrl: dossierSources.tribunal2022
  },
  {
    id: "supreme-2023",
    date: "20 junio 2023",
    year: "2023",
    phase: "Corte Suprema",
    title: "Casaciones declaradas inadmisibles",
    summary:
      "La Corte Suprema determina que la resolución del Tribunal Ambiental no puso término al procedimiento de calificación ambiental, que continuaba abierto.",
    result: "La decisión aborda la admisibilidad procesal de los recursos y el expediente vuelve a su cauce ambiental.",
    status: "court",
    sourceLabel: "Corte Suprema · Rol 3.363-2023",
    sourceUrl: dossierSources.corte2023
  },
  {
    id: "rca-2024",
    date: "28 octubre 2024",
    year: "2024",
    phase: "Segunda aprobación",
    title: "Nueva RCA favorable",
    summary:
      "Tras la evaluación retrotraída, la Comisión regional dicta la RCA N°202405001194 y vuelve a calificar favorablemente Maratué.",
    result: "El 24 de diciembre se presentan dos nuevas reclamaciones PAC contra esta RCA.",
    status: "authority",
    sourceLabel: "Resolución de admisibilidad del SEA",
    sourceUrl: dossierSources.admisibilidad2025
  },
  {
    id: "committee-2026",
    date: "13 abril 2026",
    year: "2026",
    phase: "Comité de Ministros",
    title: "Reclamaciones rechazadas, RCA condicionada",
    summary:
      "El Comité rechaza las dos reclamaciones y mantiene la aprobación. A la vez, modifica la RCA con nuevas exigencias, entre ellas coberturas de suelo para puntos con excedencias residenciales de arsénico y plomo.",
    result:
      "La calificación favorable permanece vigente con condiciones incorporadas mediante el Acuerdo N°9/2026.",
    status: "authority",
    sourceLabel: "Acuerdo N°9/2026 · Comité de Ministros",
    sourceUrl: dossierSources.acuerdo2026
  },
  {
    id: "court-2026",
    date: "Junio 2026",
    year: "HOY",
    phase: "Nueva batalla judicial",
    title: "Dos reclamaciones llegan al Segundo Tribunal Ambiental",
    summary:
      "Vecinos y organizaciones solicitan que el tribunal revise la legalidad del proceso y deje sin efecto la aprobación ambiental.",
    result:
      "Último estado público consultado: acciones ingresadas y reportadas en análisis de admisibilidad. Actualización editorial: 29 de julio de 2026.",
    status: "current",
    sourceLabel: "Reporte público del 25 de junio de 2026",
    sourceUrl: dossierSources.judicial2026
  }
];

export const legalIssues: LegalIssue[] = [
  {
    id: "health",
    article: "Art. 11 letra a",
    title: "Salud, aire y metales en el suelo",
    citizenPosition:
      "Las reclamaciones cuestionan el análisis de exposición a arsénico y otros metales, la resuspensión durante las obras y la lectura acumulativa de una zona con contaminación preexistente.",
    authorityPosition:
      "El Comité concluyó que el aporte atmosférico del proyecto sería bajo y que el análisis de riesgo resguarda los usos proyectados. Incorporó un plan precautorio de coberturas de suelo.",
    trace:
      "La nueva condición identifica siete puntos sobre el umbral residencial de arsénico y uno de plomo, destinados según el plan a parques, caminos, humedales o equipamiento.",
    sourceUrl: dossierSources.acuerdo2026
  },
  {
    id: "biodiversity",
    article: "Art. 11 letra b",
    title: "Fauna, flora y compensación",
    citizenPosition:
      "La defensa sostiene que el área de conservación propuesta resulta insuficiente para mantener continuidad ecológica y proteger especies, bosque, quebrada y borde costero.",
    authorityPosition:
      "El Comité consideró idóneas las medidas de conservación y mejoramiento del bosque, e incorporó refuerzos para monitoreo y control de especies invasoras.",
    trace:
      "El ICE reconoce como significativos C-FLORA3, alteración del bosque esclerófilo, y C-FAUNA3, pérdida de hábitat de fauna terrestre.",
    sourceUrl: dossierSources.ice
  },
  {
    id: "wetlands",
    article: "Art. 11 letra d",
    title: "Humedales y valor ambiental",
    citizenPosition:
      "Las observaciones plantean efectos por impermeabilización, escurrimiento, ruido, movimiento de tierra y obras próximas a ecosistemas acuáticos.",
    authorityPosition:
      "La evaluación calificó esos impactos como no significativos y estableció áreas libres de edificación, cercos, seguimiento hídrico y monitoreo de anfibios.",
    trace:
      "El expediente reconoce potenciales alteraciones de escurrimiento, infiltración, condiciones acuáticas, fauna y niveles de ruido.",
    sourceUrl: dossierSources.acuerdo2026
  },
  {
    id: "mobility",
    article: "Art. 11 letra c",
    title: "Movilidad y sistemas de vida",
    citizenPosition:
      "La comunidad relaciona la nueva escala habitacional con tiempos de viaje, congestión, acceso a servicios y transformación de las localidades existentes.",
    authorityPosition:
      "El Comité sostuvo que la evaluación y las medidas viales permiten abordar el aumento de flujo y los tiempos de desplazamiento.",
    trace:
      "El área de influencia estudiada reúne rutas F-30E, F-20 y diversas conexiones comunales y calles locales.",
    sourceUrl: dossierSources.acuerdo2026
  }
];

export const evidenceImages = [
  {
    image: "/assets/quirilluca/LSQ-04_proyecto_masterplan_01.jpg",
    label: "Visualización conceptual",
    title: "Una ciudad dibujada sobre el paisaje",
    text: "Representación difundida por el proyecto. Expresa una intención urbana y paisajística; su aspecto final dependerá de diseños, permisos sectoriales y ejecución futura.",
    sourceUrl: dossierSources.masterplan
  },
  {
    image: "/assets/quirilluca/LSQ-07_proyecto_masterplan_02.jpg",
    label: "Plan maestro del proponente",
    title: "La red completa",
    text: "El esquema permite leer dos grandes conjuntos urbanos, caminos, humedales, corazones verdes, senderos y el vínculo entre costa y Puchuncaví.",
    sourceUrl: dossierSources.masterplan
  },
  {
    image: "/assets/quirilluca/LSQ-08_proyecto_puente_verde.jpg",
    label: "Infraestructura conceptual",
    title: "El llamado puente verde",
    text: "La pieza propone continuidad peatonal y vegetal sobre una nueva vía. La imagen muestra una propuesta arquitectónica, mientras el expediente define obligaciones verificables.",
    sourceUrl: dossierSources.masterplan
  }
];
