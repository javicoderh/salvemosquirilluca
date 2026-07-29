const externalLinks = {
  letterPdf: "",
  form: "/firma",
  linktree: "",
  instagram: "https://www.instagram.com/salvemos.quirilluca/",
  facebook: "https://www.facebook.com/quirillucapatrimonio/",
  tiktok: "",
  youtube: ""
} as const;

export const campaignConfig = {
  site: {
    name: "Salvemos Quirilluca",
    siteUrl: "https://salvemosquirilluca.cl",
    locale: "es_CL",
    language: "es-CL",
    title: "Salvemos Quirilluca | Territorio vivo, comunidad organizada",
    description:
      "Organización comunitaria por la protección de los Acantilados de Quirilluca y los ecosistemas de Puchuncaví.",
    themeColor: "#1D2418",
    contactEmail: "contacto@salvemosquirilluca.cl",
    author: "Salvemos Quirilluca"
  },
  theme: {
    colors: {
      bg: "#11130D",
      surface: "#1D2418",
      surfaceStrong: "#2B3524",
      text: "#F3EBDD",
      textMuted: "#C8C0AD",
      border: "rgba(215,192,155,0.2)",
      sky: "#6A8D52",
      ocean: "#315B5B",
      warm: "#D0A457",
      clay: "#A96845",
      stone: "#D7C09B",
      black: "#090B07",
      white: "#F3EBDD"
    }
  },
  assets: {
    logo: "/assets/quirilluca/logo-salvemos-quirilluca.svg",
    ogImage: "/assets/quirilluca/LSQ-01_paisaje_acantilados_portada.jpg",
    favicon: "/favicon.svg",
    publicLetterPdf: "",
    publicLetterPdfEn: ""
  },
  links: externalLinks,
  dates: {
    signatureDeadlineIso: "2026-12-31T23:59:59-03:00",
    signatureDeadlineLabel: "una protección efectiva para Quirilluca"
  },
  hero: {
    mode: "static-dark" as "static-dark" | "video",
    videoSrc: "",
    eyebrow: "Organización comunitaria por la defensa del territorio",
    title: "Quirilluca es un territorio vivo",
    subtitle:
      "Los Acantilados de Quirilluca reúnen biodiversidad, patrimonio, memoria y comunidad. Conocerlos es el primer paso para defender una protección efectiva.",
    rotatingLines: [
      "Biodiversidad, justicia ambiental y memoria.",
      "El nombre del territorio también se defiende.",
      "La comunidad está organizada e informada.",
      "Proteger Quirilluca es cuidar el futuro de Puchuncaví."
    ],
    buttons: {
      readLetter: "Conoce Quirilluca",
      signNow: "Súmate",
      floating: "SÚMATE A LA DEFENSA"
    },
    signaturesCounter: {
      enabled: false,
      label: "Personas conectadas",
      value: "0",
      note: "Estamos preparando una nueva base de participación."
    }
  },
  problem: {
    title: "Un territorio extraordinario bajo presión",
    intro:
      "Quirilluca se ubica entre Horcón y Maitencillo, en Puchuncaví. Es un Sitio Prioritario para la Conservación de la Biodiversidad y enfrenta presiones de proyectos de gran escala, mientras la comunidad busca protección oficial y participación informada.",
    cards: [
      { value: "1.045 ha", label: "Ex Fundo Quirilluca", detail: "Un sistema costero de acantilados, bosque, quebradas y mar." },
      { value: "14.180", label: "Viviendas proyectadas", detail: "14.180 viviendas proyectadas por Maratué, cifra vigente a julio de 2026." },
      { value: "2017", label: "Defensa organizada", detail: "En 2017 la comunidad comenzó a articularse frente al conflicto." }
    ]
  },
  ecosystem: {
    title: "Proteger Quirilluca es cuidar un sistema completo",
    body:
      "Aquí conviven bosque y matorral esclerófilo, piqueros, bellotos del norte, lagartos, aves costeras, quebradas, estratos fosilíferos y una memoria comunitaria que no puede separarse del paisaje.",
    pillars: [
      { title: "Biodiversidad", icon: "✦", description: "Piquero común, belloto del norte, chungungo y muchas otras especies encuentran refugio en este corredor costero." },
      { title: "Territorio", icon: "◒", description: "Acantilados, playas, quebradas y bosque forman un sistema ecológico, geológico y paisajístico conectado." },
      { title: "Comunidad", icon: "≈", description: "La defensa nace de habitantes que cuidan la memoria, el acceso y el futuro de Puchuncaví." }
    ]
  },
  conversion: {
    title: "La defensa de Quirilluca necesita una comunidad conectada.",
    cardTitle: "Súmate a Salvemos Quirilluca",
    cardText: "Recibe información, participa en acciones vigentes y ayuda a que la evidencia del territorio llegue a más personas.",
    shareTitle: "Comparte la historia de Quirilluca.",
    shareText: "Difunde esta causa y usa #SalvemosQuirilluca.",
    reminder: "La protección efectiva se construye con información, organización y cuidado colectivo.",
    hashtags: ["#SalvemosQuirilluca", "#Quirilluca", "#Puchuncaví"]
  },
  signatureForm: {
    title: "Súmate a la defensa de Quirilluca",
    intro: "Déjanos tus datos para recibir información y conocer formas concretas de participar.",
    helper: "Completa tus datos y acepta el consentimiento.",
    submitLabel: "Quiero sumarme",
    rutHelp: "Por ahora usamos este formulario como registro temporal. La base definitiva se conectará en una siguiente etapa.",
    privacyNote: "Tus datos se usarán únicamente para gestionar tu participación y enviarte actualizaciones si lo autorizas.",
    configuredNote: "El registro temporal funciona con un fallback mientras se prepara la nueva base de datos.",
    trustPoints: ["Información con fuentes", "Participación comunitaria", "Cuidado del territorio"],
    fields: {
      firstName: "Nombre", lastName: "Apellido", rut: "RUT", email: "Correo electrónico", age: "Edad", country: "País",
      legalNature: "¿Eres persona natural o jurídica?", region: "Región", commune: "Comuna", affiliation: "Organización o vínculo con el territorio",
      message: "¿Por qué quieres sumarte?", adultDeclaration: "Declaro ser mayor de 18 años.", consent: "Acepto el uso de mis datos para esta campaña y acepto la", updates: "Quiero recibir actualizaciones de Salvemos Quirilluca."
    }
  },
  transparency: {
    title: "Evidencia, comunidad y transparencia",
    body: "Salvemos Quirilluca comunica con fecha, fuentes y atribución. El estado legal y ambiental del territorio puede cambiar, por eso cada actualización debe revisarse.",
    publicReadinessTitle: "Un archivo público para la defensa territorial",
    publicReadinessBody: "Reunimos investigación, documentos, cronología y fuentes para que la comunidad pueda informarse y participar.",
    principles: ["Comunidad", "Evidencia", "Cuidado", "Participación informada", "Memoria territorial"],
    publicReadinessLinks: [{ href: "/robots.txt", label: "robots.txt" }, { href: "/sitemap.xml", label: "sitemap.xml" }, { href: "/privacidad", label: "Política de privacidad" }, { href: "/contacto", label: "Contacto" }]
  },
  navigation: [
    { href: "/", label: "Inicio" },
    { href: "/pinguino-de-humboldt", label: "Quirilluca" },
    { href: "/amenazas", label: "La amenaza" },
    { href: "/transparencia", label: "Nuestra historia" },
    { href: "/ciencia", label: "Documentos" },
    { href: "/noticias", label: "Actualidad" },
    { href: "/contacto", label: "Contacto" },
    { href: "/firma", label: "Súmate" }
  ],
  knowledgeHub: [
    { href: "/pinguino-de-humboldt", label: "El territorio", description: "Acantilados, bosque, mar, geología y memoria de Quirilluca." },
    { href: "/amenazas", label: "La amenaza", description: "Maratué y otras presiones sobre Puchuncaví." },
    { href: "/ciencia", label: "Documentos", description: "Fuentes públicas, estudios y resoluciones." },
    { href: "/transparencia", label: "Nuestra historia", description: "La defensa comunitaria organizada desde 2017." },
    { href: "/noticias", label: "Actualidad", description: "Hitos y novedades con fecha." },
    { href: "/contacto", label: "Súmate", description: "Canales oficiales y formas de participar." }
  ],
  socialLinks: [
    { href: externalLinks.instagram, label: "Instagram" },
    { href: externalLinks.facebook, label: "Facebook" },
    { href: externalLinks.linktree, label: "Linktree" }
  ],
  futureRoutes: []
} as const;

export type CampaignConfig = typeof campaignConfig;
