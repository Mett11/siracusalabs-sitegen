import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../../types';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fade-in"
    >
      {/* Top bar */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white/80 z-20">
        <span className="text-xs uppercase tracking-widest font-mono">
          {currentIndex + 1} / {items.length} • {currentItem.category}
        </span>
        <button
          onClick={onClose}
          aria-label="Chiudi visualizzazione a schermo intero"
          className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Immagine precedente"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm transition-all z-20"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Immagine successiva"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm transition-all z-20"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
      >
        <img
          src={currentItem.imageUrl}
          alt={currentItem.title}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
        />
        {currentItem.title && (
          <div className="mt-4 text-center">
            <h4 className="font-editorial text-xl font-medium text-white tracking-wide">
              {currentItem.title}
            </h4>
            <span className="text-xs text-white/60 tracking-wider uppercase mt-1 inline-block">
              {currentItem.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
