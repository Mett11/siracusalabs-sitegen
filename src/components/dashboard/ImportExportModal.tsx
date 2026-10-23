import React, { useState } from 'react';
import { X, Download, Upload, AlertCircle, CheckCircle, FileCode } from 'lucide-react';
import { Site } from '../../types';
import { validateJsonImport } from '../../lib/validation';
import { importFromOriginalRestaurantJson, exportToOriginalRestaurantJson } from '../../lib/adapter';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  site?: Site;
  allSites: Site[];
  onImportSite: (importedSite: Site) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  site,
  allSites,
  onImportSite,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [jsonText, setJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadCmsJson = () => {
    if (!site) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(site, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${site.slug}-cms-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadGutkowskinoJson = () => {
    if (!site) return;
    const legacy = exportToOriginalRestaurantJson(site);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(legacy, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${site.slug}-restaurant.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonText(content);
      };
    }
  };

  const handleExecuteImport = () => {
    setImportError(null);
    setImportSuccess(null);

    try {
      if (!jsonText.trim()) {
        setImportError('Incolla il contenuto JSON o carica un file prima di importare.');
        return;
      }

      const parsed = JSON.parse(jsonText);
      const validation = validateJsonImport(parsed);

      if (!validation.isValid) {
        setImportError(validation.error || 'Formato JSON non valido.');
        return;
      }

      let finalSite: Site;
      if (validation.site) {
        // Direct Site model
        finalSite = {
          ...validation.site,
          id: `site-imported-${Date.now()}`,
          name: `${validation.site.name} (Importato)`,
          slug: `${validation.site.slug}-imp-${Math.floor(100 + Math.random() * 900)}`,
          status: 'draft',
          updatedAt: new Date().toISOString(),
          hasUnsavedChanges: true,
        };
      } else {
        // Original restaurant.json format
        finalSite = importFromOriginalRestaurantJson(parsed as any, `site-gutkowskino-imp-${Date.now()}`);
        finalSite.name = `${finalSite.name} (Importato)`;
        finalSite.slug = `${finalSite.slug}-imp-${Math.floor(100 + Math.random() * 900)}`;
      }

      onImportSite(finalSite);
      setImportSuccess(`Sito "${finalSite.name}" importato con successo!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e: any) {
      setImportError(`Errore sintassi JSON: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-xl bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-stone-700" />
            <h3 className="text-lg font-bold text-stone-900">
              Gestione Dati: Import / Export JSON
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-b-2 border-stone-900 text-stone-900 bg-stone-50/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Esporta Dati
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'border-b-2 border-stone-900 text-stone-900 bg-stone-50/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Importa Dati JSON
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {site ? (
                <div>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                    Scarica i dati del sito <strong>{site.name}</strong>. Puoi scaricare la struttura completa del CMS per backup o migrazione, oppure esportare in formato compatibile con <code>restaurant.json</code>.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleDownloadCmsJson}
                      className="w-full p-4 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Download className="w-4 h-4 text-emerald-600" />
                          <span>Esporta JSON Completo CMS</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Conserva token grafici, impostazioni di navigazione, tutte le sezioni e dati specifici.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-stone-100 rounded text-stone-600">
                        .json
                      </span>
                    </button>

                    <button
                      onClick={handleDownloadGutkowskinoJson}
                      className="w-full p-4 rounded-xl border border-stone-200 hover:border-amber-800 hover:bg-amber-50/30 text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Download className="w-4 h-4 text-amber-700" />
                          <span>Esporta Formato Gutkowskino (restaurant.json)</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Compatibile con la struttura originale Gutkowskino (meta, brand, kitchen, spaces, info).
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-amber-100 text-amber-800 rounded">
                        restaurant.json
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500">
                  Seleziona un sito dalla dashboard per esportare i suoi dati.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Carica un file <code>.json</code> o incolla il testo JSON. Il sistema riconosce automaticamente sia il modello CMS sia il formato originale <code>restaurant.json</code> con conversione immediata.
              </p>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Oppure Incolla il testo JSON:
                </label>
                <textarea
                  rows={6}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder="Incolla qui { ... }"
                  className="w-full p-3 text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
                />
              </div>

              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-800 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{importSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Chiudi
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-sm hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Convalida & Importa Progetto</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
