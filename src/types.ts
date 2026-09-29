export interface SiteData {
  name: string;
  handle: string;
  tagline: string;
  metaDescription: string;
  avatar: string;
  coverImage?: string;
  ogImage?: string;
  amazonTag: string;
  showPrices: boolean;
  uiText: {
    legalBadge: string;
    legalDisclosure: string;
    ideaListsHeading: string;
    shoppablePhotosHeading: string;
    shoppablePhotosSubtitle: string;
    affiliateLinkLabel: string;
    priceHiddenCta: string;
    starterBadgeLabel: string;
    shoppableCta: string;
    footerGuideLinkText: string;
  };
  socials: { platform: string; url: string }[];
}
