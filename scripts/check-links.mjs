// Vérifie que tous les liens affiliés (produits + pastilles) répondent bien.
// Usage : npm run check-links
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const LISTS_DIR = fileURLToPath(new URL('../src/content/lists/', import.meta.url));
const PHOTOS_DIR = fileURLToPath(new URL('../src/content/photos/', import.meta.url));

function collectYamlFiles(dirPath) {
  return readdirSync(dirPath)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .map((f) => join(dirPath, f));
}

// { url, source: "fichier > produit" }
const links = [];

function addProductLinks(products, filename, context) {
  for (const p of products ?? []) {
    if (p.affiliateUrl) links.push({ url: p.affiliateUrl, source: `${filename} > ${context} > ${p.title}` });
  }
}

for (const file of collectYamlFiles(LISTS_DIR)) {
  const data = load(readFileSync(file, 'utf8'));
  const filename = file.split(/[\\/]/).pop();
  if (!data) continue;
  addProductLinks(data.products, filename, data.title ?? '(sans titre)');
  for (const sub of data.subIdeas ?? []) {
    addProductLinks(sub.products, filename, sub.title);
  }
}

for (const file of collectYamlFiles(PHOTOS_DIR)) {
  const data = load(readFileSync(file, 'utf8'));
  const filename = file.split(/[\\/]/).pop();
  if (!data) continue;
  for (const h of data.hotspots ?? []) {
    if (h.affiliateUrl) links.push({ url: h.affiliateUrl, source: `${filename} > pastille > ${h.title}` });
  }
}

const placeholders = links.filter((l) => l.url.includes('REMPLACER'));
const toCheck = links.filter((l) => !l.url.includes('REMPLACER'));

console.log(`${links.length} lien(s) trouvé(s) — ${placeholders.length} placeholder(s) à compléter, ${toCheck.length} à vérifier en ligne.\n`);

const broken = [];
const invalid = [];

for (const link of toCheck) {
  let url;
  try {
    url = new URL(link.url);
  } catch {
    invalid.push(link);
    continue;
  }
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    if (!res.ok) broken.push({ ...link, status: res.status });
  } catch (e) {
    broken.push({ ...link, status: `erreur réseau (${e.message})` });
  }
}

if (placeholders.length > 0) {
  console.log('À COMPLÉTER (placeholders REMPLACER, normal en cours de rédaction) :');
  for (const l of placeholders) console.log(`  - ${l.source}\n    ${l.url}`);
  console.log();
}

if (invalid.length > 0) {
  console.log('LIENS INVALIDES (ne ressemblent pas à une URL) :');
  for (const l of invalid) console.log(`  - ${l.source}\n    ${l.url}`);
  console.log();
}

if (broken.length > 0) {
  console.log('LIENS CASSÉS (à corriger) :');
  for (const l of broken) console.log(`  - [${l.status}] ${l.source}\n    ${l.url}`);
  console.log();
}

const ok = toCheck.length - broken.length;
console.log(`Résumé : ${ok}/${toCheck.length} lien(s) réel(s) OK.`);

if (broken.length > 0 || invalid.length > 0) {
  process.exitCode = 1;
}
