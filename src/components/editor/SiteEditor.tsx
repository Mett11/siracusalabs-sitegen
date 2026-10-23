import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  Palette,
  Compass,
  Layers,
  Repeat,
  PhoneCall,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Site, CustomComponentData, SectionConfig } from '../../types';
import { siteRepository } from '../../lib/storage';
import { LivePreviewPanel } from './LivePreviewPanel';
import { GeneralTab } from './tabs/GeneralTab';
import { BrandDesignTab } from './tabs/BrandDesignTab';
import { NavigationTab } from './tabs/NavigationTab';
import { SectionsManagerTab } from './tabs/SectionsManagerTab';
import { RepeatableItemsTab } from './tabs/RepeatableItemsTab';
import { ContactBookingTab } from './tabs/ContactBookingTab';
import { SectionDetailEditor } from './tabs/SectionDetailEditor';
import { AiComponentAssistantModal } from '../ai/AiComponentAssistantModal';

interface SiteEditorProps {
  siteId: string;
  onNavigateToDashboard: () => void;
  onNavigateToPreview: (siteId: string) => void;
  onNavigateToPublic: (slug: string) => void;
}

type EditorTab =
  | 'general'
  | 'brand'
  | 'navigation'
  | 'sections'
  | 'repeatables'
  | 'contacts'
  | 'section_detail';

export const SiteEditor: React.FC<SiteEditorProps> = ({
  siteId,
  onNavigateToDashboard,
  onNavigateToPreview,
  onNavigateToPublic,
}) => {
  const [site, setSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('general');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<{ message: string; type: 'success' | 'published' } | null>(null);

  useEffect(() => {
    const loaded = siteRepository.getSiteById(siteId);
    if (loaded) {
      setSite(JSON.parse(JSON.stringify(loaded)));
    }
  }, [siteId]);

  if (!site) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 mx-auto mb-4" />
          <p className="text-xs text-stone-500 font-mono">Caricamento progetto...</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updatedFields: Partial<Site>) => {
    setSite((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updatedFields,
        hasUnsavedChanges: true,
      };
    });
  };

  const handleSaveDraft = () => {
    if (!site) return;
    siteRepository.saveSite(site, false);
    setSite((prev) => (prev ? { ...prev, hasUnsavedChanges: false } : null));
    setSaveToast({ message: 'Bozza salvata con successo!', type: 'success' });
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handlePublish = () => {
    if (!site) return;
    siteRepository.saveSite(site, true);
    setSite((prev) => (prev ? { ...prev, status: 'published', hasUnsavedChanges: false } : null));
    setSaveToast({ message: 'Sito pubblicato online con successo!', type: 'published' });
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleSelectSectionToEdit = (secId: string) => {
    setSelectedSectionId(secId);
    setActiveTab('section_detail');
  };

  const handleInsertAiComponent = (comp: CustomComponentData) => {
    if (!site) return;
    const newId = `section-custom-${Date.now().toString().slice(-4)}`;
    const newSection: SectionConfig<'custom_component'> = {
      id: newId,
      type: 'custom_component',
      title: comp.name || 'Componente Personalizzato',
      enabled: true,
      order: site.sections.length + 1,
      data: comp,
    };
    handleUpdate({ sections: [...site.sections, newSection] });
    setSelectedSectionId(newId);
    setActiveTab('section_detail');
  };

  const navTabs = [
    { id: 'general', label: 'Generale & SEO', icon: Sliders },
    { id: 'brand', label: 'Brand & Stile', icon: Palette },
    { id: 'navigation', label: 'Navigazione', icon: Compass },
    { id: 'sections', label: 'Sezioni Sito', icon: Layers },
    { id: 'repeatables', label: 'Elementi Ripetibili', icon: Repeat },
    { id: 'contacts', label: 'Contatti & Orari', icon: PhoneCall },
  ];

  return (
    <div className="h-screen flex flex-col bg-stone-100 text-stone-900 font-sans overflow-hidden text-left">
      {/* Top Header Bar */}
      <header className="h-14 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        {/* Left: Back & Site Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <span className="text-stone-300">|</span>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900 truncate max-w-[140px] sm:max-w-xs">
                {site.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                {site.templateId}
              </span>
            </div>
          </div>

          {/* Unsaved indicator */}
          <div className="hidden md:flex items-center gap-1.5 ml-2">
            {site.hasUnsavedChanges ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Modifiche non salvate
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Bozza salvata
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            title="Crea o inserisci componenti con l'AI"
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
            <span className="hidden md:inline">Crea con AI</span>
          </button>

          <button
            onClick={() => onNavigateToPreview(site.id)}
            title="Anteprima a tutto schermo"
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anteprima</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-stone-600" />
            <span>Salva Bozza</span>
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-200" />
            <span>Pubblica Sito</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {saveToast && (
        <div className="absolute top-16 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 animate-fade-in border border-stone-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Main 3-Column Studio Editor on Desktop */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Left Navigation Sidebar */}
        <aside aria-label="Menu impostazioni editor" className="w-16 sm:w-56 bg-white border-r border-stone-200 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-2 sm:p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 hidden sm:block py-1">
              Pannelli di Modifica
            </span>

            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as EditorTab);
                    setSelectedSectionId(null);
                  }}
                  className={`w-full p-2.5 sm:px-3 sm:py-2.5 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs hidden sm:inline truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom link to view live online */}
          {site.status === 'published' && (
            <div className="p-3 border-t border-stone-200 hidden sm:block">
              <button
                onClick={() => onNavigateToPublic(site.slug)}
                className="w-full py-2 px-2.5 text-[11px] font-mono text-stone-600 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">/site/{site.slug}</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </button>
            </div>
          )}
        </aside>

        {/* Column 2: Center Controls Form Area */}
        <div className="w-full sm:w-[420px] lg:w-[480px] bg-stone-50 border-r border-stone-200 overflow-y-auto p-4 sm:p-6 shrink-0 shadow-inner">
          {activeTab === 'general' && <GeneralTab site={site} onChange={handleUpdate} />}
          {activeTab === 'brand' && <BrandDesignTab site={site} onChange={handleUpdate} />}
          {activeTab === 'navigation' && <NavigationTab site={site} onChange={handleUpdate} />}
          {activeTab === 'sections' && (
            <SectionsManagerTab
              site={site}
              onChange={handleUpdate}
              onSelectSectionToEdit={handleSelectSectionToEdit}
            />
          )}
          {activeTab === 'repeatables' && (
            <RepeatableItemsTab site={site} onChange={handleUpdate} />
          )}
          {activeTab === 'contacts' && (
            <ContactBookingTab site={site} onChange={handleUpdate} />
          )}
          {activeTab === 'section_detail' && selectedSectionId && (
            <SectionDetailEditor
              site={site}
              sectionId={selectedSectionId}
              onBack={() => setActiveTab('sections')}
              onChange={handleUpdate}
            />
          )}
        </div>

        {/* Column 3: Right Live Interactive Preview */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <LivePreviewPanel
            site={site}
            onOpenExternalPreview={() => onNavigateToPreview(site.id)}
          />
        </div>
      </div>

      <AiComponentAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentSite={site}
        onInsertToSite={handleInsertAiComponent}
      />
    </div>
  );
};
