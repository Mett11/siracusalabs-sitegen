import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Globe,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
} from 'lucide-react';
import { Site, SiteCategory } from '../../types';
import { siteRepository, StorageStatus } from '../../lib/storage';
import { NewSiteModal } from './NewSiteModal';
import { ImportExportModal } from './ImportExportModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { CATEGORY_PRESETS } from '../../data/presets';
import { AiComponentAssistantModal } from '../ai/AiComponentAssistantModal';

interface CmsDashboardProps {
  onNavigateToEditor: (siteId: string) => void;
  onNavigateToPreview: (siteId: string) => void;
  onNavigateToPublic: (slug: string) => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({
  onNavigateToEditor,
  onNavigateToPreview,
  onNavigateToPublic,
}) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [storageStatus, setStorageStatus] = useState<StorageStatus>(siteRepository.getStorageStatus());

  // Modals state
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const [selectedSiteForExport, setSelectedSiteForExport] = useState<Site | undefined>(undefined);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  useEffect(() => {
    const loadSites = () => {
      const all = siteRepository.getAllSites();
      setSites(all);
      setStorageStatus(siteRepository.getStorageStatus());
    };

    loadSites();
    const unsubscribe = siteRepository.subscribe(loadSites);
    return () => unsubscribe();
  }, []);

  const handleCreateSite = (newSite: Site) => {
    siteRepository.saveSite(newSite, false);
    onNavigateToEditor(newSite.id);
  };

  const handleDuplicateSite = (siteId: string) => {
    const copy = siteRepository.duplicateSite(siteId);
    if (copy) {
      setSites(siteRepository.getAllSites());
    }
  };

  const handleDeleteSite = (siteId: string) => {
    siteRepository.deleteSite(siteId);
    setSites(siteRepository.getAllSites());
  };

  const handleTogglePublish = (site: Site) => {
    if (site.status === 'published') {
      siteRepository.unpublishSite(site.id);
    } else {
      siteRepository.saveSite(site, true);
    }
    setSites(siteRepository.getAllSites());
  };

  const handleResetDemo = () => {
    if (window.confirm('Vuoi ripristinare il catalogo iniziale con il benchmark ufficiale Gutkowskino?')) {
      siteRepository.resetToDefault();
      setSites(siteRepository.getAllSites());
    }
  };

  const filteredSites = sites.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brand.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const publishedCount = sites.filter((s) => s.status === 'published').length;
  const draftCount = sites.length - publishedCount;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans pb-16 text-left">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-stone-900">
                  Visual Studio CMS & Generator
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  v2.0 Modulare
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Gestione multi-sito • Engine template modulare in React
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Persistence indicator */}
            <div
              title="I dati sono salvati in modo sicuro e persistente nel browser con supporto pronto per Firebase Firestore"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Persistenza Attiva</span>
            </div>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Sparkles className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
              <span>Assistente AI Componenti</span>
            </button>

            <button
              onClick={() => {
                setSelectedSiteForExport(sites[0]);
                setImportExportModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileJsonIcon className="w-3.5 h-3.5" />
              <span>Import / Export JSON</span>
            </button>

            <button
              onClick={() => setIsNewSiteModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Nuovo Sito</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Totale Siti Creati
            </span>
            <div className="text-3xl font-bold text-stone-900 mt-1">{sites.length}</div>
            <div className="text-[11px] text-stone-400 mt-1">Progetti indipendenti nel CMS</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Siti Pubblicati
            </span>
            <div className="text-3xl font-bold text-emerald-700 mt-1">{publishedCount}</div>
            <div className="text-[11px] text-stone-400 mt-1">Accessibili pubblicamente via URL</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Bozze in Lavorazione
            </span>
            <div className="text-3xl font-bold text-amber-700 mt-1">{draftCount}</div>
            <div className="text-[11px] text-stone-400 mt-1">Visibili in anteprima riservata</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Template Attivi
            </span>
            <div className="text-3xl font-bold text-stone-900 mt-1">2</div>
            <div className="text-[11px] text-stone-400 mt-1">Gutkowskino & Atelier Minimal</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cerca sito per nome, brand o slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Tutti ({sites.length})
              </button>
              {CATEGORY_PRESETS.map((p) => {
                const count = sites.filter((s) => s.category === p.id).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCategoryFilter(p.id)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      categoryFilter === p.id
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {p.name.split(',')[0]} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sites Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-800 uppercase tracking-wider">
              I Tuoi Siti Vetrina ({filteredSites.length})
            </h2>
            <button
              onClick={handleResetDemo}
              className="text-xs text-stone-500 hover:text-stone-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ripristina Demo Iniziale</span>
            </button>
          </div>

          {filteredSites.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <Layers className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <h3 className="text-base font-bold text-stone-800">Nessun sito trovato</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
                Nessun progetto corrisponde ai filtri selezionati. Prova a modificare la ricerca o crea un nuovo sito vetrina.
              </p>
              <button
                onClick={() => setIsNewSiteModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-sm"
              >
                Crea Nuovo Sito
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map((site) => {
                const heroSec = site.sections.find((s) => s.type === 'hero');
                const heroImg =
                  heroSec?.data?.heroImage ||
                  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={site.id}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative h-44 overflow-hidden bg-stone-100">
                      <img
                        src={heroImg}
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                            site.status === 'published'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {site.status === 'published' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Pubblicato
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Bozza
                            </>
                          )}
                        </span>

                        {site.hasUnsavedChanges && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            Modifiche non salvate
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                          {site.templateId}
                        </span>
                      </div>

                      {/* Site Name and Slug overlay */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-mono tracking-wider opacity-80 block">
                          {site.category}
                        </span>
                        <h3 className="text-xl font-bold font-editorial text-white leading-tight">
                          {site.name}
                        </h3>
                      </div>
                    </div>

                    {/* Site Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500">Slug pubblico:</span>
                          <span className="font-mono text-stone-800 font-medium">
                            /site/{site.slug}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500">Sezioni attive:</span>
                          <span className="text-stone-800 font-medium">
                            {site.sections.filter((s) => s.enabled).length} di {site.sections.length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500">Ultimo aggiornamento:</span>
                          <span className="text-stone-600 font-mono text-[11px]">
                            {new Date(site.updatedAt).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                      </div>

                      {/* Primary Actions */}
                      <div className="pt-4 border-t border-stone-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onNavigateToEditor(site.id)}
                            className="py-2 px-3 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Editor</span>
                          </button>

                          <button
                            onClick={() => onNavigateToPreview(site.id)}
                            className="py-2 px-3 text-xs font-bold uppercase tracking-wider border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Anteprima</span>
                          </button>
                        </div>

                        {/* Secondary Tools */}
                        <div className="flex items-center justify-between pt-2 text-stone-500 text-xs">
                          <button
                            onClick={() => handleTogglePublish(site)}
                            className={`text-[11px] font-semibold uppercase tracking-wider hover:underline cursor-pointer ${
                              site.status === 'published' ? 'text-amber-700' : 'text-emerald-700'
                            }`}
                          >
                            {site.status === 'published' ? 'Sospendi Pubblicazione' : 'Pubblica Subito'}
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedSiteForExport(site);
                                setImportExportModalOpen(true);
                              }}
                              title="Esporta JSON"
                              aria-label={`Esporta JSON per ${site.name}`}
                              className="p-1 hover:text-stone-900 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDuplicateSite(site.id)}
                              title="Duplica Sito"
                              aria-label={`Duplica ${site.name}`}
                              className="p-1 hover:text-stone-900 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setSiteToDelete(site)}
                              title="Elimina Sito"
                              aria-label={`Elimina ${site.name}`}
                              className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Public Link */}
                        {site.status === 'published' && (
                          <div className="pt-2">
                            <button
                              onClick={() => onNavigateToPublic(site.slug)}
                              className="w-full text-center text-[11px] text-stone-500 hover:text-stone-900 font-mono flex items-center justify-center gap-1 py-1 bg-stone-50 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                            >
                              <Globe className="w-3 h-3 text-emerald-600" />
                              <span>Vedi versione online (/site/{site.slug})</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <NewSiteModal
        isOpen={isNewSiteModalOpen}
        onClose={() => setIsNewSiteModalOpen(false)}
        onCreateSite={handleCreateSite}
      />

      <ImportExportModal
        isOpen={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
        site={selectedSiteForExport}
        allSites={sites}
        onImportSite={(imported) => {
          siteRepository.saveSite(imported, false);
          setSites(siteRepository.getAllSites());
        }}
      />

      <ConfirmDeleteModal
        isOpen={siteToDelete !== null}
        onClose={() => setSiteToDelete(null)}
        site={siteToDelete}
        onConfirmDelete={handleDeleteSite}
      />

      <AiComponentAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

const FileJsonIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 12a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1" />
    <path d="M14 12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1" />
  </svg>
);
