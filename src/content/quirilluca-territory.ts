export type TerritorySpecies = {
  id: string;
  name: string;
  scientificName: string;
  kind: string;
  summary: string;
  story: string;
  ecologicalRole: string;
  observation: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
};

const asset = (file: string) => `/assets/quirilluca/${file}`;

export const floraSpecies: TerritorySpecies[] = [
  {
    id: "belloto-del-norte",
    name: "Belloto del norte",
    scientificName: "Beilschmiedia miersii",
    kind: "Árbol nativo · Monumento Natural",
    summary: "Un árbol siempreverde que convierte la quebrada en refugio.",
    story:
      "Bajo su copa cambia la luz y también cambia el tiempo. El belloto del norte conserva humedad, sostiene suelo y levanta una arquitectura viva donde otras especies encuentran sombra y abrigo. En Quirilluca, el acantilado se prolonga hacia el interior como una trama de raíces, hojas y agua.",
    ecologicalRole:
      "Forma parte del bosque esclerófilo costero y aporta estructura, refugio y alimento al ecosistema. La especie fue declarada Monumento Natural en Chile.",
    observation:
      "Su presencia está documentada en el área. La ubicación general resguarda los ejemplares sensibles.",
    images: [
      { src: asset("LSQ-11_flora_belloto_del_norte.jpg"), alt: "Bosque de belloto del norte en Quirilluca" },
      { src: asset("EDQ-04_flora_belloto_del_norte.jpg"), alt: "Detalle del belloto del norte" }
    ]
  },
  {
    id: "ananuca-de-la-gloria",
    name: "Añañuca de la gloria",
    scientificName: "Phycella sp.",
    kind: "Geófita costera",
    summary: "La primavera guardada bajo tierra irrumpe en rojo.",
    story:
      "Durante buena parte del año permanece resguardada bajo tierra. Después de las lluvias, la añañuca emerge y enciende el matorral con flores rojas. Esa aparición breve expresa su estrategia: una reserva subterránea le permite atravesar la estación seca. Su floración hace visible el pulso estacional de Quirilluca.",
    ecologicalRole:
      "Las plantas geófitas almacenan recursos en estructuras subterráneas y participan de las floraciones que alimentan a insectos polinizadores.",
    observation:
      "El nombre común proviene del archivo visual de la campaña; la determinación taxonómica específica debe confirmarse con una fuente botánica.",
    images: [
      { src: asset("LSQ-26_flora_ananuca_de_la_gloria_01.jpg"), alt: "Añañuca de la gloria entre vegetación costera" },
      { src: asset("LSQ-27_flora_ananuca_de_la_gloria_02.jpg"), alt: "Floración roja de añañucas en Quirilluca" },
      { src: asset("LSQ-28_flora_ananuca_de_la_gloria_03.jpg"), alt: "Grupo de añañucas de la gloria" }
    ]
  },
  {
    id: "quillay",
    name: "Quillay",
    scientificName: "Quillaja saponaria",
    kind: "Árbol esclerófilo",
    summary: "Hojas firmes para habitar veranos largos y secos.",
    story:
      "El quillay conoce la economía del agua. Sus hojas resistentes enfrentan el verano mediterráneo y sostienen verdor cuando el paisaje se vuelve ocre. Crece acompañado por una comunidad vegetal adaptada al viento, a la sal y a la irregularidad de las lluvias.",
    ecologicalRole:
      "Integra el bosque y matorral esclerófilo, ofrece recursos a polinizadores y contribuye a proteger el suelo.",
    observation:
      "Fotografiado en el archivo de biodiversidad de Quirilluca.",
    images: [
      { src: asset("EDQ-03_flora_quillay.jpg"), alt: "Quillay registrado en Quirilluca" }
    ]
  },
  {
    id: "capachito",
    name: "Capachito",
    scientificName: "Calceolaria sp.",
    kind: "Hierba nativa",
    summary: "Una pequeña flor amarilla abre su bolsa de luz.",
    story:
      "A ras de suelo, el capachito demuestra que el paisaje también se construye en escala mínima. Su flor de forma singular aparece como una lámpara entre piedras y hojas. Quien baja la mirada descubre una biodiversidad capaz de concentrarse en unos cuantos centímetros.",
    ecologicalRole:
      "Sus flores forman parte de las interacciones entre plantas e insectos del matorral costero.",
    observation:
      "La fotografía permite reconocer el género; la especie exacta requiere validación botánica.",
    images: [
      { src: asset("EDQ-07_flora_capachito.jpg"), alt: "Capachito amarillo en la vegetación de Quirilluca" }
    ]
  },
  {
    id: "soldadito",
    name: "Soldadito",
    scientificName: "Tropaeolum sp.",
    kind: "Enredadera nativa",
    summary: "Una bandera diminuta trepa entre ramas y estaciones.",
    story:
      "El soldadito avanza entre ramas: se apoya, enlaza y asciende. Sus flores colorean el sotobosque y cuentan una historia de cooperación vegetal. En el entramado de Quirilluca, crecer también significa encontrar soporte en otros cuerpos vivos.",
    ecologicalRole:
      "Aporta flores y cobertura a los ambientes de bosque y matorral, relacionándose con polinizadores.",
    observation:
      "Registrado con nombre común en el archivo visual; la especie exacta debe confirmarse.",
    images: [
      { src: asset("EDQ-11_flora_soldadito.jpg"), alt: "Flor de soldadito en Quirilluca" }
    ]
  },
  {
    id: "matorral-esclerofilo",
    name: "Matorral esclerófilo",
    scientificName: "Comunidad vegetal",
    kind: "Ecosistema terrestre",
    summary: "Muchas especies escriben juntas la piel verde del acantilado.",
    story:
      "Visto desde lejos parece una sola textura. De cerca, el matorral revela hojas duras, espinas, flores, aromas y refugios. Es una comunidad diseñada por el clima mediterráneo: resiste sequedad, viento costero y suelos exigentes. Su continuidad permite que la vida se desplace entre quebrada, bosque y borde marino.",
    ecologicalRole:
      "Protege el suelo frente a la erosión, regula microclimas y ofrece alimento y refugio a fauna nativa.",
    observation:
      "Reúne muchas especies en un conjunto ecológico. Su continuidad sostiene relaciones que se extienden más allá de cada fotografía.",
    images: [
      { src: asset("LSQ-13_flora_matorral_esclerofilo_01.jpg"), alt: "Matorral esclerófilo sobre el borde costero" },
      { src: asset("LSQ-16_flora_matorral_esclerofilo_02.jpg"), alt: "Vegetación esclerófila costera de Quirilluca" },
      { src: asset("LSQ-21_flora_matorral_esclerofilo_03.jpg"), alt: "Diversidad del matorral costero" }
    ]
  },
  {
    id: "chupalla",
    name: "Chupalla y polinizadores",
    scientificName: "Eryngium sp.",
    kind: "Planta e interacción ecológica",
    summary: "Una flor continúa más allá de sus pétalos, en cada visitante.",
    story:
      "La chupalla sostiene una escena pequeña y decisiva. Un insecto llega por alimento y, al hacerlo, transporta vida entre flores. La imagen guarda esa conversación silenciosa: la planta ofrece, el visitante conecta y el territorio florece gracias a la relación.",
    ecologicalRole:
      "Entrega recursos florales y participa en redes de polinización del matorral costero.",
    observation:
      "La fotografía documenta la interacción y resguarda la identidad del insecto y la ubicación del ejemplar.",
    images: [
      { src: asset("LSQ-17_flora_chupalla_y_abejorro.jpg"), alt: "Chupalla visitada por un polinizador en Quirilluca" }
    ]
  }
];

export const faunaSpecies: TerritorySpecies[] = [
  {
    id: "piquero-comun",
    name: "Piquero común",
    scientificName: "Sula variegata",
    kind: "Ave marina",
    summary: "Entre el viento y la roca, una colonia convierte el acantilado en hogar.",
    story:
      "Desde el mar, el piquero regresa con alimento; desde la cornisa, los pichones esperan. Cada vuelo cose océano y tierra en una sola trayectoria. Quirilluca alberga una colonia reproductiva de gran relevancia para Chile central: una ciudad alada que necesita distancia, silencio y un borde costero continuo.",
    ecologicalRole:
      "Depredador marino que transfiere nutrientes entre el océano y los sitios de nidificación, y funciona como indicador de la salud del ecosistema costero.",
    observation:
      "La colonia es un lugar sensible. La observación responsable mantiene distancia de nidos y deja libres sus rutas.",
    images: [
      { src: asset("LSQ-05_fauna_piqueros_y_pichones_01.jpg"), alt: "Colonia de piqueros y pichones en el acantilado" },
      { src: asset("LSQ-18_fauna_piqueros_y_pichones_02.jpg"), alt: "Piqueros comunes reunidos en Quirilluca" },
      { src: asset("LSQ-19_fauna_piqueros_y_pichones_03.jpg"), alt: "Adultos y pichones de piquero común" },
      { src: asset("LSQ-25_fauna_piqueros_y_pichones_04.jpg"), alt: "Zona de nidificación de piqueros" },
      { src: asset("LSQ-29_fauna_piqueros_y_pichones_05.jpg"), alt: "Familia de piqueros en el roquerío" },
      { src: asset("LSQ-03_fauna_piquero_individual.jpg"), alt: "Piquero común individual" },
      { src: asset("LSQ-09_fauna_piquero_comun.jpg"), alt: "Piquero común sobre el borde costero" },
      { src: asset("EDQ-02_fauna_piquero.jpg"), alt: "Piquero registrado en Quirilluca" }
    ]
  },
  {
    id: "lagarto-zapallar",
    name: "Lagarto de Zapallar",
    scientificName: "Liolaemus zapallarensis",
    kind: "Reptil nativo · Vulnerable",
    summary: "El sol calienta la roca y una vida antigua vuelve a moverse.",
    story:
      "Quieto, parece parte del terreno. Luego corre y el paisaje revela que estaba vivo todo el tiempo. El lagarto de Zapallar depende del mosaico de refugios, vegetación y superficies soleadas del litoral. Su pequeña escala corporal requiere un hábitat amplio y continuo.",
    ecologicalRole:
      "Consume pequeños invertebrados y participa en la red trófica terrestre del matorral costero.",
    observation:
      "El diagnóstico territorial citado por la campaña lo categoriza como vulnerable. La referencia territorial general protege sus puntos de observación.",
    images: [
      { src: asset("LSQ-22_fauna_lagarto_de_zapallar_01.jpg"), alt: "Lagarto de Zapallar sobre roca" },
      { src: asset("LSQ-23_fauna_lagarto_de_zapallar_02.jpg"), alt: "Lagarto de Zapallar en su hábitat costero" }
    ]
  },
  {
    id: "jote-colorado",
    name: "Jote de cabeza colorada",
    scientificName: "Cathartes aura",
    kind: "Ave planeadora",
    summary: "Lee las corrientes del acantilado con las alas abiertas.",
    story:
      "El jote planea sostenido por el aire. Aprovecha las corrientes que suben por el farellón y recorre el borde costero como un vigía. Su vuelo amplio acompaña una tarea concreta y esencial: devolver materia al ciclo de la vida.",
    ecologicalRole:
      "Ave carroñera que contribuye a remover restos orgánicos y al reciclaje de nutrientes.",
    observation:
      "Los miradores distantes permiten observar su planeo y resguardar las áreas frágiles.",
    images: [
      { src: asset("LSQ-10_fauna_jote_cabeza_colorada_01.jpg"), alt: "Jote de cabeza colorada en Quirilluca" },
      { src: asset("LSQ-20_fauna_jote_cabeza_colorada_02.jpg"), alt: "Jote de cabeza colorada sobre el territorio" }
    ]
  },
  {
    id: "jote-negro",
    name: "Jote de cabeza negra",
    scientificName: "Coragyps atratus",
    kind: "Ave carroñera",
    summary: "Una silueta oscura mantiene limpio el horizonte.",
    story:
      "Su figura parece dibujada con tinta sobre el cielo. El jote de cabeza negra recorre espacios abiertos y comparte con otros carroñeros una labor esencial. Su presencia devuelve materia al ciclo y ayuda a que el sistema continúe.",
    ecologicalRole:
      "Consume carroña y aporta a la limpieza sanitaria y al ciclo de nutrientes.",
    observation:
      "Fotografiado en el paisaje de Quirilluca; su presencia forma parte de la comunidad de aves del borde costero.",
    images: [
      { src: asset("LSQ-14_fauna_jote_cabeza_negra.jpg"), alt: "Jote de cabeza negra registrado en Quirilluca" }
    ]
  },
  {
    id: "churrete-costero",
    name: "Churrete costero",
    scientificName: "Cinclodes nigrofumosus",
    kind: "Ave del intermareal",
    summary: "Camina donde cada ola borra y vuelve a escribir la orilla.",
    story:
      "Mientras el mar avanza y retrocede, el churrete costero inspecciona rocas húmedas y grietas. Vive al ritmo de la marea, en una franja dinámica compartida por tierra y océano. Su recorrido une espuma, piedra y alimento.",
    ecologicalRole:
      "Busca invertebrados en ambientes rocosos intermareales y conecta la trama alimentaria costera.",
    observation:
      "Es una especie estrechamente asociada al litoral rocoso de Chile.",
    images: [
      { src: asset("LSQ-24_fauna_churrete_costero.jpg"), alt: "Churrete costero sobre las rocas de Quirilluca" }
    ]
  },
  {
    id: "lagartija-lemniscata",
    name: "Lagartija lemniscata",
    scientificName: "Liolaemus lemniscatus",
    kind: "Reptil nativo",
    summary: "Dos líneas sobre el lomo, un destello veloz entre hojas.",
    story:
      "La lagartija lemniscata aparece en los claros donde el sol toca el suelo. Alterna calor y refugio con precisión, midiendo el día desde su propio cuerpo. Bajo nuestros pasos existe un territorio térmico hecho de sombras, piedras y vegetación.",
    ecologicalRole:
      "Se alimenta principalmente de pequeños invertebrados y forma parte de la red trófica terrestre.",
    observation:
      "Su registro recuerda la importancia de conservar microhábitats y mantener piedras y refugios en su lugar.",
    images: [
      { src: asset("EDQ-06_fauna_lagartija_lemniscata.jpg"), alt: "Lagartija lemniscata en Quirilluca" }
    ]
  },
  {
    id: "culebra-cola-larga",
    name: "Culebra de cola larga",
    scientificName: "Philodryas chamissonis",
    kind: "Reptil endémico de Chile",
    summary: "Se desliza con sigilo por la continuidad del matorral.",
    story:
      "La culebra de cola larga encuentra refugio entre cobertura, piedras y claros. Su movimiento revela la continuidad secreta del hábitat. Es una pieza nativa que inspira distancia y respeto.",
    ecologicalRole:
      "Depredador terrestre que ayuda a regular poblaciones de pequeños vertebrados e invertebrados.",
    observation:
      "Ante un encuentro, la observación a distancia y el paso libre le permiten continuar su camino.",
    images: [
      { src: asset("EDQ-10_fauna_culebra_cola_larga.jpg"), alt: "Culebra de cola larga registrada en Quirilluca" }
    ]
  }
];
