import React from 'react';
import { ManifestoSectionData, ThemeTokens } from '../../../../types';
import { renderRichText } from '../../../../lib/richText';

interface ManifestoSectionProps {
  data: ManifestoSectionData;
  theme: ThemeTokens;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = ({ data, theme }) => {
  return (
    <section id="section-manifesto" className="py-20 md:py-28 bg-[#F4EFE6] relative overflow-hidden border-t border-b border-stone-200/60">
      {/* Background watermarks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Side Photography with signature details */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div
                className="absolute inset-0 rounded-xl transform -rotate-2 -translate-x-3 translate-y-3 opacity-20"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white bg-stone-100">
                <img
                  src={data.sideImage}
                  alt={data.sideImageCaption || 'Manifesto Gutkowskino'}
                  className="w-full h-[420px] object-cover"
                />
                {data.sideImageCaption && (
                  <div className="p-3 bg-white/95 text-[11px] text-stone-600 font-mono tracking-wider uppercase border-t border-stone-200">
                    {data.sideImageCaption}
                  </div>
                )}
              </div>

              {/* Signature badge */}
              {(data.signatureName || data.signatureRole) && (
                <div className="mt-6 p-4 bg-white/80 backdrop-blur-xs rounded-lg border border-stone-200/80 text-left">
                  <div className="font-editorial italic text-xl text-stone-900 font-semibold">
                    {data.signatureName}
                  </div>
                  {data.signatureRole && (
                    <div className="text-[11px] text-stone-500 uppercase tracking-widest font-mono mt-0.5">
                      {data.signatureRole}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quote & Pillars */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2 text-left">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
                La Nostra Filosofia
              </span>
              <blockquote className="font-editorial text-2xl sm:text-3xl md:text-4xl italic text-stone-900 font-medium leading-snug mt-2">
                {renderRichText(data.quote)}
              </blockquote>
              {data.quoteAuthor && (
                <cite className="block text-xs uppercase tracking-widest text-stone-500 font-mono mt-3 not-italic">
                  — {data.quoteAuthor}
                </cite>
              )}
            </div>

            {data.description && (
              <p className="text-stone-700 leading-relaxed text-base sm:text-lg font-sans">
                {data.description}
              </p>
            )}

            {/* Three Pillars with Roman Numerals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-300/60">
              {data.pillars.map((pillar) => (
                <div key={pillar.id} className="space-y-2">
                  <div
                    className="font-editorial text-2xl font-bold italic"
                    style={{ color: theme.primaryColor }}
                  >
                    {pillar.numeral}
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-stone-900 leading-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
