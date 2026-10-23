import { Site } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateSite(site: Partial<Site>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!site.name || site.name.trim().length === 0) {
    errors.name = 'Il nome del sito è obbligatorio.';
  } else if (site.name.trim().length < 2) {
    errors.name = 'Il nome del sito deve contenere almeno 2 caratteri.';
  }

  if (!site.slug || site.slug.trim().length === 0) {
    errors.slug = 'Lo slug URL è obbligatorio.';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug)) {
    errors.slug = 'Lo slug deve contenere solo lettere minuscole, numeri e trattini (es. mio-sito).';
  }

  if (!site.category) {
    errors.category = 'Seleziona una categoria valida.';
  }

  if (!site.templateId) {
    errors.templateId = 'Seleziona un template per il sito.';
  }

  if (site.brand && (!site.brand.name || site.brand.name.trim().length === 0)) {
    errors['brand.name'] = 'Il nome del brand visibile è obbligatorio.';
  }

  if (site.contact && site.contact.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(site.contact.email)) {
      errors['contact.email'] = 'Inserisci un indirizzo email valido.';
    }
  }

  if (site.sections && site.sections.length === 0) {
    errors.sections = 'Il sito deve contenere almeno una sezione attiva.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateJsonImport(parsed: unknown): { isValid: boolean; error?: string; site?: Site } {
  if (!parsed || typeof parsed !== 'object') {
    return { isValid: false, error: 'Il file JSON non contiene un oggetto valido.' };
  }

  const obj = parsed as Record<string, unknown>;

  // Check if it's already a full Site format
  if (obj.id && obj.name && obj.sections && Array.isArray(obj.sections)) {
    return { isValid: true, site: parsed as Site };
  }

  // Check if it's the raw restaurant.json format
  if (obj.brand && (obj.hero || obj.kitchen || obj.meta)) {
    return { isValid: true, error: undefined }; // Will be transformed by adapter
  }

  return {
    isValid: false,
    error: 'Il file JSON non rispetta né lo schema del CMS né il formato Gutkowskino originale.',
  };
}
