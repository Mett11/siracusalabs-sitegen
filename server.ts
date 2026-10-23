import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: Dynamic GET of Google Gemini Models (reads directly from Google API)
app.get('/api/ai/models', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (aiClient) {
      const listPager = await aiClient.models.list();
      const rawModels: any[] = [];
      for await (const m of listPager) {
        rawModels.push(m);
      }

      // Filter models that support content generation and are relevant LLMs
      const filtered = rawModels
        .filter((m) => {
          const id = (m.name || '').replace(/^models\//, '');
          const supportsGenerate =
            m.supportedActions?.includes('generateContent') ||
            (m as any).supportedGenerationMethods?.includes('generateContent');
          // Exclude pure embeddings, audio-only, transcribe, or non-generative models
          const isExcluded =
            id.includes('embedding') ||
            id.includes('tts') ||
            id.includes('transcribe') ||
            id.includes('imagen') ||
            id.includes('lyria') ||
            id.includes('robotics');
          return supportsGenerate && !isExcluded;
        })
        .map((m) => {
          const id = (m.name || '').replace(/^models\//, '');
          return {
            id,
            name: m.name,
            displayName: m.displayName || id,
            description: m.description || '',
            inputTokenLimit: m.inputTokenLimit,
            outputTokenLimit: m.outputTokenLimit,
            version: m.version,
            supportedActions: m.supportedActions || [],
            isDefault: id === 'gemini-3.8-flash',
          };
        });

      if (filtered.length > 0) {
        // Sort so that gemini-3.8-flash, gemini-3.7-flash, gemini-2.5-flash appear near top
        filtered.sort((a, b) => {
          if (a.id === 'gemini-3.8-flash') return -1;
          if (b.id === 'gemini-3.8-flash') return 1;
          if (a.id.startsWith('gemini') && !b.id.startsWith('gemini')) return -1;
          if (!a.id.startsWith('gemini') && b.id.startsWith('gemini')) return 1;
          return a.displayName.localeCompare(b.displayName);
        });

        res.json({
          success: true,
          source: 'google-genai-api',
          count: filtered.length,
          defaultModel: filtered.some((m) => m.id === 'gemini-3.8-flash')
            ? 'gemini-3.8-flash'
            : filtered[0].id,
          models: filtered,
        });
        return;
      }
    }

    // Direct REST API query fallback if SDK listing is unavailable
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const restResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (restResp.ok) {
        const restData: any = await restResp.json();
        const modelsList = restData.models || [];
        const filtered = modelsList
          .filter((m: any) => {
            const id = (m.name || '').replace(/^models\//, '');
            const methods = m.supportedGenerationMethods || [];
            return (
              methods.includes('generateContent') &&
              !id.includes('embedding') &&
              !id.includes('tts') &&
              !id.includes('transcribe') &&
              !id.includes('imagen') &&
              !id.includes('lyria')
            );
          })
          .map((m: any) => ({
            id: (m.name || '').replace(/^models\//, ''),
            name: m.name,
            displayName: m.displayName || m.name,
            description: m.description,
            inputTokenLimit: m.inputTokenLimit,
            outputTokenLimit: m.outputTokenLimit,
            version: m.version,
            isDefault: (m.name || '').includes('gemini-3.8-flash'),
          }));

        if (filtered.length > 0) {
          res.json({
            success: true,
            source: 'google-rest-api',
            count: filtered.length,
            defaultModel: 'gemini-3.8-flash',
            models: filtered,
          });
          return;
        }
      }
    }

    // Resilient offline default fallback
    res.json({
      success: true,
      source: 'offline-catalog',
      count: 3,
      defaultModel: 'gemini-3.8-flash',
      models: [
        {
          id: 'gemini-3.8-flash',
          name: 'models/gemini-3.8-flash',
          displayName: 'Gemini 3.8 Flash',
          description: 'Modello Google Gemini ad altissima velocità e precisione con supporto a JSON strutturato.',
          isDefault: true,
        },
        {
          id: 'gemini-2.5-flash',
          name: 'models/gemini-2.5-flash',
          displayName: 'Gemini 2.5 Flash',
          description: 'Modello bilanciato per generazione rapida e reattiva.',
          isDefault: false,
        },
        {
          id: 'gemini-2.5-pro',
          name: 'models/gemini-2.5-pro',
          displayName: 'Gemini 2.5 Pro',
          description: 'Modello avanzato di Google per ragionamento e architettura di layout complessi.',
          isDefault: false,
        },
      ],
    });
  } catch (err: any) {
    console.error('Error in /api/ai/models:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Errore nel recupero modelli da Google',
      models: [],
    });
  }
});

// API Route: AI Generate Component (Supports Buttons, Standalone Cards, Bento Widgets, and Full Sections with CSS & Motion)
app.post('/api/ai/generate-component', async (req: Request, res: Response): Promise<void> => {
  const {
    prompt,
    category = 'restaurant',
    componentScope = 'section', // 'section' | 'card' | 'button'
    visualStyle = 'editorial-minimal', // 'glassmorphism' | 'dark-luxury' | 'neo-brutalist' | 'editorial-minimal' | 'cyber-glow' | 'organic-warm'
    motionEffect = 'hover-lift', // 'hover-lift' | 'glow-pulse' | 'shimmer-sweep' | 'scale-press' | 'border-beam' | 'none'
    currentSiteTheme,
    model,
  } = req.body;

  const selectedModel = typeof model === 'string' && model.trim() ? model.trim() : 'gemini-3.8-flash';

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Il parametro prompt è obbligatorio.' });
    return;
  }

  // Detect explicit scope from user prompt if specified
  const lowerPrompt = prompt.toLowerCase();
  let effectiveScope = componentScope;
  if (lowerPrompt.includes('bottone') || lowerPrompt.includes('pulsante') || lowerPrompt.includes('button') || lowerPrompt.includes('cta singol')) {
    effectiveScope = 'button';
  } else if (lowerPrompt.includes('card singol') || lowerPrompt.includes('widget') || lowerPrompt.includes('bento card') || lowerPrompt.includes('tessera')) {
    effectiveScope = 'card';
  }

  // Determine contextual styling guidance
  const contextAestheticMap: Record<string, { palette: string; tone: string; fonts: string; defaultStyle: string }> = {
    restaurant: {
      palette: 'Borgogna profondo, oro spazzolato (#D4AF37), onice e avorio caldo (#FAF7F2)',
      tone: 'Gourmet, accattivante, sensoriale, tradizione nobile e convivialità d autore',
      fonts: 'Serif elegante e sans-serif geometrico d autore',
      defaultStyle: 'editorial-minimal',
    },
    hospitality: {
      palette: 'Verde smeraldo, champagne (#E8D5B5), ardesia scura e bianco calce',
      tone: 'Rilassamento esclusivo, privacy, comfort di lusso e accoglienza a 5 stelle',
      fonts: 'Serif di lusso e sans-serif leggero con ampie spaziature',
      defaultStyle: 'dark-luxury',
    },
    professional: {
      palette: 'Blu navy profondo (#0F172A), grigio pietra, acciaio satinato e bianco puro',
      tone: 'Autorevole, rigoroso, orientato ai risultati e alla massima trasparenza',
      fonts: 'Tipografia svizzera rigorosa ad alta leggibilità',
      defaultStyle: 'neo-brutalist',
    },
    tech: {
      palette: 'Nero profondo (#09090B), ciano neon (#06B6D4), indaco elettrico (#6366F1) e viola',
      tone: 'Futuristico, ad alte prestazioni, data-driven, scalabile e innovativo',
      fonts: 'Inter contemporaneo con dettagli e tag in monospace (JetBrains Mono)',
      defaultStyle: 'cyber-glow',
    },
    wellness: {
      palette: 'Verde salvia organico (#84A98C), terracotta calda (#DDA15E), sabbia e lino',
      tone: 'Olistico, rilassante, armonioso, rigenerante e sostenibile',
      fonts: 'Caratteri dalle curve morbide e accoglienti',
      defaultStyle: 'organic-warm',
    },
    craft: {
      palette: 'Cuoio toscano (#9C6644), ottone vivo, cartone avana e nero inchiostro',
      tone: 'Fatto a mano, materia prima sincera, cura sartoriale e tracciabilità',
      fonts: 'Tipografia editoriale artigiana con numeri proporzionali',
      defaultStyle: 'neo-brutalist',
    },
  };

  const currentContext = contextAestheticMap[category] || contextAestheticMap.restaurant;

  // If Gemini API client is available and key is configured
  if (aiClient) {
    try {
      const systemInstruction = `Sei un Creative Technologist e Principal Design Systems Engineer specializzato in Tailwind CSS, micro-interazioni CSS, motion design e UI di alta classe.
Il tuo compito è generare la struttura JSON di un componente web distintivo, evitando ASSOLUTAMENTE layout generici o ripetitivi.

TIPO DI COMPONENTE RICHIESTO: "${effectiveScope.toUpperCase()}"
- Se scope è "button": Genera un singolo pulsante interattivo o micro-CTA ad altissimo impatto estetico. Fornisci 'buttonText', 'buttonVariant' ('solid' | 'glass' | 'neon' | 'brutalist' | 'outline' | 'shimmer'), 'motionEffect', 'tailwindClasses', e 'customCss' (con @keyframes personalizzati, glow, ombre 3D o riflessi animati).
- Se scope è "card": Genera una card standalone o bento widget (es. card prodotto, card statistica/metrica con badge, card recensione o card interattiva con tilt/hover). Fornisci 'cardVariant' ('bento' | 'glass' | 'elevated' | 'brutalist' | 'minimal'), 'customCss' e 'tailwindClasses'.
- Se scope è "section": Genera una sezione completa d autore scegliendo il layout migliore tra: 'timeline' (tappe cronologiche), 'interactive-list' (menu/prezzi dettagliati), 'split-card' (asimmetrico), 'stats-bar' (metriche d impatto), 'banner-cta' o 'feature-grid'.

CONTESTO DI BUSINESS: "${category}"
- Identità visiva: ${currentContext.palette}
- Tono e vocabolario: ${currentContext.tone}
- Tipografia: ${currentContext.fonts}
- Stile visivo desiderato: "${visualStyle}" (scegli tra glassmorphism, dark-luxury, neo-brutalist, editorial-minimal, cyber-glow, organic-warm)
- Effetto motion richiesto: "${motionEffect}" (scegli tra hover-lift, glow-pulse, shimmer-sweep, scale-press, border-beam)

Genera codice Tailwind e CSS avanzato (ad es. animazioni shimmer, border gradient beam, ombre 3D offset, backdrop-filter, bagliori).`;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout chiamata Gemini API dopo 20s')), 20000)
      );

      const generatePromise = aiClient.models.generateContent({
        model: selectedModel,
        contents: `Richiesta: "${prompt}".
Tipo componente: "${effectiveScope}".
Settore: "${category}".
Stile visivo: "${visualStyle}".
Effetto motion: "${motionEffect}".
Genera un componente visivamente unico con CSS personalizzato e classi Tailwind che riflettano profondamente questo settore.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Nome identificativo del componente' },
              title: { type: Type.STRING, description: 'Titolo o claim principale' },
              subtitle: { type: Type.STRING, description: 'Sottotitolo o spiegazione tecnica/descrittiva' },
              badge: { type: Type.STRING, description: 'Badge di categoria o micro-tag' },
              componentScope: { type: Type.STRING, description: 'button, card, o section' },
              layoutType: { type: Type.STRING, description: 'feature-grid, split-card, stats-bar, banner-cta, interactive-list, timeline' },
              visualStyle: { type: Type.STRING, description: 'glassmorphism, dark-luxury, neo-brutalist, editorial-minimal, cyber-glow, organic-warm' },
              motionEffect: { type: Type.STRING, description: 'hover-lift, glow-pulse, shimmer-sweep, scale-press, border-beam, none' },
              buttonVariant: { type: Type.STRING, description: 'solid, glass, neon, brutalist, outline, shimmer' },
              buttonIcon: { type: Type.STRING, description: 'Nome icona o freccia (es. ArrowRight, Sparkles, Zap, Lock)' },
              cardVariant: { type: Type.STRING, description: 'bento, glass, elevated, brutalist, minimal' },
              accentColor: { type: Type.STRING, description: 'Colore esadecimale principale' },
              tailwindClasses: { type: Type.STRING, description: 'Classi Tailwind per lo styling' },
              customCss: { type: Type.STRING, description: 'CSS scoped con animazioni keyframes, hover states o ombre speciali' },
              primaryCtaText: { type: Type.STRING, description: 'Testo del pulsante' },
              primaryCtaUrl: { type: Type.STRING, description: 'Link o anchor CTA' },
              secondaryCtaText: { type: Type.STRING },
              secondaryCtaUrl: { type: Type.STRING },
              backgroundImage: { type: Type.STRING },
              sideImage: { type: Type.STRING },
              sideImageCaption: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tag: { type: Type.STRING },
                    value: { type: Type.STRING },
                    image: { type: Type.STRING },
                  },
                  required: ['title', 'description'],
                },
              },
            },
            required: ['name', 'title', 'componentScope', 'layoutType', 'visualStyle', 'motionEffect', 'items'],
          },
        },
      });

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text?.trim() || '{}';
      const parsedData = JSON.parse(responseText);

      const resolvedScope = parsedData.componentScope || effectiveScope;
      const resolvedStyle = parsedData.visualStyle || visualStyle;
      const resolvedMotion = parsedData.motionEffect || motionEffect;

      // Provide high-class CSS keyframes if LLM left customCss blank
      let finalCustomCss = parsedData.customCss;
      if (!finalCustomCss || !finalCustomCss.trim()) {
        if (resolvedStyle === 'cyber-glow') {
          finalCustomCss = `@keyframes cyberPulse {\n  0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.4), inset 0 0 15px rgba(6,182,212,0.2); }\n  50% { box-shadow: 0 0 35px rgba(6,182,212,0.8), inset 0 0 25px rgba(6,182,212,0.4); }\n}\n.btn-cyber-interactive {\n  animation: cyberPulse 3s infinite ease-in-out;\n  backdrop-filter: blur(12px);\n}`;
        } else if (resolvedStyle === 'neo-brutalist') {
          finalCustomCss = `.btn-brutalist-authority {\n  box-shadow: 5px 5px 0px #09090b;\n  letter-spacing: 0.08em;\n}`;
        } else if (resolvedStyle === 'organic-warm' || resolvedMotion === 'shimmer-sweep') {
          finalCustomCss = `@keyframes calmShimmer {\n  0% { transform: translateX(-150%) skewX(-20deg); }\n  100% { transform: translateX(250%) skewX(-20deg); }\n}\n.btn-organic-shimmer::after {\n  content: '';\n  position: absolute;\n  top: 0; left: 0; width: 60%; height: 100%;\n  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);\n  animation: calmShimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);\n}`;
        } else if (resolvedStyle === 'dark-luxury') {
          finalCustomCss = `.btn-luxury-magnetic {\n  letter-spacing: 0.12em;\n  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n}`;
        }
      }

      res.json({
        success: true,
        source: selectedModel,
        component: {
          id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          ...parsedData,
          componentScope: resolvedScope,
          visualStyle: resolvedStyle,
          motionEffect: resolvedMotion,
          customCss: finalCustomCss || '',
          generatedCategory: category,
          createdAt: new Date().toISOString(),
          generatedWithModel: selectedModel,
        },
      });
      return;
    } catch (apiError: any) {
      console.warn('Gemini API call failed, using intelligent semantic generator fallback:', apiError.message);
      // Fall through to fallback generator
    }
  }

  // Intelligent Semantic & Context-Driven Fallback Generator
  // Tailored to effectiveScope ('button' | 'card' | 'section') and category ('tech' | 'restaurant' | 'hospitality' | 'professional' | 'wellness' | 'craft')
  let generatedComponent: any;

  if (effectiveScope === 'button') {
    if (category === 'tech') {
      generatedComponent = {
        name: 'Cyber Glow Button',
        title: 'Deploy to Neural Edge',
        subtitle: 'Pulsante interattivo ad alte prestazioni con alone neon pulsante e feedback tattile.',
        badge: 'UI Micro-Interaction • v2.4',
        componentScope: 'button',
        layoutType: 'banner-cta',
        visualStyle: 'cyber-glow',
        motionEffect: 'glow-pulse',
        buttonVariant: 'neon',
        buttonIcon: 'Zap',
        primaryCtaText: prompt.slice(0, 36) || 'Deploy Microservice',
        primaryCtaUrl: '#deploy',
        accentColor: '#06b6d4',
        tailwindClasses: 'px-8 py-4 rounded-xl font-mono text-sm uppercase tracking-widest text-cyan-200 bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:border-cyan-300 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer',
        customCss: `@keyframes cyberPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.4), inset 0 0 15px rgba(6,182,212,0.2); }
  50% { box-shadow: 0 0 35px rgba(6,182,212,0.8), inset 0 0 25px rgba(6,182,212,0.4); }
}
.btn-cyber-interactive {
  animation: cyberPulse 3s infinite ease-in-out;
  backdrop-filter: blur(12px);
}`,
        items: [
          { title: 'Latenza Sub-5ms', description: 'Routing istantaneo tramite edge workers globali', tag: 'Fast Edge' },
          { title: 'Zero Downtime', description: 'Deployment atomico con rollback automatico in 1 click', tag: 'Safe' },
        ],
      };
    } else if (category === 'professional') {
      generatedComponent = {
        name: 'Brutalist Authority CTA',
        title: 'Richiedi Parere Legale Riservato',
        subtitle: 'Pulsante ad alto contrasto con ombra rigida isometrica 4px e traslazione meccanica all hover.',
        badge: 'Massima Confidenzialità',
        componentScope: 'button',
        layoutType: 'banner-cta',
        visualStyle: 'neo-brutalist',
        motionEffect: 'scale-press',
        buttonVariant: 'brutalist',
        buttonIcon: 'Lock',
        primaryCtaText: prompt.slice(0, 36) || 'Richiedi Parere Legale',
        primaryCtaUrl: '#contact',
        accentColor: '#0f172a',
        tailwindClasses: 'px-8 py-4 bg-amber-400 text-stone-950 font-bold text-sm uppercase tracking-wider border-2 border-stone-950 shadow-[5px_5px_0px_#0a0a0a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0a0a0a] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer',
        customCss: `.btn-brutalist-authority {
  box-shadow: 5px 5px 0px #09090b;
  letter-spacing: 0.1em;
}`,
        items: [
          { title: 'Risposta in 24 Ore', description: 'Analisi preliminare affidata al socio responsabile', tag: 'SLA Garantito' },
          { title: 'NDA Immediato', description: 'Accordo di riservatezza precompilato e firmato digitalmente', tag: 'Legal Shield' },
        ],
      };
    } else if (category === 'wellness') {
      generatedComponent = {
        name: 'Organic Calm Shimmer Button',
        title: 'Riserva il Tuo Rituale Rigenerante',
        subtitle: 'Pulsante pillola ultra-morbido con riflesso di luce delicato ispirato all acqua termale.',
        badge: 'Benessere Olistico',
        componentScope: 'button',
        layoutType: 'banner-cta',
        visualStyle: 'organic-warm',
        motionEffect: 'shimmer-sweep',
        buttonVariant: 'shimmer',
        buttonIcon: 'Sparkles',
        primaryCtaText: prompt.slice(0, 36) || 'Prenota Rituale SPA',
        primaryCtaUrl: '#spa-booking',
        accentColor: '#84a98c',
        tailwindClasses: 'relative overflow-hidden px-9 py-4 rounded-full bg-stone-800 text-stone-100 font-sans text-sm tracking-widest uppercase hover:bg-stone-700 shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer border border-stone-600/40',
        customCss: `@keyframes calmShimmer {
  0% { transform: translateX(-150%) skewX(-20deg); }
  100% { transform: translateX(250%) skewX(-20deg); }
}
.btn-organic-shimmer::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: calmShimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
}`,
        items: [
          { title: 'Kit SPA di Benvenuto', description: 'Accappatoio in spugna organica e oli essenziali omaggio', tag: 'Omaggio' },
          { title: 'Idroterapia Privata', description: 'Accesso esclusivo per 2 ore alla vasca aromatica', tag: 'Relax' },
        ],
      };
    } else {
      // Restaurant / Default Luxury Button
      generatedComponent = {
        name: 'Haute Dining Magnetic CTA',
        title: 'Riserva il Tavolo Vista Tramonto',
        subtitle: 'Pulsante d autore con finitura oro spazzolato, bordo cesellato e animazione di elevazione morbida.',
        badge: 'Esperienza Gastronomica',
        componentScope: 'button',
        layoutType: 'banner-cta',
        visualStyle: 'dark-luxury',
        motionEffect: 'hover-lift',
        buttonVariant: 'solid',
        buttonIcon: 'ArrowRight',
        primaryCtaText: prompt.slice(0, 36) || 'Riserva Tavolo d Autore',
        primaryCtaUrl: '#booking',
        accentColor: '#d39e43',
        tailwindClasses: 'px-8 py-4 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold text-xs tracking-widest uppercase shadow-[0_10px_25px_-5px_rgba(211,158,67,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(211,158,67,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer border border-amber-300/40',
        customCss: `.btn-luxury-magnetic {
  letter-spacing: 0.15em;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`,
        items: [
          { title: 'Conferma Immediata', description: 'SMS e WhatsApp con coordinate del tavolo assegnato', tag: 'Live Booking' },
          { title: 'Selezione Tavolo', description: 'Possibilità di scegliere tra sala affrescata o terrazza sul mare', tag: 'Personalizzato' },
        ],
      };
    }
  } else if (effectiveScope === 'card') {
    if (category === 'tech') {
      generatedComponent = {
        name: 'Bento Metric & Architecture Card',
        title: 'Neural Core v4.8 Engine',
        subtitle: 'Modulo di calcolo distribuito per inferenza su modelli multimodali con accelerazione hardware.',
        badge: 'Bento Widget • 99.99% Uptime',
        componentScope: 'card',
        layoutType: 'feature-grid',
        visualStyle: 'cyber-glow',
        motionEffect: 'border-beam',
        cardVariant: 'bento',
        accentColor: '#06b6d4',
        tailwindClasses: 'relative p-7 rounded-2xl bg-zinc-950/90 border border-cyan-500/30 text-white shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-400/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 backdrop-blur-xl',
        customCss: `@keyframes borderGlow {
  0%, 100% { border-color: rgba(6,182,212,0.3); }
  50% { border-color: rgba(99,102,241,0.8); }
}
.bento-cyber-card {
  animation: borderGlow 4s infinite alternate;
}`,
        items: [
          { title: 'Throughput', value: '14.2k req/s', description: 'Pipeline asincrona ad alta concorrenza', tag: 'Benchmark' },
          { title: 'Latenza P99', value: '4.2 ms', description: 'Ottimizzata per trading e video real-time', tag: 'SLA' },
          { title: 'Data Encryption', value: 'AES-256 GCM', description: 'Crittografia end-to-end su tutti i cluster', tag: 'Security' },
        ],
        primaryCtaText: 'Esplora API Docs',
        primaryCtaUrl: '#api-docs',
      };
    } else if (category === 'hospitality') {
      generatedComponent = {
        name: 'Panoramic Suite Glass Card',
        title: 'The Skyview Master Penthouse',
        subtitle: 'Card interattiva in stile glassmorphism con trasparenza speculare, riflessi satinati e vista mozzafiato.',
        badge: 'Suite d Autore • 120 mq',
        componentScope: 'card',
        layoutType: 'split-card',
        visualStyle: 'glassmorphism',
        motionEffect: 'hover-lift',
        cardVariant: 'glass',
        accentColor: '#e8d5b5',
        sideImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        sideImageCaption: 'La terrazza privata con vista a 360° sulla valle alpina',
        tailwindClasses: 'p-8 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl border border-white/40 dark:border-stone-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.18)] transition-all duration-500',
        customCss: `.glass-card-luxury {
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
}`,
        items: [
          { title: 'Idromassaggio all Aperto', value: 'Vasca in Pietra', description: 'Temperatura costante 38°C sotto il cielo stellato', tag: 'Relax Privato' },
          { title: 'Maggiordomo Dedicato', value: 'Servizio H24', description: 'Assistenza su misura per ogni itinerario o desiderio', tag: 'Concierge' },
        ],
        primaryCtaText: 'Verifica Disponibilità',
        primaryCtaUrl: '#booking',
      };
    } else {
      // Restaurant Tasting Card
      generatedComponent = {
        name: 'Menu Degustazione Card D Autore',
        title: 'Il Viaggio di 8 Portate',
        subtitle: 'Un percorso a mano libera creato giornalmente dallo chef per raccontare la biodiversità locale.',
        badge: 'Stella Verde • Sostenibilità',
        componentScope: 'card',
        layoutType: 'feature-grid',
        visualStyle: 'editorial-minimal',
        motionEffect: 'hover-lift',
        cardVariant: 'elevated',
        accentColor: '#d39e43',
        tailwindClasses: 'p-8 rounded-2xl bg-[#FAF7F2] border border-stone-300/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 text-stone-900',
        customCss: `.editorial-card-luxury {
  font-feature-settings: "kern" 1, "liga" 1;
}`,
        items: [
          { title: 'Quattro Snack di Benvenuto', description: 'Insalata di alghe, riccio di mare e cialda croccante di riso', tag: 'Amuse-bouche' },
          { title: 'Il Grande Pescato alla Brace', description: 'Cotto al faggio antico con riduzione di agrumi e finocchietto', tag: 'Piatto Firma' },
          { title: 'Soufflé al Cioccolato di Modica', description: 'Con gelato artigianale al fiore di sale di Mozia', tag: 'Dolce Conclusivo' },
        ],
        primaryCtaText: 'Prenota Questo Percorso',
        primaryCtaUrl: '#booking',
      };
    }
  } else {
    // Full Section layout tailored to prompt & category
    if (lowerPrompt.includes('timeline') || lowerPrompt.includes('storia') || lowerPrompt.includes('fasi') || lowerPrompt.includes('generazion')) {
      generatedComponent = {
        name: 'Timeline Storica & Tradizione',
        title: 'La Nostra Storia <em>Attraverso il Tempo</em>',
        subtitle: 'Dalla prima bottega artigiana nel 1968 all innovazione contemporanea a basso impatto ambientale.',
        badge: 'Tre Generazioni • Dal 1968',
        componentScope: 'section',
        layoutType: 'timeline',
        visualStyle: visualStyle || 'editorial-minimal',
        motionEffect: motionEffect || 'hover-lift',
        accentColor: '#d39e43',
        items: [
          { title: '1968: La Fondazione', description: 'Apertura del primo forno a legna nel centro storico con farine locali.', tag: 'Origini', value: '1968' },
          { title: '1992: La Riscoperta dei Grani', description: 'Conversione alla macinazione a pietra di varietà autoctone siciliane.', tag: 'Filosofia', value: '1992' },
          { title: '2014: Riconoscimento Nazionale', description: 'Premio per la migliore bottega sostenibile a filiera corta certificata.', tag: 'Eccellenza', value: '2014' },
          { title: '2024: Il Nuovo Laboratorio', description: 'Inaugurazione dello spazio bioclimatico per lievitati ad alta digeribilità.', tag: 'Futuro', value: '2024' },
        ],
        primaryCtaText: 'Scopri il Nostro Manifesto',
        primaryCtaUrl: '#manifesto',
      };
    } else if (lowerPrompt.includes('listin') || lowerPrompt.includes('prezz') || lowerPrompt.includes('menu') || lowerPrompt.includes('trattament')) {
      generatedComponent = {
        name: 'Listino Servizi & Prezzi D Autore',
        title: 'I Nostri Percorsi <em>e Trattamenti Signature</em>',
        subtitle: 'Trasparenza, qualità assoluta e materie prime d eccellenza per un esperienza senza compromessi.',
        badge: 'Listino Ufficiale • Prenotabili Online',
        componentScope: 'section',
        layoutType: 'interactive-list',
        visualStyle: visualStyle || 'dark-luxury',
        motionEffect: motionEffect || 'hover-lift',
        accentColor: '#d39e43',
        items: [
          { title: 'Percorso Degustazione Territorio', value: '€ 55', description: '4 calici monovarietali abbinati a formaggi a latte crudo e focacce calde.', tag: 'Più Richiesto' },
          { title: 'Selezione Riserve & Grandi Cru', value: '€ 85', description: '6 etichette da collezione con assaggi di salumi di suino nero dei Nebrodi.', tag: 'Top Selection' },
          { title: 'La Grande Verticale del Sommelier', value: '€ 130', description: '8 annate storiche con percorso degustazione completo guidato dal sommelier.', tag: 'Esclusivo' },
        ],
        primaryCtaText: 'Riserva la Tua Data',
        primaryCtaUrl: '#booking',
      };
    } else if (category === 'tech') {
      generatedComponent = {
        name: 'Piattaforma Cloud & AI Architecture',
        title: 'Infrastruttura Distribuita <em>per l AI Generation</em>',
        subtitle: 'Microservizi ultra-veloci, edge computing globale e sicurezza di livello enterprise garantita.',
        badge: 'Stack Tecnologico • High Throughput',
        componentScope: 'section',
        layoutType: 'feature-grid',
        visualStyle: 'cyber-glow',
        motionEffect: 'glow-pulse',
        accentColor: '#06b6d4',
        tailwindClasses: 'bg-zinc-950 text-white py-24',
        customCss: `.tech-grid-card {
  box-shadow: 0 0 25px rgba(6,182,212,0.15);
}`,
        items: [
          { title: 'Zero Cold Starts', value: '0.8 ms', description: 'Esecuzione istantanea tramite snapshot di memoria residenti.', tag: 'Prestazioni' },
          { title: 'Compliance GDPR & HIPAA', value: '100%', description: 'Dati cifrati a riposo e in transito con chiavi isolate per tenant.', tag: 'Sicurezza' },
          { title: 'Global Edge Anycast', value: '280+ POPs', description: 'Routing del traffico sul nodo più vicino all utente finale.', tag: 'Rete Globale' },
        ],
        primaryCtaText: 'Attiva Free Trial',
        primaryCtaUrl: '#signup',
      };
    } else {
      // General high-quality contextual section
      generatedComponent = {
        name: prompt.slice(0, 32),
        title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} <em>d Autore</em>`,
        subtitle: `Modulo appositamente disegnato per il contesto ${category} con stile ${visualStyle}.`,
        badge: `${category.toUpperCase()} • Modulo d Eccellenza`,
        componentScope: 'section',
        layoutType: 'feature-grid',
        visualStyle: visualStyle || 'editorial-minimal',
        motionEffect: motionEffect || 'hover-lift',
        accentColor: '#d39e43',
        primaryCtaText: 'Scopri di Più',
        primaryCtaUrl: '#section-contact',
        items: [
          { title: 'Autenticità & Cura Sartoriale', description: 'Ogni elemento è studiato per trasmettere prestigio e fiducia immediata.', tag: 'Punto di Forza', value: '01' },
          { title: 'Materie Prime Tracciabili', description: 'Selezione etica certificata e rispetto rigoroso degli standard più elevati.', tag: 'Tracciabilità', value: '02' },
          { title: 'Servizio su Misura', description: 'Un esperienza impeccabile calibrata sui desideri e sulle abitudini dei clienti.', tag: 'Sartoriale', value: '03' },
        ],
      };
    }
  }

  res.json({
    success: true,
    source: `fallback-${selectedModel}`,
    component: {
      id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      componentScope: effectiveScope,
      visualStyle,
      motionEffect,
      ...generatedComponent,
      generatedCategory: category,
      createdAt: new Date().toISOString(),
      generatedWithModel: selectedModel,
    },
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Visual CMS & AI Assistant running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
