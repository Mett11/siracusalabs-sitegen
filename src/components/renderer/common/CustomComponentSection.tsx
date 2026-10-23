import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Check,
  Star,
  ExternalLink,
  Zap,
  Lock,
  Clock,
  Tag,
  ChevronRight,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { CustomComponentData, ThemeTokens } from '../../../types';
import { renderRichText } from '../../../lib/richText';

interface CustomComponentSectionProps {
  id?: string;
  data: CustomComponentData;
  theme: ThemeTokens;
  onOpenBooking?: () => void;
}

export const CustomComponentSection: React.FC<CustomComponentSectionProps> = ({
  id,
  data,
  theme,
  onOpenBooking,
}) => {
  const [copiedCss, setCopiedCss] = useState(false);
  const [clickedFeedback, setClickedFeedback] = useState(false);

  const handleCtaClick = () => {
    setClickedFeedback(true);
    setTimeout(() => setClickedFeedback(false), 2000);

    if (data.primaryCtaUrl === 'booking' || data.primaryCtaUrl === '#booking' || data.primaryCtaUrl === '#spa-booking') {
      if (onOpenBooking) onOpenBooking();
      return;
    }
    if (data.primaryCtaUrl) {
      if (data.primaryCtaUrl.startsWith('#')) {
        const el = document.querySelector(data.primaryCtaUrl);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(data.primaryCtaUrl, '_blank');
      }
    } else if (onOpenBooking) {
      onOpenBooking();
    }
  };

  const copyCssClasses = () => {
    const textToCopy = data.customCss
      ? `${data.customCss}\n\n/* Tailwind Classes: */\n${data.tailwindClasses || ''}`
      : data.tailwindClasses || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  // Helper for Motion Effect classes
  const getMotionClass = (effect?: string) => {
    switch (effect) {
      case 'hover-lift':
        return 'hover:-translate-y-1.5 transition-all duration-300';
      case 'glow-pulse':
        return 'animate-pulse hover:animate-none';
      case 'scale-press':
        return 'active:scale-95 transition-transform duration-150';
      case 'border-beam':
        return 'hover:border-cyan-400 transition-colors duration-300';
      case 'shimmer-sweep':
        return 'transition-all duration-300';
      default:
        return 'transition-all duration-200';
    }
  };

  // Render Icon if specified
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Lock':
        return <Lock className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  // -------------------------------------------------------------
  // SCOPE 1: BOTTONE SINGOLO / MICRO-CTA SHOWCASE
  // -------------------------------------------------------------
  if (data.componentScope === 'button') {
    const isCyber = data.visualStyle === 'cyber-glow';
    const isBrutalist = data.visualStyle === 'neo-brutalist';
    const isGlass = data.visualStyle === 'glassmorphism';
    const isOrganic = data.visualStyle === 'organic-warm';

    const defaultBtnClass = isCyber
      ? 'px-8 py-4 rounded-xl font-mono text-sm uppercase tracking-widest text-cyan-200 bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:border-cyan-300 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer inline-flex items-center gap-3'
      : isBrutalist
      ? 'px-8 py-4 bg-amber-400 text-stone-950 font-bold text-sm uppercase tracking-wider border-2 border-stone-950 shadow-[5px_5px_0px_#0a0a0a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0a0a0a] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer inline-flex items-center gap-3'
      : isOrganic
      ? 'relative overflow-hidden px-9 py-4 rounded-full bg-stone-800 text-stone-100 font-sans text-sm tracking-widest uppercase hover:bg-stone-700 shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer border border-stone-600/40 inline-flex items-center gap-3'
      : isGlass
      ? 'px-8 py-4 rounded-2xl bg-white/20 dark:bg-stone-900/40 backdrop-blur-xl border border-white/40 text-stone-900 dark:text-white font-medium text-sm tracking-wider uppercase shadow-lg hover:shadow-2xl hover:bg-white/30 transition-all duration-300 active:scale-95 cursor-pointer inline-flex items-center gap-3'
      : 'px-8 py-4 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold text-xs tracking-widest uppercase shadow-[0_10px_25px_-5px_rgba(211,158,67,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(211,158,67,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer border border-amber-300/40 inline-flex items-center gap-3';

    return (
      <section id={id} className={`py-16 px-4 ${isCyber ? 'bg-zinc-950 text-white' : isBrutalist ? 'bg-stone-100 text-stone-950' : 'bg-[#FAF7F2] text-stone-900'} relative overflow-hidden text-center`}>
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge & Info Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border"
            style={{
              borderColor: data.accentColor || theme.accentColor || '#d39e43',
              color: data.accentColor || theme.accentColor || '#d39e43',
              backgroundColor: isCyber ? 'rgba(6,182,212,0.1)' : 'rgba(211,158,67,0.08)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{data.badge || 'Micro-Componente • Bottone Interattivo'}</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {renderRichText(data.title)}
          </h3>

          {data.subtitle && (
            <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${isCyber ? 'text-zinc-400' : 'text-stone-600'}`}>
              {data.subtitle}
            </p>
          )}

          {/* Live Button Container Showcase */}
          <div className={`p-8 sm:p-10 rounded-3xl my-6 flex flex-col items-center justify-center gap-4 ${isCyber ? 'bg-zinc-900/80 border border-zinc-800 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : isBrutalist ? 'bg-white border-2 border-stone-950 shadow-[6px_6px_0px_#0a0a0a]' : 'bg-white/80 backdrop-blur-md border border-stone-200/90 shadow-xl'}`}>
            <button
              onClick={handleCtaClick}
              className={`${data.tailwindClasses || defaultBtnClass} ${data.customCss ? 'btn-cyber-interactive btn-brutalist-authority btn-organic-shimmer btn-luxury-magnetic' : ''}`}
            >
              <span>{data.primaryCtaText || 'Clicca per Provare'}</span>
              {renderIcon(data.buttonIcon)}
            </button>

            {clickedFeedback && (
              <span className="text-xs font-mono text-emerald-500 animate-bounce inline-flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Azione interattiva eseguita con successo!
              </span>
            )}
          </div>

          {/* Micro-Features / Trust Items */}
          {data.items && data.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2 text-left">
              {data.items.map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border flex items-start gap-3 ${isCyber ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white/60 border-stone-200/80'}`}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: data.accentColor ? `${data.accentColor}20` : '#d39e4320', color: data.accentColor || '#d39e43' }}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-sans">{item.title}</h5>
                    <p className={`text-[11px] mt-0.5 leading-snug ${isCyber ? 'text-zinc-400' : 'text-stone-500'}`}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Copy CSS Button for developers */}
          {(data.customCss || data.tailwindClasses) && (
            <div className="pt-2">
              <button
                onClick={copyCssClasses}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-stone-200/60 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCss ? 'CSS & Tailwind Copiati!' : 'Copia CSS & Classi'}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // SCOPE 2: CARD STANDALONE / BENTO WIDGET
  // -------------------------------------------------------------
  if (data.componentScope === 'card') {
    const isCyber = data.visualStyle === 'cyber-glow';
    const isBrutalist = data.visualStyle === 'neo-brutalist';
    const isGlass = data.visualStyle === 'glassmorphism';

    return (
      <section id={id} className={`py-16 px-4 ${isCyber ? 'bg-zinc-950 text-white' : 'bg-[#FAF7F2] text-stone-900'} relative overflow-hidden`}>
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}

        <div className="max-w-4xl mx-auto">
          {/* Card Frame */}
          <div
            className={`p-8 sm:p-10 rounded-3xl ${
              isCyber
                ? 'bg-zinc-900/90 border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] bento-cyber-card'
                : isBrutalist
                ? 'bg-white border-2 border-stone-950 shadow-[7px_7px_0px_#0a0a0a]'
                : isGlass
                ? 'bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl border border-white/50 shadow-2xl glass-card-luxury'
                : 'bg-white border border-stone-200/90 shadow-xl editorial-card-luxury'
            } ${getMotionClass(data.motionEffect)}`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6"
              style={{ borderColor: isCyber ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
              <div>
                {data.badge && (
                  <span className={`text-[11px] font-mono uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded ${
                    isCyber ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {data.badge}
                  </span>
                )}
                <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
                  {renderRichText(data.title)}
                </h3>
              </div>
              {data.primaryCtaText && (
                <button
                  onClick={handleCtaClick}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shrink-0 ${
                    isCyber
                      ? 'bg-cyan-400 text-zinc-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : isBrutalist
                      ? 'bg-amber-400 text-stone-950 border-2 border-stone-950 shadow-[3px_3px_0px_#000]'
                      : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md'
                  }`}
                >
                  <span>{data.primaryCtaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {data.subtitle && (
              <p className={`mt-4 text-sm sm:text-base leading-relaxed ${isCyber ? 'text-zinc-300' : 'text-stone-600'}`}>
                {data.subtitle}
              </p>
            )}

            {/* Optional Side Image in Card */}
            {data.sideImage && (
              <div className="my-6 rounded-2xl overflow-hidden h-64 border border-stone-200/50">
                <img src={data.sideImage} alt={data.sideImageCaption || data.title} className="w-full h-full object-cover" />
                {data.sideImageCaption && (
                  <div className="p-2 text-[11px] font-mono uppercase bg-black/60 text-white text-center">
                    {data.sideImageCaption}
                  </div>
                )}
              </div>
            )}

            {/* Bento Grid / Items inside card */}
            {data.items && data.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {data.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
                      isCyber ? 'bg-zinc-950/70 border-zinc-800' : 'bg-stone-50/70 border-stone-200/70'
                    }`}
                  >
                    <div>
                      {item.tag && (
                        <span className={`text-[10px] font-mono uppercase font-semibold block mb-1 ${
                          isCyber ? 'text-cyan-400' : 'text-amber-800'
                        }`}>
                          {item.tag}
                        </span>
                      )}
                      <h4 className="font-bold text-sm leading-snug">{item.title}</h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isCyber ? 'text-zinc-400' : 'text-stone-500'}`}>
                        {item.description}
                      </p>
                    </div>
                    {item.value && (
                      <div className="pt-2 border-t border-dashed border-stone-300 dark:border-zinc-800">
                        <span className="font-mono text-base font-bold text-amber-500 dark:text-cyan-300">
                          {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // SCOPE 3: SEZIONI COMPLETE (Layout differenti)
  // -------------------------------------------------------------

  // Layout A: TIMELINE STORICA & TAPPE NARRATIVE
  if (data.layoutType === 'timeline') {
    return (
      <section id={id} className="py-20 md:py-28 bg-[#FAF7F2] text-stone-900 text-left relative overflow-hidden">
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            {data.badge && (
              <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">
                {data.badge}
              </span>
            )}
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold mt-2">
              {renderRichText(data.title)}
            </h2>
            {data.subtitle && (
              <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Timeline Nodes */}
          <div className="relative border-l-2 border-stone-300 ml-4 sm:ml-32 space-y-12">
            {data.items?.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10 group">
                {/* Node Milestone Pill on left for desktop */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#FAF7F2] group-hover:scale-125 transition-transform" />
                <div className="hidden sm:block absolute -left-32 top-0.5 w-24 text-right font-mono font-bold text-sm text-amber-800">
                  {item.value || `Fase 0${idx + 1}`}
                </div>

                <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="sm:hidden font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {item.value || `Fase 0${idx + 1}`}
                    </span>
                    {item.tag && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {data.primaryCtaText && (
            <div className="mt-14 text-center">
              <button
                onClick={handleCtaClick}
                style={{ backgroundColor: theme.primaryColor }}
                className="px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-md hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{data.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Layout B: LISTINO INTERATTIVO PREZZI & TRATTAMENTI
  if (data.layoutType === 'interactive-list') {
    return (
      <section id={id} className="py-20 md:py-28 bg-stone-950 text-white text-left relative overflow-hidden">
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            {data.badge && (
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
                {data.badge}
              </span>
            )}
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white mt-2">
              {renderRichText(data.title)}
            </h2>
            {data.subtitle && (
              <p className="text-stone-400 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {data.items?.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.08] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-100">
                      {item.title}
                    </h3>
                    {item.tag && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.value && (
                  <div className="shrink-0 sm:text-right">
                    <span className="font-editorial text-2xl sm:text-3xl font-bold text-amber-400">
                      {item.value}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {data.primaryCtaText && (
            <div className="mt-12 text-center">
              <button
                onClick={handleCtaClick}
                style={{ backgroundColor: data.accentColor || theme.accentColor || '#d39e43' }}
                className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-950 rounded-lg shadow-lg hover:brightness-110 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{data.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Layout C: STATS BAR
  if (data.layoutType === 'stats-bar') {
    return (
      <section id={id} className="py-16 md:py-20 bg-stone-900 text-white relative overflow-hidden text-left">
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            {data.badge && (
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
                {data.badge}
              </span>
            )}
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white mt-1.5">
              {renderRichText(data.title)}
            </h2>
            {data.subtitle && (
              <p className="text-xs sm:text-sm text-stone-400 mt-2 font-sans max-w-xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {data.items?.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center space-y-2 hover:-translate-y-1 transition-all">
                <div
                  className="font-editorial text-4xl sm:text-5xl font-bold"
                  style={{ color: data.accentColor || theme.accentColor || '#D39E43' }}
                >
                  {item.value || item.tag || `0${idx + 1}`}
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout D: SPLIT CARD
  if (data.layoutType === 'split-card') {
    return (
      <section id={id} className="py-20 md:py-28 bg-[#FAF7F2] border-t border-b border-stone-200/60 text-left">
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image Frame */}
            {data.sideImage && (
              <div className="lg:col-span-5 relative order-2 lg:order-1">
                <div
                  className="absolute inset-0 rounded-2xl transform rotate-2 translate-x-2 translate-y-2 opacity-25"
                  style={{ backgroundColor: data.accentColor || theme.primaryColor }}
                />
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100">
                  <img
                    src={data.sideImage}
                    alt={data.sideImageCaption || data.title}
                    className="w-full h-[400px] object-cover"
                  />
                  {data.sideImageCaption && (
                    <div className="p-3 bg-white/95 text-[11px] text-stone-600 font-mono tracking-wider uppercase border-t border-stone-200">
                      {data.sideImageCaption}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Right Text Content */}
            <div className={`space-y-6 ${data.sideImage ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl mx-auto'} order-1 lg:order-2`}>
              {data.badge && (
                <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
                  {data.badge}
                </span>
              )}
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
                {renderRichText(data.title)}
              </h2>
              {data.subtitle && (
                <p className="text-stone-600 text-base leading-relaxed font-sans">
                  {data.subtitle}
                </p>
              )}

              {/* Items list */}
              {data.items && data.items.length > 0 && (
                <div className="space-y-4 pt-2">
                  {data.items.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-4">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-editorial text-xl font-bold text-stone-900 leading-snug">
                            {item.title}
                          </h4>
                          {item.value && (
                            <span className="font-mono text-xs font-bold text-amber-800 shrink-0">
                              {item.value}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 font-sans mt-1 leading-relaxed">
                          {item.description}
                        </p>
                        {item.tag && (
                          <span className="inline-block mt-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data.primaryCtaText && (
                <div className="pt-2">
                  <button
                    onClick={handleCtaClick}
                    style={{ backgroundColor: data.accentColor || theme.primaryColor }}
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white rounded-md shadow-md hover:opacity-95 transition-opacity inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{data.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Layout E: BANNER CTA
  if (data.layoutType === 'banner-cta') {
    return (
      <section id={id} className="py-20 bg-stone-900 text-white relative overflow-hidden text-center">
        {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img src={data.backgroundImage} alt="Background" className="w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-950" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          {data.badge && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-white/10 text-amber-300 border border-white/20">
              {data.badge}
            </span>
          )}
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {renderRichText(data.title)}
          </h2>
          {data.subtitle && (
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          )}

          {data.items && data.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
              {data.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
                  {item.tag && <span className="text-[10px] font-mono uppercase text-amber-400">{item.tag}</span>}
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-stone-300">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {data.primaryCtaText && (
            <div className="pt-4">
              <button
                onClick={handleCtaClick}
                style={{ backgroundColor: data.accentColor || theme.primaryColor }}
                className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white rounded-lg shadow-lg hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{data.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Layout F (Default): FEATURE GRID
  return (
    <section id={id} className="py-20 md:py-28 bg-[#FAF7F2] text-left">
      {data.customCss && <style dangerouslySetInnerHTML={{ __html: data.customCss }} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {data.badge && (
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              {data.badge}
            </span>
          )}
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mt-2 tracking-tight">
            {renderRichText(data.title)}
          </h2>
          {data.subtitle && (
            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items?.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl overflow-hidden shadow-md border border-stone-200/90 flex flex-col justify-between ${getMotionClass(data.motionEffect)}`}
            >
              {item.image && (
                <div className="h-48 overflow-hidden bg-stone-100 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {item.value && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-white text-xs font-mono font-bold">
                      {item.value}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {item.tag && (
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 font-bold block mb-1">
                      {item.tag}
                    </span>
                  )}
                  <h3 className="font-editorial text-2xl font-bold text-stone-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2 font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.primaryCtaText && (
          <div className="mt-12 text-center">
            <button
              onClick={handleCtaClick}
              style={{ backgroundColor: data.accentColor || theme.primaryColor }}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white rounded-md shadow-sm hover:opacity-95 transition-opacity inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{data.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
