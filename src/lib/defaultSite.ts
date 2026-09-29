import type { SiteData } from '../types';

// Utilisé uniquement si la collection "vitrines" est vide (ex. l'admin a
// supprimé toutes les vitrines) — évite un plantage sur /guide et /404 en
// attendant qu'une vitrine soit recréée. La page d'accueil, elle, affiche un
// message dédié plutôt que ce générique (voir src/pages/index.astro).
export const fallbackSite: SiteData = {
  name: 'Ce site',
  handle: '',
  tagline: '',
  metaDescription: '',
  avatar: '/images/avatar-placeholder.svg',
  amazonTag: '',
  showPrices: false,
  socials: [],
  uiText: {
    legalBadge: 'Collaboration commerciale',
    legalDisclosure: '',
    ideaListsHeading: '',
    shoppablePhotosHeading: '',
    shoppablePhotosSubtitle: '',
    affiliateLinkLabel: '',
    priceHiddenCta: '',
    starterBadgeLabel: '',
    shoppableCta: '',
    footerGuideLinkText: 'Cadre légal & règles du programme Amazon Partenaires',
  },
};
