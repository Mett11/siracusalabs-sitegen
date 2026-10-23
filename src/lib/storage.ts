import { Site } from '../types';
import { GUTKOWSKINO_INITIAL_SITE } from '../data/gutkowskinoData';

const STORAGE_KEY_SITES = 'visual_cms_sites_v2';
const STORAGE_KEY_PUBLISHED = 'visual_cms_published_sites_v2';

export interface StorageStatus {
  backend: 'local' | 'firestore';
  synced: boolean;
  totalSites: number;
  lastSyncTime?: string;
}

class SiteRepository {
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    try {
      const existing = localStorage.getItem(STORAGE_KEY_SITES);
      if (!existing) {
        // Initialize with default Gutkowskino project
        const initialList: Site[] = [GUTKOWSKINO_INITIAL_SITE];
        localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(initialList));

        // Also save published copy of Gutkowskino
        const publishedMap: Record<string, Site> = {
          [GUTKOWSKINO_INITIAL_SITE.slug]: GUTKOWSKINO_INITIAL_SITE,
        };
        localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(publishedMap));
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('Storage initialization warning:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in storage listener:', e);
      }
    });
  }

  public getAllSites(): Site[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEY_SITES);
      if (data) {
        return JSON.parse(data) as Site[];
      }
    } catch (e) {
      console.error('Failed to load sites from storage:', e);
    }
    return [GUTKOWSKINO_INITIAL_SITE];
  }

  public getSiteById(id: string): Site | undefined {
    return this.getAllSites().find((s) => s.id === id);
  }

  public getSiteBySlug(slug: string): Site | undefined {
    return this.getAllSites().find((s) => s.slug === slug);
  }

  public getPublishedSiteBySlug(slug: string): Site | undefined {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEY_PUBLISHED);
      if (data) {
        const map = JSON.parse(data) as Record<string, Site>;
        if (map[slug] && map[slug].status === 'published') {
          return map[slug];
        }
      }
    } catch (e) {
      console.error('Failed to load published site:', e);
    }

    // Fallback: check all sites if published
    const draft = this.getSiteBySlug(slug);
    if (draft && draft.status === 'published') {
      return draft;
    }
    return undefined;
  }

  public saveSite(updatedSite: Site, isPublishedAction = false): void {
    this.init();
    const sites = this.getAllSites();
    const index = sites.findIndex((s) => s.id === updatedSite.id);

    const siteToStore: Site = {
      ...updatedSite,
      updatedAt: new Date().toISOString(),
      hasUnsavedChanges: !isPublishedAction,
    };

    if (isPublishedAction) {
      siteToStore.status = 'published';
      siteToStore.publishedAt = new Date().toISOString();
      siteToStore.hasUnsavedChanges = false;
    }

    if (index >= 0) {
      sites[index] = siteToStore;
    } else {
      sites.unshift(siteToStore);
    }

    try {
      localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(sites));

      if (isPublishedAction) {
        const publishedData = localStorage.getItem(STORAGE_KEY_PUBLISHED);
        const map: Record<string, Site> = publishedData ? JSON.parse(publishedData) : {};
        map[siteToStore.slug] = siteToStore;
        localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(map));
      }
      this.notify();
    } catch (e) {
      console.error('Failed to save site:', e);
      throw e;
    }
  }

  public unpublishSite(siteId: string): void {
    const site = this.getSiteById(siteId);
    if (!site) return;

    site.status = 'draft';
    this.saveSite(site, false);

    try {
      const publishedData = localStorage.getItem(STORAGE_KEY_PUBLISHED);
      if (publishedData) {
        const map: Record<string, Site> = JSON.parse(publishedData);
        delete map[site.slug];
        localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(map));
      }
      this.notify();
    } catch (e) {
      console.error('Failed to update published map on unpublish:', e);
    }
  }

  public duplicateSite(siteId: string): Site | undefined {
    const original = this.getSiteById(siteId);
    if (!original) return undefined;

    const copy: Site = JSON.parse(JSON.stringify(original));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    copy.id = `site-${Date.now()}-${randomSuffix}`;
    copy.name = `${original.name} (Copia)`;
    copy.slug = `${original.slug}-copia-${randomSuffix}`;
    copy.status = 'draft';
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    copy.publishedAt = undefined;
    copy.hasUnsavedChanges = true;

    this.saveSite(copy, false);
    return copy;
  }

  public deleteSite(siteId: string): boolean {
    this.init();
    let sites = this.getAllSites();
    const siteToDelete = sites.find((s) => s.id === siteId);
    if (!siteToDelete) return false;

    sites = sites.filter((s) => s.id !== siteId);

    try {
      localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(sites));

      const publishedData = localStorage.getItem(STORAGE_KEY_PUBLISHED);
      if (publishedData) {
        const map: Record<string, Site> = JSON.parse(publishedData);
        delete map[siteToDelete.slug];
        localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(map));
      }
      this.notify();
      return true;
    } catch (e) {
      console.error('Failed to delete site:', e);
      return false;
    }
  }

  public resetToDefault(): void {
    try {
      localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify([GUTKOWSKINO_INITIAL_SITE]));
      const publishedMap: Record<string, Site> = {
        [GUTKOWSKINO_INITIAL_SITE.slug]: GUTKOWSKINO_INITIAL_SITE,
      };
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(publishedMap));
      this.notify();
    } catch (e) {
      console.error('Failed to reset sites:', e);
    }
  }

  public getCustomComponents(): any[] {
    this.init();
    try {
      const data = localStorage.getItem('visual_cms_custom_components_v2');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load custom components:', e);
    }

    // Default starter catalog of modular custom components
    const defaultCatalog = [
      {
        id: 'comp-wine-tasting',
        name: 'Degustazioni & Cantina',
        title: 'Percorsi di Degustazione <em>tra Vigne e Calici</em>',
        subtitle: 'Un viaggio sensoriale guidato dal nostro sommelier tra le etichette storiche delle contrade etnee e dell’arcipelago.',
        badge: 'Esperienze Private • In Cantina',
        layoutType: 'split-card',
        primaryCtaText: 'Prenota una Degustazione',
        primaryCtaUrl: '#section-contact',
        sideImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
        sideImageCaption: 'La volta in conci di tufo e le grandi botti di rovere francese',
        items: [
          {
            title: 'I Terroir di Sicilia',
            description: 'Quattro calici monovarietali in abbinamento a formaggi a latte crudo delle Madonie.',
            tag: '4 Calici • 60 min',
            value: '€ 45 a persona',
            image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
          },
          {
            title: 'Riserva Nobile & Vecchie Annate',
            description: 'Sei cru storici introvabili con assaggi di salumi tipici di suino nero dei Nebrodi.',
            tag: 'Selezione Rara • 90 min',
            value: '€ 85 a persona',
            image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=600&q=80',
          },
        ],
      },
      {
        id: 'comp-events',
        name: 'Eventi & Musica dal Vivo',
        title: 'Note d’Autore & <em>Serate sul Mare</em>',
        subtitle: 'Musica jazz dal vivo al calasole, cene a quattro mani con chef ospiti e serate sotto la luna estiva.',
        badge: 'Calendario Eventi Speciali',
        layoutType: 'feature-grid',
        primaryCtaText: 'Riserva il tuo Posto',
        primaryCtaUrl: '#section-contact',
        items: [
          {
            title: 'Sunset Jazz & Bollicine',
            description: 'Ogni giovedì sera: quartetto acustico dal vivo sulla terrazza panoramica con calice di benvenuto.',
            tag: 'Tutti i Giovedì • ore 19:30',
            value: 'Cocktail & Live',
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
          },
          {
            title: 'La Notte della Brace',
            description: 'Grigliata a vista del grande pescato del giorno sulla legna di mandorlo con il maestro fuochista.',
            tag: 'Ogni Sabato Sera',
            value: 'Menu Dedicato',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
          },
        ],
      },
      {
        id: 'comp-stats',
        name: 'I Nostri Numeri d’Eccellenza',
        title: 'Quarant’anni di <em>Passione e Traguardi</em>',
        subtitle: 'Numeri che testimoniano il nostro legame indissolubile con il territorio, il mare e la qualità.',
        badge: 'I Nostri Risultati',
        layoutType: 'stats-bar',
        items: [
          { title: 'Anni di Storia', value: '42', description: 'Tre generazioni di dedizione autentica alla cucina di mare' },
          { title: 'Pescatori Artigianali', value: '14', description: 'Piccole barche che conferiscono quotidianamente il pescato' },
          { title: 'Etichette in Cantina', value: '380+', description: 'Vini vulcanici, naturali e grandi riserve del Sud' },
          { title: 'Ospiti Soddisfatti', value: '99.4%', description: 'Punteggio di gradimento certificato su oltre 1.200 recensioni' },
        ],
      },
      {
        id: 'comp-newsletter',
        name: 'Newsletter & Circolo Esclusivo',
        title: 'Entra nel nostro <em>Circolo Gastronomico</em>',
        subtitle: 'Ricevi in anteprima gli inviti alle cene speciali, le ricette segrete dello chef e uno sconto del 10% sul tuo prossimo tavolo.',
        badge: 'Club Privilegi • Iscrizione Gratuita',
        layoutType: 'banner-cta',
        primaryCtaText: 'Iscriviti alla Newsletter',
        primaryCtaUrl: '#section-contact',
        backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        items: [
          { title: 'Inviti Anticipati', description: 'Priorità assoluta di prenotazione sui tavoli vista tramonto.', tag: 'Benefit 01' },
          { title: 'Calice di Benvenuto', description: 'Uno spumante metodo classico dell’Etna offerto alla prima cena.', tag: 'Benefit 02' },
          { title: 'Ricette dello Chef', description: 'I segreti del couscous incocciato a mano inviati via email ogni stagione.', tag: 'Benefit 03' },
        ],
      },
    ];

    try {
      localStorage.setItem('visual_cms_custom_components_v2', JSON.stringify(defaultCatalog));
    } catch (e) {
      // ignore
    }
    return defaultCatalog;
  }

  public saveCustomComponent(component: any): void {
    this.init();
    const current = this.getCustomComponents();
    const existingIndex = current.findIndex((c) => c.id === component.id);
    if (existingIndex >= 0) {
      current[existingIndex] = component;
    } else {
      current.unshift(component);
    }
    try {
      localStorage.setItem('visual_cms_custom_components_v2', JSON.stringify(current));
      this.notify();
    } catch (e) {
      console.error('Failed to save custom component:', e);
    }
  }

  public deleteCustomComponent(id: string): void {
    this.init();
    const current = this.getCustomComponents().filter((c) => c.id !== id);
    try {
      localStorage.setItem('visual_cms_custom_components_v2', JSON.stringify(current));
      this.notify();
    } catch (e) {
      console.error('Failed to delete custom component:', e);
    }
  }

  public getStorageStatus(): StorageStatus {
    const sites = this.getAllSites();
    return {
      backend: 'local',
      synced: true,
      totalSites: sites.length,
      lastSyncTime: new Date().toLocaleTimeString('it-IT'),
    };
  }
}

export const siteRepository = new SiteRepository();
