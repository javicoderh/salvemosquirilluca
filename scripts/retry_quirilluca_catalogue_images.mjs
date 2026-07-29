import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CATALOGUE_PATH = path.join(ROOT, "src", "content", "quirilluca-catalogue.json");
const IMAGE_DIR = path.join(ROOT, "public", "assets", "quirilluca", "catalogue");
const API = "https://api.inaturalist.org/v1";
const OPEN_LICENSES = new Set(["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"]);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
    headers: { "user-agent": "SalvemosQuirilluca/1.0 biodiversity-catalogue" }
  });
  if (response.status === 429 && attempt < 5) {
    await wait(attempt * 3500);
    return fetchJson(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function normalizePhoto(photo) {
  const license = (photo?.license_code ?? "").toLowerCase();
  if (!photo || !OPEN_LICENSES.has(license)) return null;
  const url = photo.medium_url ?? photo.url?.replace("/square.", "/medium.");
  if (!url) return null;
  return {
    url,
    credit: photo.attribution ?? "Fotografía en iNaturalist",
    license: license.toUpperCase(),
    sourceUrl: photo.native_page_url ?? ""
  };
}

async function findTaxon(record) {
  const queryName = /\bsp\.$/i.test(record.scientificName)
    ? record.scientificName.split(/\s+/)[0]
    : record.scientificName;
  const payload = await fetchJson(
    `${API}/taxa?q=${encodeURIComponent(queryName)}&per_page=8&locale=es`
  );
  const normalized = queryName.replace(/×/g, "").toLowerCase();
  return (
    payload.results.find((item) => item.name?.toLowerCase() === queryName.toLowerCase()) ??
    payload.results.find((item) => normalized.startsWith(item.name?.toLowerCase() ?? "")) ??
    payload.results[0] ??
    null
  );
}

async function findPhoto(taxon) {
  const defaultPhoto = normalizePhoto(taxon?.default_photo);
  if (defaultPhoto) return defaultPhoto;
  if (!taxon?.id) return null;

  const params = new URLSearchParams({
    taxon_id: String(taxon.id),
    photos: "true",
    quality_grade: "research",
    photo_license: [...OPEN_LICENSES].join(","),
    per_page: "10",
    order_by: "votes"
  });
  const payload = await fetchJson(`${API}/observations?${params}`);
  for (const observation of payload.results ?? []) {
    for (const rawPhoto of observation.photos ?? []) {
      const photo = normalizePhoto(rawPhoto);
      if (photo) {
        photo.sourceUrl =
          rawPhoto.native_page_url ?? `https://www.inaturalist.org/observations/${observation.id}`;
        return photo;
      }
    }
  }
  return null;
}

async function downloadPhoto(photo, scientificName) {
  const response = await fetch(photo.url, {
    headers: { "user-agent": "SalvemosQuirilluca/1.0 biodiversity-catalogue" }
  });
  if (!response.ok) throw new Error(`Image HTTP ${response.status}`);
  const filename = `${slugify(scientificName)}.jpg`;
  await writeFile(path.join(IMAGE_DIR, filename), Buffer.from(await response.arrayBuffer()));
  return `/assets/quirilluca/catalogue/${filename}`;
}

const catalogue = JSON.parse(await readFile(CATALOGUE_PATH, "utf8"));
const pending = catalogue.records.filter((record) => !record.imageSpecific);
let recovered = 0;

for (const [index, record] of pending.entries()) {
  try {
    const taxon = await findTaxon(record);
    const photo = await findPhoto(taxon);
    if (photo) {
      record.image = await downloadPhoto(photo, record.scientificName);
      record.imageSpecific = true;
      record.imageCredit = photo.credit;
      record.imageLicense = photo.license;
      record.imageSourceUrl = photo.sourceUrl;
      record.taxonUrl = taxon?.id ? `https://www.inaturalist.org/taxa/${taxon.id}` : record.taxonUrl;
      if (taxon?.name && taxon.name !== record.scientificName) record.acceptedName = taxon.name;
      recovered += 1;
    }
  } catch (error) {
    console.warn(`catalogue-retry-fallback ${record.scientificName}: ${error.message}`);
  }

  if ((index + 1) % 10 === 0 || index + 1 === pending.length) {
    await writeFile(CATALOGUE_PATH, `${JSON.stringify(catalogue, null, 2)}\n`, "utf8");
    console.log(`catalogue-retry ${index + 1}/${pending.length}; recovered=${recovered}`);
  }
  await wait(1150);
}

console.log(`catalogue-retry-complete recovered=${recovered} pending=${pending.length - recovered}`);
