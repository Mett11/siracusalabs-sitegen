import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  X,
  Send,
  Loader2,
  Check,
  Plus,
  Eye,
  Trash2,
  Bookmark,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Cpu,
  Info,
  Zap,
  Code2,
  Copy,
  MousePointerClick,
  Palette,
  Activity,
  Box,
} from 'lucide-react';
import {
  CustomComponentData,
  CustomComponentLayout,
  ComponentScope,
  VisualStyleType,
  MotionEffectType,
  GeminiModelOption,
  Site,
  ThemeTokens,
} from '../../types';
import { siteRepository } from '../../lib/storage';
import { CustomComponentSection } from '../renderer/common/CustomComponentSection';

interface AiComponentAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSite?: Site;
  onInsertToSite?: (component: CustomComponentData) => void;
}

// Industry context profiles with distinct styling, colors, and default archetypes
const CONTEXT_PROFILES: Record<
  string,
  {
    name: string;
    icon: string;
    palette: string;
    recommendedStyle: VisualStyleType;
    recommendedMotion: MotionEffectType;
    description: string;
  }
> = {
  restaurant: {
    name: 'Ristorazione & Cucina d’Autore',
    icon: '🍷',
    palette: 'Borgogna profondo, oro spazzolato (#D4AF37), avorio caldo (#FAF7F2)',
    recommendedStyle: 'editorial-minimal',
    recommendedMotion: 'hover-lift',
    description: 'Estetica gastronomica ricercata, menu degustazione e calici con font serif prestigioso.',
  },
  hospitality: {
    name: 'B&B, Hotel & Luxury Resort',
    icon: '🏨',
    palette: 'Ardesia scura, champagne (#E8D5B5), verde bosco e bianco calce',
    recommendedStyle: 'glassmorphism',
    recommendedMotion: 'hover-lift',
    description: 'Accoglienza 5 stelle, suite panoramiche e trasparenze speculari rilassanti.',
  },
  professional: {
    name: 'Studio Legale, M&A & Finanza',
    icon: '⚖️',
    palette: 'Blu navy (#0F172A), pietra grafite, acciaio satinato e bianco puro',
    recommendedStyle: 'neo-brutalist',
    recommendedMotion: 'scale-press',
    description: 'Contrasti netti, ombre 3D rigide 4px e massima autorevolezza svizzera.',
  },
  tech: {
    name: 'Tech, AI & Piattaforme SaaS',
    icon: '💻',
    palette: 'Nero profondo (#09090B), ciano neon (#06B6D4), viola e indaco elettrico',
    recommendedStyle: 'cyber-glow',
    recommendedMotion: 'glow-pulse',
    description: 'Bento grid modulari, alone neon pulsante al buio e dettagli in monospace.',
  },
  wellness: {
    name: 'SPA, Benessere Olistico & Yoga',
    icon: '🌿',
    palette: 'Verde salvia (#84A98C), terracotta calda (#DDA15E), sabbia e lino',
    recommendedStyle: 'organic-warm',
    recommendedMotion: 'shimmer-sweep',
    description: 'Bordi morbidissimi a pillola, riflesso fluido dell’acqua e serenità zen.',
  },
  craft: {
    name: 'Bottega Artigiana & Haute Couture',
    icon: '🎨',
    palette: 'Cuoio toscano (#9C6644), ottone spazzolato e cartone avana',
    recommendedStyle: 'neo-brutalist',
    recommendedMotion: 'hover-lift',
    description: 'Cura sartoriale tangibile, timeline di bottega e dettagli fatti a mano.',
  },
};

// Curated inspiration prompts tailored to Category & Scope
const PROMPTS_BY_CONTEXT: Record<
  string,
  Record<ComponentScope, { label: string; prompt: string; style?: VisualStyleType; motion?: MotionEffectType }[]>
> = {
  restaurant: {
    button: [
      {
        label: '✨ CTA Luxury Oro Spazzolato',
        prompt: 'Bottone magnetico di lusso "Riserva Tavolo d’Autore" con finitura oro spazzolato, bordo cesellato ed elevazione tridimensionale al passaggio del mouse.',
        style: 'dark-luxury',
        motion: 'hover-lift',
      },
      {
        label: '🍷 Pulsante Sommelier Degustazione',
        prompt: 'Pulsante interattivo pillola "Percorso 6 Calici Rari" con icona calice, animazione elastica al click e badge di disponibilità serale limitata.',
        style: 'editorial-minimal',
        motion: 'scale-press',
      },
    ],
    card: [
      {
        label: '📖 Bento Card Chef’s Table',
        prompt: 'Card bento interattiva per l’esperienza Chef’s Table per soli 6 commensali: percorso di 9 portate, calice di benvenuto e vista diretta sulla brigata.',
        style: 'dark-luxury',
        motion: 'hover-lift',
      },
      {
        label: '🦪 Card Piatto Firma d’Autore',
        prompt: 'Card editoriale asimmetrica per il piatto firma: pescato del giorno alla brace con salsa agli agrumi, foto d’alta cucina e descrizione delle origini.',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
    ],
    section: [
      {
        label: '🕰️ Timeline Generazioni & Lievito Madre',
        prompt: 'Timeline cronologica a step: 1968 l’apertura del primo forno a legna, 1992 la ricerca sui grani antichi macinati a pietra, 2014 la stella verde per la sostenibilità, 2024 il nuovo laboratorio bioclimatico.',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
      {
        label: '📋 Listino Degustazioni con Prezzi',
        prompt: 'Listino interattivo dei percorsi di degustazione: Classico Territorio €45, Selezione Riserve €75, Grande Verticale delle Annate Rare €120 con pairing di 7 calici storici.',
        style: 'dark-luxury',
        motion: 'hover-lift',
      },
    ],
  },
  tech: {
    button: [
      {
        label: '🔮 Bottone Cyber Neon Glow',
        prompt: 'Pulsante cyber "Deploy to Edge Cluster" in stile dark terminale con alone neon ciano pulsante (@keyframes cyberPulse) e feedback tattile.',
        style: 'cyber-glow',
        motion: 'glow-pulse',
      },
      {
        label: '⚡ CTA Shimmer SaaS Accelerator',
        prompt: 'Pulsante ad alta conversione "Start 14-Day Pro Trial" con fascio di luce riflesso continuo a scorrimento diagonale e bordo ciano iridescente.',
        style: 'glassmorphism',
        motion: 'shimmer-sweep',
      },
    ],
    card: [
      {
        label: '💻 Bento Box Metriche Neurali',
        prompt: 'Card Bento widget scura per statistiche architettura: latenza sub-5ms, throughput 14.2k req/s, cifratura quantistica e badge 99.99% SLA.',
        style: 'cyber-glow',
        motion: 'border-beam',
      },
      {
        label: '🛡️ Card Sicurezza & Zero Trust',
        prompt: 'Widget di conformità enterprise: crittografia AES-256 GCM, certificazione SOC2 Type II e backup geograficamente replicato su 3 continenti.',
        style: 'cyber-glow',
        motion: 'hover-lift',
      },
    ],
    section: [
      {
        label: '🚀 Griglia Architettura Cloud Distribuita',
        prompt: 'Griglia ad alte prestazioni con 3 card tecnologiche: zero cold-start microservizi, routing Anycast globale su 280+ POPs e isolamento tenant multi-cloud.',
        style: 'cyber-glow',
        motion: 'glow-pulse',
      },
      {
        label: '📊 Barra Metriche Throughput & Benchmark',
        prompt: 'Barra statistiche con numeri d’impatto per una piattaforma tech: 4.2ms tempo di risposta, 1.2M query gestite, 99.99% disponibilità e 0 downtime.',
        style: 'cyber-glow',
        motion: 'hover-lift',
      },
    ],
  },
  hospitality: {
    button: [
      {
        label: '🥂 Bottone Glassmorphic Concierge',
        prompt: 'Pulsante frosted glass con sfondo semi-trasparente sfocato a 24px, bordo sottile argentato e bagliore soft "Riserva Penthouse Suite".',
        style: 'glassmorphism',
        motion: 'hover-lift',
      },
      {
        label: '🔑 CTA Riserva Esperienza Privata',
        prompt: 'Pulsante pillola scuro ed elegante "Verifica Disponibilità Suite" con micro-animazione al passaggio del mouse e icona chiave di camera dorata.',
        style: 'dark-luxury',
        motion: 'scale-press',
      },
    ],
    card: [
      {
        label: '🏔️ Card Suite Panoramica con Trasparenza',
        prompt: 'Card glassmorphism per la Skyview Master Suite: vetrata su vette alpine, idromassaggio all’aperto a 38°C, colazione biologica in camera e concierge h24.',
        style: 'glassmorphism',
        motion: 'hover-lift',
      },
      {
        label: '🌲 Card Chalet nel Bosco Privato',
        prompt: 'Card immersiva per il rifugio alpino con bio-sauna privata in legno di cirmolo, camino a legna e sentiero privato verso il lago.',
        style: 'dark-luxury',
        motion: 'hover-lift',
      },
    ],
    section: [
      {
        label: '🪟 Griglia I 4 Rifugi Esclusivi',
        prompt: 'Griglia 4 card suite di lusso: Penthouse Belvedere, Chalet Cirmolo con SPA privata, Suite Panoramica sulle Dolomiti e Loggia dei Larici.',
        style: 'glassmorphism',
        motion: 'hover-lift',
      },
      {
        label: '🛎️ Banner Esperienze di Lusso Esclusive',
        prompt: 'Banner a tutto schermo con fotografia maestosa: eliski guidato, cena romantica in rifugio stellato e percorso benessere notturno per coppie.',
        style: 'dark-luxury',
        motion: 'hover-lift',
      },
    ],
  },
  professional: {
    button: [
      {
        label: '⚡ Bottone Brutalist con Ombra 3D',
        prompt: 'Pulsante neo-brutalista giallo canarino ad altissimo contrasto con bordo nero 2px, ombra solida rigida da 5px e scatto meccanico al click.',
        style: 'neo-brutalist',
        motion: 'scale-press',
      },
      {
        label: '🛡️ CTA Parere Legale Riservato',
        prompt: 'Pulsante autorevole blu navy scuro con icona lucchetto di sicurezza e testo "Richiedi Parere Preliminare in 24h con NDA Immediato".',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
    ],
    card: [
      {
        label: '💼 Card Area di Pratica M&A Societario',
        prompt: 'Card professionale con bordi geometrici rigidi e badge di conformità: assistenza operazioni straordinarie di fusione societaria e due diligence patrimoniale.',
        style: 'neo-brutalist',
        motion: 'scale-press',
      },
      {
        label: '🏛️ Card Trust & Tutela Patrimoniale',
        prompt: 'Card consulenza strategica per famiglie imprenditoriali: passaggio generazionale d’impresa, patti di famiglia e pianificazione fiscale internazionale.',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
    ],
    section: [
      {
        label: '📊 Metriche e Cause Risolte dello Studio',
        prompt: 'Barra statistiche ad alta fiducia: 28 anni di esperienza, 1.450 operazioni societarie concluse, 18 avvocati cassazionisti, 96% accordi stragiudiziali.',
        style: 'neo-brutalist',
        motion: 'hover-lift',
      },
      {
        label: '⚖️ Griglia I Tre Pilastri Giuridici',
        prompt: 'Griglia a 3 colonne sulle aree di consulenza primaria: Diritto Societario & Finanza, Tutela della Proprietà Intellettuale & Brevetti, Contenzioso Arbitrale.',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
    ],
  },
  wellness: {
    button: [
      {
        label: '🌿 Bottone Pillola Soft Shimmer',
        prompt: 'Pulsante ultra-arrotondato verde salvia con riflesso di luce rilassante continuo a scorrimento e scritta "Prenota Rituale Rigenerante".',
        style: 'organic-warm',
        motion: 'shimmer-sweep',
      },
      {
        label: '🫧 CTA Idroterapia Termale Calda',
        prompt: 'Pulsante morbido color argilla calda con bordo sfumato e icona scintilla: "Accesso Esclusivo alla Vasca Aromatica".',
        style: 'organic-warm',
        motion: 'hover-lift',
      },
    ],
    card: [
      {
        label: '💆 Card Trattamento Signature al Pino Mugo',
        prompt: 'Card rilassante con angoli smussati e toni sabbia: massaggio olistico distensivo da 60 minuti con oli caldi biologici ed estratti alpini.',
        style: 'organic-warm',
        motion: 'hover-lift',
      },
      {
        label: '🧘 Card Percorso Rituale Sonoro Campane Tibetane',
        prompt: 'Card meditazione sonora e riallineamento energetico con campane tibetane in quarzo, tisana biologica alle erbe e sala aromatica privata.',
        style: 'organic-warm',
        motion: 'shimmer-sweep',
      },
    ],
    section: [
      {
        label: '📋 Listino Trattamenti SPA con Durata e Prezzi',
        prompt: 'Menu dei trattamenti benessere: Rituale Viso Botanico 50min €85, Massaggio Profondo Decontratturante 60min €95, Percorso Termale Coppia Privato €160.',
        style: 'organic-warm',
        motion: 'hover-lift',
      },
      {
        label: '🍃 Timeline I 4 Step del Percorso Detossinante',
        prompt: 'Percorso olistico a step: 1. Tisana depurativa agli agrumi, 2. Bagno di vapore al fieno alpino, 3. Scrub salino all’elicriso, 4. Immersione rinfrescante.',
        style: 'organic-warm',
        motion: 'hover-lift',
      },
    ],
  },
  craft: {
    button: [
      {
        label: '🪡 Bottone Sartoriale con Cucitura',
        prompt: 'Pulsante artigianale in cuoio scuro con micro-bordo a cucitura, finitura materica opaca e testo "Ordina Capi su Misura".',
        style: 'neo-brutalist',
        motion: 'scale-press',
      },
      {
        label: '🪵 CTA Visita la Bottega Storica',
        prompt: 'Pulsante tattile in ottone satinato con ombra rigida 3D e icona d’officina: "Prenota una Sessione al Banco di Lavoro".',
        style: 'neo-brutalist',
        motion: 'hover-lift',
      },
    ],
    card: [
      {
        label: '👜 Card Borsa in Cuoio Vegetale Toscano',
        prompt: 'Card di prodotto artigianale con dettagli sul pellame conciato al vegetale, cuciture a doppio ago cerato e timbro a fuoco d’autenticità.',
        style: 'neo-brutalist',
        motion: 'hover-lift',
      },
      {
        label: '🏺 Card Ceramica Smaltata a Mano',
        prompt: 'Card artistica per vaso in gres cotto a legna ad alta temperatura con texture materica e firma incisa dell’artigiano.',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
    ],
    section: [
      {
        label: '🕰️ Timeline Le Fasi del Metodo Artigiano',
        prompt: 'Timeline del processo produttivo: Scelta della materia prima a mano, Taglio sartoriale delle dime storiche, Assemblaggio con filo cerato, Lucidatura a cera.',
        style: 'neo-brutalist',
        motion: 'hover-lift',
      },
      {
        label: '🧵 Griglia Le 3 Collezioni d’Atelier',
        prompt: 'Griglia con 3 creazioni d’autore numerate a mano: Collezione Terra d’Otranto, Linea Essenziale Cuoio Nero e Capsule Sostenibile Rigenerata.',
        style: 'editorial-minimal',
        motion: 'hover-lift',
      },
    ],
  },
};

export const AiComponentAssistantModal: React.FC<AiComponentAssistantModalProps> = ({
  isOpen,
  onClose,
  currentSite,
  onInsertToSite,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'catalog'>('generate');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<string>(currentSite?.category || 'restaurant');
  const [componentScope, setComponentScope] = useState<ComponentScope>('section');
  const [visualStyle, setVisualStyle] = useState<VisualStyleType>('editorial-minimal');
  const [motionEffect, setMotionEffect] = useState<MotionEffectType>('hover-lift');
  const [previewSubTab, setPreviewSubTab] = useState<'visual' | 'code'>('visual');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [copiedCodeToast, setCopiedCodeToast] = useState(false);

  // Dynamic Google Gemini Models (fetched via GET /api/ai/models - not hardcoded)
  const [availableModels, setAvailableModels] = useState<GeminiModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  const [modelsSource, setModelsSource] = useState<string>('');
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [showModelDetails, setShowModelDetails] = useState<boolean>(false);

  // Generated component state
  const [generatedComponent, setGeneratedComponent] = useState<CustomComponentData | null>(null);
  const [generationSource, setGenerationSource] = useState<string | null>(null);

  // Stored catalog components
  const [storedComponents, setStoredComponents] = useState<any[]>([]);
  const [previewStoredComponent, setPreviewStoredComponent] = useState<CustomComponentData | null>(null);

  // When context category changes, adapt recommended style and motion
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const profile = CONTEXT_PROFILES[newCat];
    if (profile) {
      setVisualStyle(profile.recommendedStyle);
      setMotionEffect(profile.recommendedMotion);
    }
  };

  const fetchAvailableModels = async () => {
    setIsLoadingModels(true);
    setModelsError(null);
    try {
      const response = await fetch('/api/ai/models');
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        setModelsSource(data.source || 'google-api');
        if (!selectedModel || !data.models.some((m: GeminiModelOption) => m.id === selectedModel)) {
          setSelectedModel(data.defaultModel || data.models[0].id);
        }
      } else {
        throw new Error('Nessun modello restituito');
      }
    } catch (err: any) {
      console.warn('Errore recupero modelli Google:', err);
      setModelsError('Impossibile recuperare i modelli Google via GET.');
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCatalog();
      fetchAvailableModels();
      // Ensure defaults sync with active site category
      if (currentSite?.category && CONTEXT_PROFILES[currentSite.category]) {
        handleCategoryChange(currentSite.category);
      }
    }
  }, [isOpen]);

  const loadCatalog = () => {
    const list = siteRepository.getCustomComponents();
    setStoredComponents(list);
  };

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          category,
          componentScope,
          visualStyle,
          motionEffect,
          model: selectedModel,
          currentSiteTheme: currentSite?.theme,
        }),
      });

      if (!response.ok) {
        throw new Error(`Errore server: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.component) {
        setGeneratedComponent(data.component);
        setGenerationSource(data.source || selectedModel);
        showToast('Componente personalizzato generato con successo!');
      } else {
        throw new Error(data.error || 'Generazione fallita');
      }
    } catch (err: any) {
      console.error('Error generating component:', err);
      setError(err.message || 'Si è verificato un errore durante la generazione.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCatalog = (componentToSave: any) => {
    siteRepository.saveCustomComponent(componentToSave);
    loadCatalog();
    showToast(`"${componentToSave.name}" salvato nel catalogo CMS.`);
  };

  const handleDeleteFromCatalog = (id: string, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare il componente "${name}" dal catalogo?`)) {
      siteRepository.deleteCustomComponent(id);
      loadCatalog();
      if (previewStoredComponent && (previewStoredComponent as any).id === id) {
        setPreviewStoredComponent(null);
      }
      showToast('Componente rimosso dal catalogo.');
    }
  };

  const handleInsert = (componentToInsert: CustomComponentData) => {
    if (onInsertToSite) {
      onInsertToSite(componentToInsert);
      showToast(`Componente aggiunto alle sezioni del sito!`);
      onClose();
    }
  };

  const copyFullCode = () => {
    if (!generatedComponent) return;
    const codeSnippet = `/* ===================================================
 * Componente: ${generatedComponent.name}
 * Scope: ${generatedComponent.componentScope || 'section'}
 * Stile: ${generatedComponent.visualStyle || visualStyle}
 * Motion: ${generatedComponent.motionEffect || motionEffect}
 * =================================================== */

/* Tailwind Utility Classes: */
${generatedComponent.tailwindClasses || '/* Vedi template Tailwind */'}

/* Custom CSS / Keyframe Animations: */
${generatedComponent.customCss || '/* Nessun CSS custom addizionale */'}
`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeSnippet);
      setCopiedCodeToast(true);
      setTimeout(() => setCopiedCodeToast(false), 2200);
    }
  };

  const defaultTheme: ThemeTokens = currentSite?.theme || {
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
  };

  const activeContextProfile = CONTEXT_PROFILES[category] || CONTEXT_PROFILES.restaurant;
  const currentInspirationPrompts =
    PROMPTS_BY_CONTEXT[category]?.[componentScope] ||
    PROMPTS_BY_CONTEXT.restaurant[componentScope] ||
    [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <header className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  AI Component & UI Studio
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoadingModels ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                  {availableModels.find((m) => m.id === selectedModel)?.displayName || selectedModel}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Genera bottoni singoli, card bento e sezioni uniche con CSS personalizzato e motion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tabs */}
            <div className="flex bg-stone-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'generate'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Generatore UI</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('catalog');
                  loadCatalog();
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-stone-700" />
                <span>Catalogo Salvati ({storedComponents.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between shrink-0 animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {successToast}
            </span>
            <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'generate' ? (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Controls Box */}
              <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                {/* 1. Dynamic Gemini Model Bar */}
                <div className="bg-white p-3 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          Modello Google Gemini (Live GET)
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {availableModels.length} modelli
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      id="gemini-model-select"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="text-xs bg-white border border-stone-300 focus:border-stone-900 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium cursor-pointer shadow-2xs max-w-[240px] sm:max-w-[280px]"
                    >
                      {availableModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.displayName} ({m.id})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={fetchAvailableModels}
                      disabled={isLoadingModels}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 cursor-pointer"
                      title="Ricarica elenco modelli da Google"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingModels ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowModelDetails(!showModelDetails)}
                      className={`px-2 py-1 text-xs rounded-lg border cursor-pointer flex items-center gap-1 ${
                        showModelDetails ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Model details preview if expanded */}
                {showModelDetails && (
                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-stone-700 animate-fade-in space-y-1">
                    {(() => {
                      const cur = availableModels.find((m) => m.id === selectedModel);
                      if (!cur) return null;
                      return (
                        <>
                          <div className="flex items-center justify-between font-semibold">
                            <span>{cur.displayName}</span>
                            <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{cur.id}</span>
                          </div>
                          {cur.description && <p className="text-[11px] text-stone-600">{cur.description}</p>}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 2. THREE CORE SELECTORS: SCOPE, INDUSTRY CONTEXT, VISUAL STYLE & MOTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Scope Selector: Button vs Card vs Section */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200/90 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-amber-600" />
                      Tipo Componente
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setComponentScope('button')}
                        className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all text-center cursor-pointer ${
                          componentScope === 'button' ? 'bg-stone-900 text-amber-400 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        🔘 Bottone
                      </button>
                      <button
                        type="button"
                        onClick={() => setComponentScope('card')}
                        className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all text-center cursor-pointer ${
                          componentScope === 'card' ? 'bg-stone-900 text-amber-400 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        🪟 Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setComponentScope('section')}
                        className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all text-center cursor-pointer ${
                          componentScope === 'section' ? 'bg-stone-900 text-amber-400 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        🧩 Sezione
                      </button>
                    </div>
                  </div>

                  {/* Context / Sector Selector */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200/90 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>{activeContextProfile.icon}</span>
                      Contesto di Business
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 font-semibold cursor-pointer"
                    >
                      <option value="restaurant">🍷 Ristorazione & Cantine d’Autore</option>
                      <option value="hospitality">🏨 B&B, Hotel & Luxury Resort</option>
                      <option value="professional">⚖️ Studio Legale, M&A & Finanza</option>
                      <option value="tech">💻 Tech, AI & Piattaforme SaaS</option>
                      <option value="wellness">🌿 SPA, Benessere Olistico & Yoga</option>
                      <option value="craft">🎨 Bottega Artigiana & Haute Couture</option>
                    </select>
                  </div>

                  {/* Visual Style & Motion */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200/90 space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-purple-600" />
                      Stile & Motion CSS
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={visualStyle}
                        onChange={(e) => setVisualStyle(e.target.value as VisualStyleType)}
                        className="text-[11px] bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-stone-800 font-medium cursor-pointer"
                      >
                        <option value="glassmorphism">✨ Glassmorphism</option>
                        <option value="dark-luxury">👑 Dark Luxury</option>
                        <option value="neo-brutalist">⚡ Neo-Brutalist 3D</option>
                        <option value="editorial-minimal">📰 Editorial Minimal</option>
                        <option value="cyber-glow">🔮 Cyber Glow</option>
                        <option value="organic-warm">🌿 Organic Warm</option>
                      </select>

                      <select
                        value={motionEffect}
                        onChange={(e) => setMotionEffect(e.target.value as MotionEffectType)}
                        className="text-[11px] bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-stone-800 font-medium cursor-pointer"
                      >
                        <option value="hover-lift">🚀 Hover Lift</option>
                        <option value="glow-pulse">💡 Glow Pulse</option>
                        <option value="shimmer-sweep">✨ Shimmer Sweep</option>
                        <option value="scale-press">🎯 Scale Press</option>
                        <option value="border-beam">🌈 Border Beam</option>
                        <option value="none">⏹️ Nessun Motion</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Context Visual Identity Banner */}
                <div className="px-3.5 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{activeContextProfile.icon}</span>
                    <span className="font-semibold text-amber-950">
                      Profilo attivo: {activeContextProfile.name}
                    </span>
                    <span className="text-[11px] text-amber-800/80 hidden sm:inline">
                      • {activeContextProfile.palette}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                    Scope: {componentScope.toUpperCase()}
                  </span>
                </div>

                {/* 3. Prompt Input Form */}
                <form onSubmit={handleGenerate} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        componentScope === 'button'
                          ? `Es: Crea un bottone singolo per ${activeContextProfile.name} con micro-interazione al passaggio del mouse e copy persuasivo...`
                          : componentScope === 'card'
                          ? `Es: Crea una card bento interattiva con statistiche, badge e stile ${visualStyle}...`
                          : `Es: Crea una sezione completa (timeline o listino prezzi) per ${activeContextProfile.name}...`
                      }
                      className="w-full px-4 py-3 text-sm bg-white border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 rounded-xl resize-none pr-12 text-stone-900 shadow-2xs"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                      className="absolute right-3 bottom-3 p-2.5 bg-stone-900 text-amber-400 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer"
                      title="Genera componente con Gemini"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Context-Specific Suggestion Chips */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Suggerimenti specifici per {activeContextProfile.name} ({componentScope}):</span>
                      <span className="text-[10px] text-stone-400 font-sans">Clicca per applicare</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentInspirationPrompts.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPrompt(item.prompt);
                            if (item.style) setVisualStyle(item.style);
                            if (item.motion) setMotionEffect(item.motion);
                          }}
                          className="text-xs px-2.5 py-1.5 bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-lg text-stone-800 font-medium transition-all text-left cursor-pointer shadow-2xs"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800">✕</button>
                  </div>
                )}
              </div>

              {/* 4. Generated Component Review, Live Preview & Code Inspector */}
              {generatedComponent && (
                <div className="space-y-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {generatedComponent.componentScope || componentScope}
                        </span>
                        <h3 className="text-base font-bold text-stone-900">
                          {generatedComponent.name}
                        </h3>
                        <span className="text-xs text-stone-400 font-mono">
                          Stile: {generatedComponent.visualStyle || visualStyle}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                        <span>Modello LLM:</span>
                        <span className="font-mono text-stone-800 font-semibold bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-[11px]">
                          {generatedComponent.generatedWithModel || generationSource}
                        </span>
                        <span>•</span>
                        <span>Motion: {generatedComponent.motionEffect || motionEffect}</span>
                        {generatedComponent.items && (
                          <>
                            <span>•</span>
                            <span>{generatedComponent.items.length} elementi</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={copyFullCode}
                        className="px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copia codice CSS e Tailwind negli appunti"
                      >
                        {copiedCodeToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCodeToast ? 'Copiato!' : 'Copia CSS/Tailwind'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveToCatalog(generatedComponent)}
                        className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-stone-600" />
                        <span>Salva nel Catalogo</span>
                      </button>

                      {currentSite && onInsertToSite && (
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveToCatalog(generatedComponent);
                            handleInsert(generatedComponent);
                          }}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-amber-400" />
                          <span>Aggiungi al Sito</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sub-tabs: Anteprima Visuale vs Codice CSS / Tailwind */}
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewSubTab('visual')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          previewSubTab === 'visual'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Anteprima Interattiva</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewSubTab('code')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          previewSubTab === 'code'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Codice CSS & Classi Tailwind</span>
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-stone-500">
                      Scope attivo: {generatedComponent.componentScope || componentScope}
                    </div>
                  </div>

                  {/* Tab 1: Visual Interactive Preview */}
                  {previewSubTab === 'visual' ? (
                    <div className="rounded-2xl border border-stone-300 overflow-hidden shadow-inner bg-stone-100">
                      <div className="bg-stone-800 text-stone-300 px-4 py-2 text-xs flex items-center justify-between font-mono">
                        <span className="flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          Rendering in tempo reale con animazioni e stati hover
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {generatedComponent.componentScope === 'button'
                            ? 'Pulsante Standalone'
                            : generatedComponent.componentScope === 'card'
                            ? 'Card / Bento Widget'
                            : `Layout: ${generatedComponent.layoutType}`}
                        </span>
                      </div>
                      <div className="bg-white">
                        <CustomComponentSection
                          data={generatedComponent}
                          theme={defaultTheme}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Tab 2: Code & CSS Inspector */
                    <div className="rounded-2xl border border-stone-800 overflow-hidden bg-zinc-950 text-zinc-200 font-mono text-xs">
                      <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-cyan-400" />
                          CSS Scoped & Tailwind Utility Classes
                        </span>
                        <button
                          type="button"
                          onClick={copyFullCode}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCodeToast ? 'Copiato!' : 'Copia Tutto'}</span>
                        </button>
                      </div>
                      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1">
                            Tailwind CSS Utility Classes:
                          </div>
                          <pre className="p-3 bg-zinc-900/90 rounded-lg text-emerald-300 whitespace-pre-wrap leading-relaxed select-all">
                            {generatedComponent.tailwindClasses || '/* Nessuna classe Tailwind custom */'}
                          </pre>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">
                            Custom CSS / Keyframe Animations (@keyframes, glow, shadows):
                          </div>
                          <pre className="p-3 bg-zinc-900/90 rounded-lg text-amber-200 whitespace-pre-wrap leading-relaxed select-all">
                            {generatedComponent.customCss || '/* Nessun CSS speciale richiesto per questo modulo */'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* CATALOG OF STORED COMPONENTS */
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Componenti Personalizzati nel CMS
                  </h3>
                  <p className="text-xs text-stone-500">
                    Questi moduli sono stati creati con l'AI o salvati manualmente, e possono essere inseriti in qualsiasi sito.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('generate')}
                  className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Crea Nuovo con AI</span>
                </button>
              </div>

              {storedComponents.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                  <Layers className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-stone-700">Nessun componente salvato nel catalogo</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    Usa il generatore AI per creare subito il tuo primo pulsante, card o modulo personalizzato.
                  </p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg cursor-pointer"
                  >
                    Genera con AI
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {storedComponents.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-stone-900 transition-all shadow-2xs flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                            {comp.componentScope ? `${comp.componentScope.toUpperCase()} • ` : ''}{comp.layoutType}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                            {comp.generatedWithModel && (
                              <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {comp.generatedWithModel}
                              </span>
                            )}
                            {comp.items && <span>{comp.items.length} elementi</span>}
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">
                          {comp.name}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2">
                          {comp.subtitle || comp.title}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewStoredComponent(comp)}
                            className="px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Anteprima</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFromCatalog(comp.id, comp.name)}
                            className="p-1 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Elimina dal catalogo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {currentSite && onInsertToSite && (
                          <button
                            type="button"
                            onClick={() => handleInsert(comp)}
                            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                            <span>Aggiungi al Sito</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal for previewing a selected stored component */}
              {previewStoredComponent && (
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                      Anteprima: {previewStoredComponent.name}
                    </h4>
                    <button
                      onClick={() => setPreviewStoredComponent(null)}
                      className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      Chiudi anteprima
                    </button>
                  </div>
                  <div className="rounded-xl border border-stone-300 overflow-hidden shadow-inner bg-white">
                    <CustomComponentSection
                      data={previewStoredComponent}
                      theme={defaultTheme}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
