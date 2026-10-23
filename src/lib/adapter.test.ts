import test from 'node:test';
import assert from 'node:assert/strict';
import { importFromOriginalRestaurantJson, exportToOriginalRestaurantJson } from './adapter';
import { GUTKOWSKINO_INITIAL_SITE } from '../data/gutkowskinoData';

test('importFromOriginalRestaurantJson maps all core areas correctly', () => {
  const rawInput = {
    meta: {
      title: 'Nuovo Titolo Ristorante',
      description: 'Descrizione importata',
      slug: 'nuovo-bistrot',
    },
    brand: {
      name: 'Bistrot del Porto',
      tagline: 'Cucina di mare',
    },
    hero: {
      badge: 'Bistrot Autentico',
      headline: 'Sapore di sale',
      ctaPrimary: 'Tavoli Liberi',
    },
    kitchen: {
      lead: 'La nostra selezione',
      categories: ['Antipasti', 'Primi'],
      dishes: [
        {
          id: 'd-test-1',
          name: 'Spaghetti ai Ricci',
          price: '€ 25',
          description: 'Ricci freschi appena pescati',
          category: 'Primi',
        },
      ],
    },
    info: {
      phone: '+39 0923 112233',
      address: 'Via Marina 1',
    },
  };

  const adapted = importFromOriginalRestaurantJson(rawInput, 'test-adapted-id');
  assert.equal(adapted.id, 'test-adapted-id');
  assert.equal(adapted.name, 'Bistrot del Porto');
  assert.equal(adapted.slug, 'nuovo-bistrot');
  assert.equal(adapted.seo.metaTitle, 'Nuovo Titolo Ristorante');
  assert.equal(adapted.contact.phone, '+39 0923 112233');

  const kitchenSec = adapted.sections.find((s) => s.type === 'kitchen');
  assert.ok(kitchenSec);
  assert.equal(kitchenSec?.data.dishes.length, 1);
  assert.equal(kitchenSec?.data.dishes[0].name, 'Spaghetti ai Ricci');
});

test('exportToOriginalRestaurantJson produces compatible structure', () => {
  const exported = exportToOriginalRestaurantJson(GUTKOWSKINO_INITIAL_SITE);
  assert.equal(exported.brand?.name, 'Gutkowskino');
  assert.equal(exported.meta?.slug, 'gutkowskino');
  assert.ok(exported.hero?.headline);
  assert.ok(exported.kitchen?.dishes && exported.kitchen.dishes.length > 0);
  assert.ok(exported.reviews?.items && exported.reviews.items.length > 0);
});
