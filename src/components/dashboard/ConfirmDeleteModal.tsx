import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Site } from '../../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site | null;
  onConfirmDelete: (siteId: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  site,
  onConfirmDelete,
}) => {
  if (!isOpen || !site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-md bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">
            Eliminare il sito "{site.name}"?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed mb-6">
            Questa operazione eliminerà definitivamente il sito, le sue sezioni, i contenuti configurati e la versione pubblicata. Questa azione non può essere annullata.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={() => {
                onConfirmDelete(site.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Conferma Eliminazione</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
