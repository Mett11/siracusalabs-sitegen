import { Site, DishItem, ReviewItem, SpaceItem, GalleryItem, SectionConfig } from '../types';
import { GUTKOWSKINO_INITIAL_SITE } from '../data/gutkowskinoData';

export interface OriginalGutkowskinoJson {
  meta?: {
    title?: string;
    description?: string;
    lang?: string;
    ogImage?: string;
    keywords?: string;
    slug?: string;
  };
  brand?: {
    name?: string;
    tagline?: string;
    established?: string;
    claim?: string;
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
    };
  };
  booking?: {
    title?: string;
    description?: string;
    cta?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    url?: string;
  };
  hero?: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    image?: string;
    caption?: string;
    tag?: string;
  };
  manifesto?: {
    quote?: string;
    author?: string;
    description?: string;
    image?: string;
    signature?: string;
    role?: string;
    pillars?: Array<{ numeral?: string; title?: string; text?: string; description?: string }>;
  };
  kitchen?: {
    lead?: string;
    note?: string;
    categories?: string[];
    dishes?: Array<{
      id?: string;
      name?: string;
      category?: string;
      description?: string;
      price?: string;
      image?: string;
      tags?: string[];
      wine?: string;
      highlighted?: boolean;
    }>;
  };
  spaces?: {
    lead?: string;
    items?: Array<{
      id?: string;
      name?: string;
      description?: string;
      capacity?: string;
      image?: string;
      features?: string[];
    }>;
  };
  gallery?: {
    lead?: string;
    categories?: string[];
    images?: Array<{
      id?: string;
      title?: string;
      category?: string;
      url?: string;
      aspectRatio?: 'square' | 'wide' | 'tall';
    }>;
  };
  reviews?: {
    lead?: string;
    score?: string;
    total?: string;
    items?: Array<{
      id?: string;
      author?: string;
      source?: string;
      rating?: number;
      quote?: string;
      date?: string;
    }>;
  };
  info?: {
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    hoursSummary?: string;
    hours?: Array<{ day?: string; hours?: string; closed?: boolean }>;
    mapsUrl?: string;
    socials?: {
      instagram?: string;
      facebook?: string;
      tripadvisor?: string;
    };
  };
}

/**
 * Transforms an original restaurant.json format into the normalized Site model.
 */
export function importFromOriginalRestaurantJson(raw: OriginalGutkowskinoJson, baseId?: string): Site {
  const site: Site = JSON.parse(JSON.stringify(GUTKOWSKINO_INITIAL_SITE));

  if (baseId) {
    site.id = baseId;
  } else {
    site.id = `imported-${Date.now()}`;
  }

  // Meta
  if (raw.meta) {
    if (raw.meta.title) site.seo.metaTitle = raw.meta.title;
    if (raw.meta.description) site.seo.metaDescription = raw.meta.description;
    if (raw.meta.ogImage) site.seo.ogImage = raw.meta.ogImage;
    if (raw.meta.keywords) site.seo.keywords = raw.meta.keywords;
    if (raw.meta.slug) site.slug = raw.meta.slug;
  }

  // Brand
  if (raw.brand) {
    if (raw.brand.name) {
      site.brand.name = raw.brand.name;
      site.name = raw.brand.name;
    }
    if (raw.brand.tagline) site.brand.tagline = raw.brand.tagline;
    if (raw.brand.established) site.brand.establishedYear = raw.brand.established;
    if (raw.brand.claim) site.brand.footerClaim = raw.brand.claim;
    if (raw.brand.colors) {
      if (raw.brand.colors.primary) site.theme.primaryColor = raw.brand.colors.primary;
      if (raw.brand.colors.secondary) site.theme.secondaryColor = raw.brand.colors.secondary;
      if (raw.brand.colors.accent) site.theme.accentColor = raw.brand.colors.accent;
      if (raw.brand.colors.background) site.theme.backgroundColor = raw.brand.colors.background;
    }
  }

  // Booking
  if (raw.booking) {
    if (raw.booking.title) site.booking.title = raw.booking.title;
    if (raw.booking.description) site.booking.description = raw.booking.description;
    if (raw.booking.cta) site.booking.ctaText = raw.booking.cta;
    if (raw.booking.phone) site.booking.phone = raw.booking.phone;
    if (raw.booking.whatsapp) site.booking.whatsappNumber = raw.booking.whatsapp;
    if (raw.booking.email) site.booking.email = raw.booking.email;
    if (raw.booking.url) site.booking.externalBookingUrl = raw.booking.url;
  }

  // Info
  if (raw.info) {
    if (raw.info.address) site.contact.address = raw.info.address;
    if (raw.info.city) site.contact.city = raw.info.city;
    if (raw.info.postalCode) site.contact.postalCode = raw.info.postalCode;
    if (raw.info.phone) site.contact.phone = raw.info.phone;
    if (raw.info.email) site.contact.email = raw.info.email;
    if (raw.info.hoursSummary) site.contact.openingHoursSummary = raw.info.hoursSummary;
    if (raw.info.mapsUrl) site.contact.googleMapsUrl = raw.info.mapsUrl;
    if (raw.info.hours) {
      site.contact.hoursSchedule = raw.info.hours.map((h) => ({
        dayLabel: h.day || '',
        hours: h.hours || '',
        closed: h.closed,
      }));
    }
    if (raw.info.socials) {
      site.contact.socials = { ...site.contact.socials, ...raw.info.socials };
    }
  }

  // Sections
  const updatedSections: SectionConfig[] = site.sections.map((section) => {
    if (section.type === 'hero' && raw.hero) {
      return {
        ...section,
        data: {
          ...section.data,
          badge: raw.hero.badge ?? section.data.badge,
          headline: raw.hero.headline ?? section.data.headline,
          subheadline: raw.hero.subheadline ?? section.data.subheadline,
          primaryCtaText: raw.hero.ctaPrimary ?? section.data.primaryCtaText,
          secondaryCtaText: raw.hero.ctaSecondary ?? section.data.secondaryCtaText,
          heroImage: raw.hero.image ?? section.data.heroImage,
          heroImageCaption: raw.hero.caption ?? section.data.heroImageCaption,
          decorativeTag: raw.hero.tag ?? section.data.decorativeTag,
        },
      };
    }

    if (section.type === 'manifesto' && raw.manifesto) {
      return {
        ...section,
        data: {
          ...section.data,
          quote: raw.manifesto.quote ?? section.data.quote,
          quoteAuthor: raw.manifesto.author ?? section.data.quoteAuthor,
          description: raw.manifesto.description ?? section.data.description,
          sideImage: raw.manifesto.image ?? section.data.sideImage,
          signatureName: raw.manifesto.signature ?? section.data.signatureName,
          signatureRole: raw.manifesto.role ?? section.data.signatureRole,
          pillars: raw.manifesto.pillars
            ? raw.manifesto.pillars.map((p, idx) => ({
                id: `pil-imp-${idx}`,
                numeral: p.numeral || `0${idx + 1}`,
                title: p.title || '',
                description: p.description || p.text || '',
              }))
            : section.data.pillars,
        },
      };
    }

    if (section.type === 'kitchen' && raw.kitchen) {
      const dishes: DishItem[] = raw.kitchen.dishes
        ? raw.kitchen.dishes.map((d, idx) => ({
            id: d.id || `dish-imp-${idx}`,
            name: d.name || 'Piatto',
            category: d.category || 'Specialità',
            description: d.description || '',
            price: d.price || '',
            image: d.image || '',
            dietaryTags: d.tags || [],
            winePairing: d.wine,
            highlighted: d.highlighted,
          }))
        : section.data.dishes;

      return {
        ...section,
        data: {
          ...section.data,
          leadText: raw.kitchen.lead ?? section.data.leadText,
          noteText: raw.kitchen.note ?? section.data.noteText,
          categories: raw.kitchen.categories ?? section.data.categories,
          dishes,
        },
      };
    }

    if (section.type === 'spaces' && raw.spaces) {
      const spaces: SpaceItem[] = raw.spaces.items
        ? raw.spaces.items.map((s, idx) => ({
            id: s.id || `space-imp-${idx}`,
            name: s.name || 'Spazio',
            description: s.description || '',
            capacity: s.capacity || '',
            image: s.image || '',
            features: s.features || [],
          }))
        : section.data.spaces;

      return {
        ...section,
        data: {
          ...section.data,
          leadText: raw.spaces.lead ?? section.data.leadText,
          spaces,
        },
      };
    }

    if (section.type === 'gallery' && raw.gallery) {
      const items: GalleryItem[] = raw.gallery.images
        ? raw.gallery.images.map((g, idx) => ({
            id: g.id || `gal-imp-${idx}`,
            title: g.title || '',
            category: g.category || 'Tutti',
            imageUrl: g.url || '',
            aspectRatio: g.aspectRatio || 'square',
          }))
        : section.data.items;

      return {
        ...section,
        data: {
          ...section.data,
          leadText: raw.gallery.lead ?? section.data.leadText,
          categories: raw.gallery.categories ?? section.data.categories,
          items,
        },
      };
    }

    if (section.type === 'reviews' && raw.reviews) {
      const items: ReviewItem[] = raw.reviews.items
        ? raw.reviews.items.map((r, idx) => ({
            id: r.id || `rev-imp-${idx}`,
            author: r.author || 'Ospite',
            source: r.source || 'Recensione',
            rating: r.rating || 5,
            quote: r.quote || '',
            date: r.date,
            verified: true,
          }))
        : section.data.items;

      return {
        ...section,
        data: {
          ...section.data,
          leadText: raw.reviews.lead ?? section.data.leadText,
          averageScore: raw.reviews.score ?? section.data.averageScore,
          totalReviewsCount: raw.reviews.total ?? section.data.totalReviewsCount,
          items,
        },
      };
    }

    return section;
  });

  site.sections = updatedSections;
  site.updatedAt = new Date().toISOString();
  return site;
}

/**
 * Exports site into the legacy Gutkowskino JSON structure.
 */
export function exportToOriginalRestaurantJson(site: Site): OriginalGutkowskinoJson {
  const heroSec = site.sections.find((s): s is SectionConfig<'hero'> => s.type === 'hero');
  const manifestoSec = site.sections.find((s): s is SectionConfig<'manifesto'> => s.type === 'manifesto');
  const kitchenSec = site.sections.find((s): s is SectionConfig<'kitchen'> => s.type === 'kitchen');
  const spacesSec = site.sections.find((s): s is SectionConfig<'spaces'> => s.type === 'spaces');
  const gallerySec = site.sections.find((s): s is SectionConfig<'gallery'> => s.type === 'gallery');
  const reviewsSec = site.sections.find((s): s is SectionConfig<'reviews'> => s.type === 'reviews');

  return {
    meta: {
      title: site.seo.metaTitle,
      description: site.seo.metaDescription,
      ogImage: site.seo.ogImage,
      keywords: site.seo.keywords,
      slug: site.slug,
    },
    brand: {
      name: site.brand.name,
      tagline: site.brand.tagline,
      established: site.brand.establishedYear,
      claim: site.brand.footerClaim,
      colors: {
        primary: site.theme.primaryColor,
        secondary: site.theme.secondaryColor,
        accent: site.theme.accentColor,
        background: site.theme.backgroundColor,
      },
    },
    booking: {
      title: site.booking.title,
      description: site.booking.description,
      cta: site.booking.ctaText,
      phone: site.booking.phone,
      whatsapp: site.booking.whatsappNumber,
      email: site.booking.email,
      url: site.booking.externalBookingUrl,
    },
    hero: heroSec
      ? {
          badge: heroSec.data.badge,
          headline: heroSec.data.headline,
          subheadline: heroSec.data.subheadline,
          ctaPrimary: heroSec.data.primaryCtaText,
          ctaSecondary: heroSec.data.secondaryCtaText,
          image: heroSec.data.heroImage,
          caption: heroSec.data.heroImageCaption,
          tag: heroSec.data.decorativeTag,
        }
      : undefined,
    manifesto: manifestoSec
      ? {
          quote: manifestoSec.data.quote,
          author: manifestoSec.data.quoteAuthor,
          description: manifestoSec.data.description,
          image: manifestoSec.data.sideImage,
          signature: manifestoSec.data.signatureName,
          role: manifestoSec.data.signatureRole,
          pillars: (manifestoSec.data.pillars || []).map((p: any) => ({
            numeral: p.numeral,
            title: p.title,
            text: p.description,
          })),
        }
      : undefined,
    kitchen: kitchenSec
      ? {
          lead: kitchenSec.data.leadText,
          note: kitchenSec.data.noteText,
          categories: kitchenSec.data.categories,
          dishes: (kitchenSec.data.dishes || []).map((d: any) => ({
            id: d.id,
            name: d.name,
            category: d.category,
            description: d.description,
            price: d.price,
            image: d.image,
            tags: d.dietaryTags,
            wine: d.winePairing,
            highlighted: d.highlighted,
          })),
        }
      : undefined,
    spaces: spacesSec
      ? {
          lead: spacesSec.data.leadText,
          items: (spacesSec.data.spaces || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            capacity: s.capacity,
            image: s.image,
            features: s.features,
          })),
        }
      : undefined,
    gallery: gallerySec
      ? {
          lead: gallerySec.data.leadText,
          categories: gallerySec.data.categories,
          images: (gallerySec.data.items || []).map((g: any) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            url: g.imageUrl,
            aspectRatio: g.aspectRatio,
          })),
        }
      : undefined,
    reviews: reviewsSec
      ? {
          lead: reviewsSec.data.leadText,
          score: reviewsSec.data.averageScore,
          total: reviewsSec.data.totalReviewsCount,
          items: (reviewsSec.data.items || []).map((r: any) => ({
            id: r.id,
            author: r.author,
            source: r.source,
            rating: r.rating,
            quote: r.quote,
            date: r.date,
          })),
        }
      : undefined,
    info: {
      address: site.contact.address,
      city: site.contact.city,
      postalCode: site.contact.postalCode,
      phone: site.contact.phone,
      email: site.contact.email,
      hoursSummary: site.contact.openingHoursSummary,
      hours: site.contact.hoursSchedule.map((h) => ({
        day: h.dayLabel,
        hours: h.hours,
        closed: h.closed,
      })),
      mapsUrl: site.contact.googleMapsUrl,
      socials: site.contact.socials,
    },
  };
}
