import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroSectionData, ThemeTokens } from '../../../../types';
import { renderRichText } from '../../../../lib/richText';
import { WaveDecoration } from '../GutkowskinoIcons';

interface HeroSectionProps {
  data: HeroSectionData;
  theme: ThemeTokens;
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data, theme, onOpenBooking }) => {
  const handlePrimaryClick = () => {
    if (data.primaryCtaAction === 'booking') {
      onOpenBooking();
    } else if (data.primaryCtaUrl) {
      if (data.primaryCtaUrl.startsWith('#')) {
        const el = document.querySelector(data.primaryCtaUrl);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(data.primaryCtaUrl, '_blank');
      }
    }
  };

  const handleSecondaryClick = () => {
    if (data.secondaryCtaUrl) {
      if (data.secondaryCtaUrl.startsWith('#')) {
        const el = document.querySelector(data.secondaryCtaUrl);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(data.secondaryCtaUrl, '_blank');
      }
    }
  };

  return (
    <section id="section-hero" className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 bg-[#FAF7F2]">
      {/* Subtle organic background gradients */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none -mr-20 -mt-20"
        style={{ backgroundColor: theme.primaryColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none -ml-20 -mb-20"
        style={{ backgroundColor: theme.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Editorial Typography */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6 text-left">
            {data.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-stone-200/60 text-stone-800 border border-stone-300/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{data.badge}</span>
              </div>
            )}

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold text-stone-900 tracking-tight leading-[1.08]">
              {renderRichText(data.headline)}
            </h1>

            <div className="pt-1">
              <WaveDecoration className="w-24 h-4 text-amber-700/80" />
            </div>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal font-sans">
              {data.subheadline}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {data.primaryCtaText && (
                <button
                  onClick={handlePrimaryClick}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white rounded-md shadow-md hover:shadow-lg hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{data.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {data.secondaryCtaText && (
                <button
                  onClick={handleSecondaryClick}
                  className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-stone-800 border border-stone-300 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {data.secondaryCtaText}
                </button>
              )}
            </div>

            {/* Decorative Recognition Tag */}
            {data.decorativeTag && (
              <div className="pt-6 border-t border-stone-200/80 inline-block">
                <p className="text-xs uppercase tracking-widest font-mono text-stone-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  {data.decorativeTag}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Asymmetric Editorial Photo Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing decorative colored layer */}
              <div
                className="absolute inset-0 rounded-2xl transform rotate-2 translate-x-3 translate-y-3 opacity-30 transition-transform hover:rotate-1"
                style={{ backgroundColor: theme.accentColor }}
              />

              {/* Main photo frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                <img
                  src={data.heroImage}
                  alt={data.heroImageCaption || 'Gutkowskino Atmosfera'}
                  className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {data.heroImageCaption && (
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans tracking-wide bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20">
                    <p className="italic">"{data.heroImageCaption}"</p>
                  </div>
                )}
              </div>

              {/* Floating aesthetic stamp / badge */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-stone-200 text-stone-900 text-[11px] font-semibold tracking-wider uppercase hidden sm:flex items-center gap-1.5">
                <span className="text-amber-600">✦</span>
                <span>{data.badge?.split('•')[0]?.trim() || 'Selezione d’Autore'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
