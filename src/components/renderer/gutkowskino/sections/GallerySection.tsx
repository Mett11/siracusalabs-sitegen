import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { GallerySectionData, ThemeTokens } from '../../../../types';
import { LightboxModal } from '../LightboxModal';

interface GallerySectionProps {
  data: GallerySectionData;
  theme: ThemeTokens;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ data, theme }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = data.categories || ['Tutti'];

  const filteredItems =
    selectedCategory === 'Tutti'
      ? data.items
      : data.items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="section-gallery" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
            Frammenti Visivi
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mt-2 tracking-tight">
            La Galleria Fotografica
          </h2>
          {data.leadText && (
            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {data.leadText}
            </p>
          )}

          {/* Categories */}
          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={
                      isActive
                        ? { backgroundColor: theme.primaryColor, color: '#FFFFFF' }
                        : undefined
                    }
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'shadow-sm'
                        : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/70'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const originalIndex = data.items.findIndex((orig) => orig.id === item.id);
            return (
              <div
                key={item.id || idx}
                onClick={() => setLightboxIndex(originalIndex >= 0 ? originalIndex : idx)}
                className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer bg-stone-100 aspect-4/3 sm:aspect-square"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="self-end p-2 rounded-full bg-white/20 backdrop-blur-xs text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div className="text-white text-left">
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-80 block">
                      {item.category}
                    </span>
                    <h4 className="font-editorial text-xl font-bold text-white mt-0.5">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          items={data.items}
          currentIndex={lightboxIndex}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </section>
  );
};
