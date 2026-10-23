import React from 'react';
import { Users, Sparkles } from 'lucide-react';
import { SpacesSectionData, ThemeTokens } from '../../../../types';

interface SpacesSectionProps {
  data: SpacesSectionData;
  theme: ThemeTokens;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({ data, theme }) => {
  return (
    <section id="section-spaces" className="py-20 md:py-28 bg-[#F4EFE6] border-t border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
            Le Nostre Sale
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mt-2 tracking-tight">
            Spazi & Atmosfere
          </h2>
          {data.leadText && (
            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {data.leadText}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.spaces.map((space, idx) => (
            <div
              key={space.id || idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-200/90 flex flex-col group hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <Users className="w-3.5 h-3.5" />
                    {space.capacity}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                    {space.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    {space.description}
                  </p>
                </div>

                {space.features && space.features.length > 0 && (
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {space.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-sans"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
