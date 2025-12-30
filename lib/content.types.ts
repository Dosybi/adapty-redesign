/**
 * Типы для структурированного контента
 */

export interface MediaItem {
  src: string;
  alt: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface CTA {
  label: string;
  href: string;
}

export interface Header {
  nav: Link[];
  cta?: CTA;
}

export interface Hero {
  title: string;
  subtitle?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  media: MediaItem[];
}

export interface TrustedByItem {
  label: string;
  logoSrc: string;
}

export interface FeatureItem {
  title: string;
  text: string;
  bullets?: string[];
  media?: MediaItem[];
}

export interface FooterColumn {
  title: string;
  links: Link[];
}

export interface Footer {
  columns: FooterColumn[];
}

export interface Section {
  key: string;
  title?: string;
  items?: Array<TrustedByItem | FeatureItem | any>;
}

export interface HomeContent {
  header: Header;
  hero: Hero;
  sections: Section[];
  footer: Footer;
}
