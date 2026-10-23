export type SiteCategory =
  | 'restaurant'
  | 'hospitality'
  | 'professional'
  | 'retail'
  | 'services';

export type PublicationStatus = 'draft' | 'published';

export type FontOption = 'editorial' | 'display' | 'sans';
export type CardStyleOption = 'minimal' | 'bordered' | 'elevated' | 'editorial-framed';
export type BorderRadiusOption = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ThemeTokens {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  fontHeading: FontOption;
  fontBody: 'sans' | 'serif';
  borderRadius: BorderRadiusOption;
  cardStyle: CardStyleOption;
}

export interface NavItem {
  id: string;
  label: string;
  targetSectionId: string;
  isExternal?: boolean;
  externalUrl?: string;
  order: number;
}

export interface BookingSettings {
  enabled: boolean;
  title: string;
  description: string;
  ctaText: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  externalBookingUrl?: string;
}

export interface DishItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  dietaryTags?: string[]; // e.g. "Pescato del giorno", "Vegetariano", "Senza glutine"
  winePairing?: string;
  highlighted?: boolean;
}

export interface SpaceItem {
  id: string;
  name: string;
  description: string;
  capacity: string;
  image: string;
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
}

export interface ReviewItem {
  id: string;
  author: string;
  source: string; // e.g. "Guida Michelin", "TripAdvisor", "Google", "La Repubblica"
  rating: number; // 1 to 5
  quote: string;
  date?: string;
  verified?: boolean;
}

export interface PillarItem {
  id: string;
  numeral: string; // e.g. "I", "II", "III"
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  priceTag?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface OpeningHourItem {
  dayLabel: string;
  hours: string;
  closed?: boolean;
}

export interface ContactInfo {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  openingHoursSummary: string;
  hoursSchedule: OpeningHourItem[];
  googleMapsUrl: string;
  mapEmbedUrl?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    tripadvisor?: string;
  };
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  keywords: string;
  canonicalUrl?: string;
}

export type CustomComponentLayout =
  | 'split-card'
  | 'feature-grid'
  | 'stats-bar'
  | 'banner-cta'
  | 'interactive-list'
  | 'timeline';

export interface CustomComponentItem {
  title: string;
  description: string;
  tag?: string;
  value?: string;
  image?: string;
}

export type ComponentScope = 'section' | 'card' | 'button';

export type VisualStyleType =
  | 'glassmorphism'
  | 'dark-luxury'
  | 'neo-brutalist'
  | 'editorial-minimal'
  | 'cyber-glow'
  | 'organic-warm';

export type MotionEffectType =
  | 'hover-lift'
  | 'glow-pulse'
  | 'shimmer-sweep'
  | 'scale-press'
  | 'border-beam'
  | 'none';

export interface CustomComponentData {
  id?: string;
  name: string;
  title: string;
  subtitle?: string;
  badge?: string;
  layoutType: CustomComponentLayout;
  componentScope?: ComponentScope;
  visualStyle?: VisualStyleType;
  motionEffect?: MotionEffectType;
  buttonVariant?: 'solid' | 'glass' | 'neon' | 'brutalist' | 'outline' | 'shimmer';
  buttonIcon?: string;
  cardVariant?: 'bento' | 'glass' | 'elevated' | 'brutalist' | 'minimal';
  customCss?: string;
  tailwindClasses?: string;
  accentColor?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
  sideImage?: string;
  sideImageCaption?: string;
  items: CustomComponentItem[];
  generatedWithModel?: string;
  generatedCategory?: string;
  createdAt?: string;
}

export interface GeminiModelOption {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  version?: string;
  supportedActions?: string[];
  isDefault?: boolean;
}

export type SectionType =
  | 'hero'
  | 'manifesto'
  | 'kitchen'
  | 'spaces'
  | 'gallery'
  | 'reviews'
  | 'services'
  | 'team'
  | 'faq'
  | 'contact_info'
  | 'cta'
  | 'custom_component';

export interface BaseSectionConfig {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  layoutVariant?: string;
}

export interface HeroSectionData {
  badge: string;
  headline: string; // supports <em>
  subheadline: string;
  primaryCtaText: string;
  primaryCtaAction: 'booking' | 'contact' | 'custom';
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  heroImage: string;
  heroImageCaption?: string;
  decorativeTag?: string;
}

export interface ManifestoSectionData {
  quote: string;
  quoteAuthor?: string;
  description: string;
  sideImage: string;
  sideImageCaption?: string;
  pillars: PillarItem[];
  signatureName?: string;
  signatureRole?: string;
}

export interface KitchenSectionData {
  leadText: string;
  categories: string[];
  dishes: DishItem[];
  menuPdfUrl?: string;
  noteText?: string;
}

export interface SpacesSectionData {
  leadText: string;
  spaces: SpaceItem[];
}

export interface GallerySectionData {
  leadText: string;
  categories: string[];
  items: GalleryItem[];
}

export interface ReviewsSectionData {
  leadText: string;
  averageScore?: string;
  totalReviewsCount?: string;
  items: ReviewItem[];
}

export interface ServicesSectionData {
  leadText: string;
  services: ServiceItem[];
}

export interface TeamSectionData {
  leadText: string;
  members: TeamMember[];
}

export interface FaqSectionData {
  leadText: string;
  faqs: FaqItem[];
}

export interface CtaSectionData {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonAction: 'booking' | 'contact' | 'url';
  buttonUrl?: string;
  backgroundImage?: string;
}

export type SectionDataMap = {
  hero: HeroSectionData;
  manifesto: ManifestoSectionData;
  kitchen: KitchenSectionData;
  spaces: SpacesSectionData;
  gallery: GallerySectionData;
  reviews: ReviewsSectionData;
  services: ServicesSectionData;
  team: TeamSectionData;
  faq: FaqSectionData;
  contact_info: ContactInfo;
  cta: CtaSectionData;
  custom_component: CustomComponentData;
};

export interface SectionConfig<T extends SectionType = any> extends BaseSectionConfig {
  type: T;
  data: any;
}

export interface BrandSettings {
  name: string;
  tagline: string;
  establishedYear?: string;
  logoUrl?: string;
  logoSvgIcon?: string;
  footerClaim?: string;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  category: SiteCategory;
  templateId: 'gutkowskino-editorial' | 'atelier-minimal';
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  theme: ThemeTokens;
  brand: BrandSettings;
  booking: BookingSettings;
  contact: ContactInfo;
  seo: SeoSettings;
  navigation: NavItem[];
  sections: SectionConfig[];
  hasUnsavedChanges?: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  thumbnail: string;
  supportedCategories: SiteCategory[];
  defaultTheme: ThemeTokens;
  supportedSections: SectionType[];
}
