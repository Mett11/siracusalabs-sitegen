import { TemplateDefinition } from '../types';

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'gutkowskino-editorial',
    name: 'Gutkowskino Editorial',
    tagline: 'Stile editoriale mediterraneo con composizioni asimmetriche, ricchezza tipografica e calore artigianale.',
    description: 'Ideale per osterie d’autore, bistrot, boutique retreat, cantine vinicole e botteghe d’artigianato. Include selezione interattiva dei piatti con crossfade fotografico, manifesto con numeri romani, galleria filtrabile con lightbox e gestione orari/prenotazioni.',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    supportedCategories: ['restaurant', 'hospitality', 'retail', 'services'],
    defaultTheme: {
      primaryColor: '#8C3823',
      secondaryColor: '#2D3E33',
      accentColor: '#D39E43',
      backgroundColor: '#FAF7F2',
      surfaceColor: '#FFFFFF',
      textColor: '#1F2421',
      textMutedColor: '#6B726C',
      fontHeading: 'editorial',
      fontBody: 'sans',
      borderRadius: 'sm',
      cardStyle: 'editorial-framed',
    },
    supportedSections: [
      'hero',
      'manifesto',
      'kitchen',
      'spaces',
      'gallery',
      'reviews',
      'services',
      'contact_info',
      'cta',
      'custom_component',
    ],
  },
  {
    id: 'atelier-minimal',
    name: 'Atelier Minimal & Studio',
    tagline: 'Design essenziale, griglia contemporanea e autorevolezza visiva per studi professionali e aziende d’eccellenza.',
    description: 'Progettato per studi legali, architetti, consulenti strategici, designer e agenzie di servizi. Focus su aree di pratica, team multidisciplinare, autorevolezza dei contenuti e fissaggio appuntamenti o preventivi.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    supportedCategories: ['professional', 'services', 'hospitality', 'retail'],
    defaultTheme: {
      primaryColor: '#1A2938',
      secondaryColor: '#4A607A',
      accentColor: '#C49751',
      backgroundColor: '#F8F9FA',
      surfaceColor: '#FFFFFF',
      textColor: '#1A1D20',
      textMutedColor: '#5F6872',
      fontHeading: 'display',
      fontBody: 'sans',
      borderRadius: 'sm',
      cardStyle: 'bordered',
    },
    supportedSections: [
      'hero',
      'manifesto',
      'services',
      'team',
      'reviews',
      'gallery',
      'contact_info',
      'cta',
      'custom_component',
    ],
  },
];

export function getTemplateById(templateId: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
}
