// Slug déterministe utilisé à la fois par les pages qui affichent les liens
// (ProductCard/ShoppablePhoto) et par la page /aller/[slug] qui les génère
// (getStaticPaths). Même fonction des deux côtés = jamais de désynchro.
export function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function productRedirectSlug(listId, title) {
  return `${slugify(listId)}--${slugify(title)}`;
}

export function hotspotRedirectSlug(photoId, title) {
  return `photo-${slugify(photoId)}--${slugify(title)}`;
}

// Identifiant stable d'une liste ou d'une photo nichée dans une vitrine
// (elles n'ont plus de fichier propre depuis le passage aux vitrines).
// L'index garantit l'unicité même si deux listes partagent le même titre.
export function nestedItemId(vitrineId, index, title) {
  return `${vitrineId}-${index}-${slugify(title)}`;
}
