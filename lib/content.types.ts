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

export interface Banner {
  mark: string;
  link: Link;
}

export interface Hero {
  banner?: Banner;
  title: string;
  subtitle?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  media: MediaItem[];
}

export interface TrustedByItem {
  label?: string;
  alt?: string;
  logoSrc: string;
}

export interface TrustedBy {
  title: string;
  items: TrustedByItem[];
}

export interface HelpItem {
  imageSrc: string;
  button: Link;
  bullets: string[];
}

export interface Help {
  title: string;
  items: HelpItem[];
}

export interface SlaMetric {
  amount: string;
  description: string;
}

export interface Sla {
  title: string;
  items: SlaMetric[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatarSrc: string;
  logoSrc: string;
}

export interface CodeSnippet {
  id: string;
  label: string;
  language: string;
  code: string;
}

export interface Code {
  title: string;
  description: string;
  button: Link;
  testimonial: Testimonial;
  snippets: CodeSnippet[];
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
  items?: Array<TrustedByItem | FeatureItem | Record<string, unknown>>;
}

export interface HomeContent {
  header: Header;
  hero: Hero;
  trustedBy?: TrustedBy;
  help?: Help;
  sla?: Sla;
  code?: Code;
  sections: Section[];
  footer: Footer;
}
