import React, { useState } from 'react';
import { Wine, Utensils, Sparkles, Check, ChevronRight } from 'lucide-react';
import { KitchenSectionData, ThemeTokens, DishItem } from '../../../../types';

interface KitchenSectionProps {
  data: KitchenSectionData;
  theme: ThemeTokens;
  onOpenBooking: () => void;
}

export const KitchenSection: React.FC<KitchenSectionProps> = ({ data, theme, onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [activeDish, setActiveDish] = useState<DishItem | null>(() => {
    return data.dishes.find((d) => d.highlighted) || data.dishes[0] || null;
  });

  const categories = ['Tutti', ...(data.categories || [])];

  const filteredDishes =
    selectedCategory === 'Tutti'
      ? data.dishes
      : data.dishes.filter((d) => d.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section id="section-kitchen" className="py-20 md:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
            La Nostra Cucina
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mt-2 tracking-tight">
            I Sapori della Memoria
          </h2>
          {data.leadText && (
            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {data.leadText}
            </p>
          )}

          {/* Category Tabs */}
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

        {/* Interactive Dual-Panel Showcase: Left Dishes List, Right Active Dish Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Dish List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredDishes.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
                Nessun piatto presente in questa categoria.
              </div>
            ) : (
              filteredDishes.map((dish) => {
                const isSelected = activeDish?.id === dish.id;
                return (
                  <div
                    key={dish.id}
                    onClick={() => setActiveDish(dish)}
                    className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white shadow-md border-amber-800/40 ring-1 ring-amber-800/20'
                        : 'bg-white/60 hover:bg-white border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-editorial text-xl font-bold text-stone-900 leading-snug">
                            {dish.name}
                          </h4>
                          {dish.highlighted && (
                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-100 text-amber-800">
                              Consigliato
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
                          {dish.description}
                        </p>

                        {/* Badges */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono text-stone-500 uppercase">
                            {dish.category}
                          </span>
                          {dish.dietaryTags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className="font-editorial text-xl font-bold"
                          style={{ color: theme.primaryColor }}
                        >
                          {dish.price}
                        </div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest block mt-1">
                          {isSelected ? 'In evidenza' : 'Dettagli →'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {data.noteText && (
              <p className="text-xs text-stone-500 italic pt-3 border-t border-stone-200">
                * {data.noteText}
              </p>
            )}
          </div>

          {/* Right: Active Dish Spotlight with Crossfade Image & Wine Pairing (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            {activeDish ? (
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-200 text-left">
                {/* Dish Photo with fade transition */}
                <div className="relative h-64 sm:h-72 bg-stone-100 overflow-hidden">
                  <img
                    key={activeDish.id}
                    src={activeDish.image}
                    alt={activeDish.name}
                    className="w-full h-full object-cover animate-fade-in transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white font-editorial text-lg font-bold">
                    {activeDish.price}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-stone-800">
                    {activeDish.category}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
                      Piatto Selezionato
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-stone-900 mt-0.5">
                      {activeDish.name}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    {activeDish.description}
                  </p>

                  {/* Dietary highlights */}
                  {activeDish.dietaryTags && activeDish.dietaryTags.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                        Caratteristiche:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDish.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wine Pairing recommendation */}
                  {activeDish.winePairing && (
                    <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                      <Wine className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                          Abbinamento Consigliato
                        </div>
                        <div className="text-xs text-amber-800 font-medium mt-0.5">
                          {activeDish.winePairing}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onOpenBooking}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Prenota per assaggiare questo piatto</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
                Seleziona un piatto dalla lista per visualizzarne i dettagli.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
