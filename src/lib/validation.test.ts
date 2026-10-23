import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeSlug, validateSite, validateJsonImport } from './validation';
import { GUTKOWSKINO_INITIAL_SITE } from '../data/gutkowskinoData';

test('sanitizeSlug cleans text, accents and spacing', () => {
  assert.equal(sanitizeSlug('Osteria & Trattoria Del Sole'), 'osteria-trattoria-del-sole');
  assert.equal(sanitizeSlug('Villa Eolie---2026!'), 'villa-eolie-2026');
  assert.equal(sanitizeSlug('   Caffè Roma   '), 'caff-roma');
});

test('validateSite accepts valid site', () => {
  const result = validateSite(GUTKOWSKINO_INITIAL_SITE);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('validateSite detects invalid name, slug, and email', () => {
  const invalidSite = {
    ...GUTKOWSKINO_INITIAL_SITE,
    name: ' ',
    slug: 'Invalid Slug With Spaces!',
    contact: {
      ...GUTKOWSKINO_INITIAL_SITE.contact,
      email: 'not-an-email',
    },
  };
  const result = validateSite(invalidSite);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.slug);
  assert.ok(result.errors['contact.email']);
});

test('validateJsonImport handles valid and invalid payloads', () => {
  assert.equal(validateJsonImport(null).isValid, false);
  assert.equal(validateJsonImport('string').isValid, false);
  assert.equal(validateJsonImport(GUTKOWSKINO_INITIAL_SITE).isValid, true);

  const rawGutkowskino = {
    brand: { name: 'Gutkowskino' },
    hero: { headline: 'Il mare incontra la tavola' },
  };
  assert.equal(validateJsonImport(rawGutkowskino).isValid, true);
});
