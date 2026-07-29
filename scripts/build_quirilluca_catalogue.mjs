import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "public", "assets", "quirilluca", "catalogue");
const OUTPUT_JSON = path.join(ROOT, "src", "content", "quirilluca-catalogue.json");
const INAT_API = "https://api.inaturalist.org/v1";
const OPEN_LICENSES = new Set(["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"]);

const splitRows = (text) =>
  text
    .trim()
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [commonName, scientificName, evidence = "documented"] = row.split("|").map((value) => value.trim());
      return { commonName, scientificName, evidence };
    });

const birds = splitRows(`
Perdiz chilena|Nothoprocta perdicaria|field
Huala|Podiceps major|field
Codorniz|Callipepla californica|field
Pingüino de Humboldt|Spheniscus humboldti|field
Piquero común|Sula variegata|field
Yeco|Nannopterum brasilianum|field
Lile|Poikilocarbo gaimardi|literature
Guanay|Leucocarbo bougainvillii|field
Pelícano|Pelecanus thagus|field
Jote de cabeza colorada|Cathartes aura|field
Jote de cabeza negra|Coragyps atratus|field
Bailarín|Elanus leucurus|literature
Peuco|Parabuteo unicinctus|field
Aguilucho|Geranoaetus polyosoma|field
Chorlo nevado|Anarhynchus nivosus|literature
Pilpilén común|Haematopus palliatus|field
Pilpilén negro|Haematopus ater|field
Zarapito|Numenius phaeopus hudsonicus|field
Gaviota garuma|Leucophaeus modestus|field
Gaviota de Franklin|Leucophaeus pipixcan|literature
Gaviota dominicana|Larus dominicanus|field
Tortolita cuyana|Columbina picui|literature
Tórtola|Zenaida auriculata|field
Lechuza|Tyto alba|literature
Tucúquere|Bubo magellanicus|literature
Chuncho|Glaucidium nana|literature
Gallina ciega|Systellura longirostris|literature
Picaflor chico|Sephanoides sephaniodes|field
Picaflor gigante|Patagona gigas|field
Carpinterito|Dryobates lignarius|literature
Pitío|Colaptes pitius|field
Tiuque|Milvago chimango|field
Cernícalo|Falco sparverius|literature
Turca|Pteroptochos megapodius|literature
Tapaculo|Scelorchilus albicollis|literature
Churrín del norte|Scytalopus fuscus|field
Minero|Geositta cunicularia|field
Churrete|Cinclodes patagonicus|literature
Churrete costero|Cinclodes nigrofumosus|field
Rayadito|Aphrastura spinicauda|field
Tijeral|Leptasthenura aegithaloides|field
Canastero|Pseudasthenes humicola|field
Fío-fío|Elaenia albiceps|literature
Cachudito|Anairetes parulus|field
Mero|Agriornis lividus|field
Diucón|Pyrope pyrope|field
Rara|Phytotoma rara|field
Golondrina chilena|Tachycineta leucopyga|field
Chercán|Troglodytes aedon|field
Zorzal|Turdus falcklandii|field
Tenca|Mimus thenca|field
Cometocino de Gay|Geospizopsis gayi|field
Yal|Rhopospina fruticeti|literature
Platero|Rhopospina alaudina|field
Diuca|Diuca diuca|field
Chirigüe|Sicalis luteola|literature
Chincol|Zonotrichia capensis|field
Tordo|Curaeus curaeus|field
Mirlo|Molothrus bonariensis|literature
Loica|Leistes loyca|field
Jilguero|Spinus barbatus|field
Gorrión|Passer domesticus|literature
`);

const mammals = splitRows(`
Murciélago cola de ratón|Tadarida brasiliensis|literature
Llaca o marmosa|Thylamys elegans|field
Zorro chilla|Lycalopex griseus|field
Chungungo|Lontra felina|field
Quique|Galictis cuja|field
Cururo|Spalacopus cyanus|field
Degú común|Octodon degus|literature
Degú costino|Octodon lunatus|literature
Ratón lanudo común|Abrothrix longipilis|field
Ratón oliváceo|Abrothrix olivacea|field
Ratón colilargo|Oligoryzomys longicaudatus|literature
Ratón orejudo de Darwin|Phyllotis darwini|literature
Ratón chinchilla|Abrocoma bennettii|literature
Rata negra|Rattus rattus|literature
Liebre europea|Lepus europaeus|field
Conejo europeo|Oryctolagus cuniculus|field
`);

const reptiles = splitRows(`
Lagarto chileno|Liolaemus chiliensis|field
Lagarto de Zapallar|Liolaemus zapallarensis|field
Lagarto nítido|Liolaemus nitidus|literature
Lagartija lemniscata|Liolaemus lemniscatus|field
Lagartija de las paredes|Liolaemus tenuis|literature
Lagartija oscura|Liolaemus fuscus|field
Culebra de cola larga|Philodryas chamissonis|literature
`);

const plantNames = `
Adiantum thalictroides var. hirsutum
Blechnum cordatum
Azolla filiculoides
Equisetum bogotense
Acacia caven
Adenopeltis serrata
Adesmia sp.
Ambrosia chamissonis
Argemone subfusiformis
Anisomeria littoralis
Apium panul
Aristotelia chilensis
Astragalus berterianus
Azara celastrina
Azara serrata
Baccharis linearis
Baccharis macraei
Baccharis rhomboidalis
Baccharis salicifolia
Bahia ambrosioides
Beilschmiedia miersii
Berberis actinacantha
Blepharocalyx cruckshanksii
Calceolaria dentata
Capsella bursa-pastoris
Carduus nutans
Carpobrotus chilensis
Cestrum parqui
Chiropetalum tricuspidatum
Chorizanthe vaginata
Glebionis coronaria
Chusquea cumingii
Cissus striata
Cistanthe grandiflora
Citronella mucronata
Clarkia tenella
Erigeron bonariensis
Cristaria glaucophylla
Cryptocarya alba
Cynara cardunculus
Diplolepis menziesii
Erigeron fasciculatus
Escallonia pulverulenta
Eryngium paniculatum
Eucalyptus globulus
Ageratina glechonophylla
Ageratina salvia
Euphorbia peplus
Euphorbia portulacoides
Fabiana imbricata
Fuchsia lycioides
Fumaria capreolata
Galium aparine
Gamochaeta americana
Gamochaeta stachydifolia
Geranium core-core
Geranium robertianum
Pseudognaphalium viravira
Gochnatia foliolosa
Gratiola peruviana
Haplopappus foliosus
Hydrocotyle ranunculoides
Hydrocotyle verticillata
Hypochaeris scorzonerae
Kageneckia oblonga
Lathyrus hookeri
Lithraea caustica
Loasa sp.
Lobelia excelsa
Lobelia polyphylla
Luma chequen
Lycium chilense
Lythrum maritimum
Maytenus boaria
Mentha × piperita
Erythranthe glabrata
Myrceugenia exsucca
Myrceugenia obtusa
Myrceugenia ovata
Myrceugenia rufa
Nasturtium officinale
Eriosyce subgibbosa
Nolana crassulifolia
Nolana paradoxa
Noticastrum sericeum
Oenothera acaulis
Oenothera affinis
Oxalis megalorrhiza
Oxalis rosea
Peumus boldus
Plantago hispidula
Plantago lanceolata
Plantago major
Podanthus mitiqui
Polygonum aviculare
Pouteria splendens
Proustia pyrifolia
Pseudognaphalium gayanum
Quillaja saponaria
Ranunculus muricatus
Raphanus sativus
Retanilla ephedra
Retanilla trinervia
Rhaphithamnus spinosus
Ribes punctatum
Rubus ulmifolius
Rumex acetosella
Rumex conglomeratus
Sanicula crassicaulis
Schinus latifolius
Senna candolleana
Sicyos baderoa
Silybum marianum
Solanum maglia
Solanum nigrum
Solanum pinnatum
Sonchus asper
Sonchus oleraceus
Sonchus sp.
Sphaeralcea obtusiloba
Stachys grandidentata
Stellaria media
Stellaria sp.
Taraxacum officinale
Tessaria absinthioides
Torilis nodosa
Echinopsis chiloensis subsp. litoralis
Trichocline aurea
Tristerix verticillatus
Tropaeolum tricolor
Tweedia birostrata
Urtica dioica
Valeriana crispa
Verbascum virgatum
Veronica anagallis-aquatica
Agrostis gigantea
Aira caryophyllea
Alstroemeria ligtu
Anthoxanthum odoratum
Avena barbata
Avena fatua
Bomarea salsilla
Briza maxima
Bromus catharticus
Bromus hordeaceus
Bromus rigidus
Bromus scoparius
Bromus setifolius
Chloraea bletioides
Chloraea cristata
Cyperus eragrostis
Dioscorea sp.
Dioscorea bryoniifolia
Distichlis spicata
Gilliesia graminea
Holcus lanatus
Hordeum chilense
Lemna minor
Leucocoryne ixioides
Lolium multiflorum
Lolium temulentum
Melica violacea
Nassella neesiana
Nothoscordum gramineum
Paspalum distichum
Poaceae
Phycella bicolor
Piptochaetium stipoides
Poa annua
Poa bonariensis
Polypogon australis
Puya chilensis
Rhodophiala advena
Schoenoplectus pungens
Isolepis cernua
Sisyrinchium sp.
Trichopetalum plumosum
Vulpia bromoides
Vulpia myuros
`.trim().split("\n").map((value) => value.trim());

const flora = plantNames.map((scientificName) => ({
  commonName: "",
  scientificName,
  evidence: "unified"
}));
flora.unshift({
  commonName: "Flor del bigote",
  scientificName: "Bipinnula fimbriata",
  evidence: "current"
});

const localImages = new Map([
  ["Sula variegata", "/assets/quirilluca/LSQ-05_fauna_piqueros_y_pichones_01.jpg"],
  ["Cathartes aura", "/assets/quirilluca/LSQ-10_fauna_jote_cabeza_colorada_01.jpg"],
  ["Coragyps atratus", "/assets/quirilluca/LSQ-14_fauna_jote_cabeza_negra.jpg"],
  ["Cinclodes nigrofumosus", "/assets/quirilluca/LSQ-24_fauna_churrete_costero.jpg"],
  ["Liolaemus zapallarensis", "/assets/quirilluca/LSQ-22_fauna_lagarto_de_zapallar_01.jpg"],
  ["Liolaemus lemniscatus", "/assets/quirilluca/EDQ-06_fauna_lagartija_lemniscata.jpg"],
  ["Philodryas chamissonis", "/assets/quirilluca/EDQ-10_fauna_culebra_cola_larga.jpg"],
  ["Beilschmiedia miersii", "/assets/quirilluca/LSQ-11_flora_belloto_del_norte.jpg"],
  ["Quillaja saponaria", "/assets/quirilluca/EDQ-03_flora_quillay.jpg"],
  ["Calceolaria dentata", "/assets/quirilluca/EDQ-07_flora_capachito.jpg"],
  ["Tropaeolum tricolor", "/assets/quirilluca/EDQ-11_flora_soldadito.jpg"],
  ["Eryngium paniculatum", "/assets/quirilluca/LSQ-17_flora_chupalla_y_abejorro.jpg"],
  ["Rhodophiala advena", "/assets/quirilluca/LSQ-26_flora_ananuca_de_la_gloria_01.jpg"]
]);

const habitatFallback = {
  Ave: "/assets/quirilluca/LSQ-29_fauna_piqueros_y_pichones_05.jpg",
  Mamífero: "/assets/quirilluca/LSQ-21_flora_matorral_esclerofilo_03.jpg",
  Reptil: "/assets/quirilluca/LSQ-13_flora_matorral_esclerofilo_01.jpg",
  Flora: "/assets/quirilluca/LSQ-01_paisaje_acantilados_portada.jpg"
};

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "SalvemosQuirilluca/1.0 biodiversity-catalogue" }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response.json();
}

async function resolveTaxon(record) {
  const queryName = /\bsp\.$/i.test(record.scientificName)
    ? record.scientificName.split(/\s+/)[0]
    : record.scientificName;
  const url = `${INAT_API}/taxa?q=${encodeURIComponent(queryName)}&per_page=8&locale=es`;
  const payload = await fetchJson(url);
  const normalized = queryName.replace(/×/g, "").toLowerCase();
  const exact =
    payload.results.find((item) => item.name?.toLowerCase() === queryName.toLowerCase()) ??
    payload.results.find((item) => normalized.startsWith(item.name?.toLowerCase() ?? "")) ??
    payload.results[0];
  return exact ?? null;
}

function normalizePhoto(photo) {
  if (!photo || !OPEN_LICENSES.has((photo.license_code ?? "").toLowerCase())) return null;
  const url = photo.medium_url ?? photo.url?.replace("/square.", "/medium.");
  if (!url) return null;
  return {
    url,
    credit: photo.attribution ?? "Fotografía en iNaturalist",
    license: (photo.license_code ?? "").toUpperCase(),
    sourceUrl: photo.native_page_url ?? ""
  };
}

async function findOpenPhoto(taxon) {
  const fromTaxon = normalizePhoto(taxon?.default_photo);
  if (fromTaxon) return fromTaxon;
  if (!taxon?.id) return null;

  const params = new URLSearchParams({
    taxon_id: String(taxon.id),
    photos: "true",
    quality_grade: "research",
    photo_license: [...OPEN_LICENSES].join(","),
    per_page: "10",
    order_by: "votes"
  });
  const payload = await fetchJson(`${INAT_API}/observations?${params}`);
  for (const observation of payload.results ?? []) {
    for (const photo of observation.photos ?? []) {
      const normalized = normalizePhoto(photo);
      if (normalized) {
        normalized.sourceUrl = photo.native_page_url ?? `https://www.inaturalist.org/observations/${observation.id}`;
        return normalized;
      }
    }
  }
  return null;
}

async function downloadImage(photo, filename) {
  const response = await fetch(photo.url, {
    headers: { "user-agent": "SalvemosQuirilluca/1.0 biodiversity-catalogue" }
  });
  if (!response.ok) throw new Error(`Image HTTP ${response.status}`);
  const target = path.join(OUTPUT_DIR, filename);
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  return `/assets/quirilluca/catalogue/${filename}`;
}

function makeRecords(rows, group) {
  return rows.map((row) => ({
    ...row,
    group,
    source:
      row.evidence === "current"
        ? "Catastro de orquídea de Quirilluca (2024)"
        : row.evidence === "field"
        ? "Catastro in situ MMA, campañas 2014"
        : row.evidence === "literature"
          ? "Líneas base reunidas por MMA (2007–2013)"
          : "Catálogo florístico unificado MMA (2015)",
    sourceUrl:
      row.evidence === "current"
        ? "https://gbif-chile.mma.gob.cl/ipt/resource?r=censo_orquidea_2024aq"
        : "https://mma.gob.cl/wp-content/uploads/2015/06/INFORME-FINAL-A-QUIRILLUCA-VOL-1.pdf"
  }));
}

const records = [
  ...makeRecords(birds, "Ave"),
  ...makeRecords(mammals, "Mamífero"),
  ...makeRecords(reptiles, "Reptil"),
  ...makeRecords(flora, "Flora")
];

await mkdir(OUTPUT_DIR, { recursive: true });

async function enrichRecord(record) {
  const id = `${record.group.toLowerCase()}-${slugify(record.scientificName)}`;
  const localImage = localImages.get(record.scientificName);
  let taxon = null;
  let photo = null;
  let image = localImage ?? "";

  try {
    taxon = await resolveTaxon(record);
    if (!localImage) {
      photo = await findOpenPhoto(taxon);
      if (photo) image = await downloadImage(photo, `${slugify(record.scientificName)}.jpg`);
    }
  } catch (error) {
    console.warn(`catalogue-image-fallback ${record.scientificName}: ${error.message}`);
  }

  return {
    id,
    group: record.group,
    commonName: record.commonName || taxon?.preferred_common_name || record.scientificName,
    scientificName: record.scientificName,
    acceptedName: taxon?.name && taxon.name !== record.scientificName ? taxon.name : "",
    evidence: record.evidence,
    source: record.source,
    sourceUrl: record.sourceUrl,
    image: image || habitatFallback[record.group],
    imageSpecific: Boolean(image),
    imageCredit: localImage ? "Archivo visual Salvemos Quirilluca" : photo?.credit ?? "Paisaje de Quirilluca",
    imageLicense: localImage ? "Crédito en verificación" : photo?.license ?? "Archivo local",
    imageSourceUrl: localImage ? "" : photo?.sourceUrl ?? "",
    taxonUrl: taxon?.id ? `https://www.inaturalist.org/taxa/${taxon.id}` : ""
  };
}

const enriched = [];
const batchSize = 6;
for (let index = 0; index < records.length; index += batchSize) {
  const batch = records.slice(index, index + batchSize);
  enriched.push(...(await Promise.all(batch.map(enrichRecord))));
  console.log(`catalogue-progress ${Math.min(index + batch.length, records.length)}/${records.length}`);
  await sleep(120);
}

const output = {
  generatedAt: new Date().toISOString(),
  sources: [
    {
      label: "Diagnóstico de sitios de alto valor para la conservación — Acantilados de Quirilluca, volumen 1",
      url: "https://mma.gob.cl/wp-content/uploads/2015/06/INFORME-FINAL-A-QUIRILLUCA-VOL-1.pdf"
    },
    {
      label: "Guía para el visitante de Acantilados de la Quirilluca",
      url: "https://repositorioambiental.mma.gob.cl/wp-content/uploads/2019/09/Gui%CC%81a-Acantilados-de-la-Quirilluca-1.pdf"
    },
    {
      label: "Catastro de Bipinnula fimbriata en los Acantilados de Quirilluca",
      url: "https://gbif-chile.mma.gob.cl/ipt/resource?r=censo_orquidea_2024aq"
    }
  ],
  records: enriched
};

await writeFile(OUTPUT_JSON, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`catalogue-written ${OUTPUT_JSON}`);
