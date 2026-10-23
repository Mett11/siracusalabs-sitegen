import React, { useState } from 'react';
import { ArrowRight, Check, MapPin, Phone, Mail, Clock, Calendar, X, ChevronRight, Menu } from 'lucide-react';
import { Site, ServiceItem, TeamMember } from '../../../types';
import { renderRichText } from '../../../lib/richText';
import { CustomComponentSection } from '../common/CustomComponentSection';

interface AtelierMinimalTemplateProps {
  site: Site;
  isEditorPreview?: boolean;
}

export const AtelierMinimalTemplate: React.FC<AtelierMinimalTemplateProps> = ({
  site,
  isEditorPreview = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const activeSections = [...site.sections]
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen text-stone-900 transition-colors duration-300 font-sans"
      style={{
        backgroundColor: site.theme.backgroundColor || '#F8F9FA',
        color: site.theme.textColor || '#1A1D20',
      }}
    >
      {/* Sleek Minimal Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-left">
            <span className="font-display text-xl font-bold tracking-tight text-stone-900">
              {site.brand.name}
            </span>
            {site.brand.tagline && (
              <span className="text-[11px] text-stone-500 font-mono block">
                {site.brand.tagline}
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
            {site.navigation.map((nav) => (
              <a
                key={nav.id}
                href={`#${nav.targetSectionId}`}
                className="hover:text-stone-950 transition-colors"
              >
                {nav.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {site.booking.enabled && (
              <button
                onClick={() => setConsultModalOpen(true)}
                style={{ backgroundColor: site.theme.primaryColor }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white rounded-md shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{site.booking.ctaText || 'Contatta'}</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="md:hidden p-2 text-stone-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Render Dynamic Sections */}
      <main>
        {activeSections.map((sec) => {
          if (sec.type === 'hero') {
            const hData = sec.data;
            return (
              <section key={sec.id} id="section-hero" className="py-20 lg:py-28 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    {hData.badge && (
                      <span className="px-3 py-1 text-xs font-mono font-medium uppercase tracking-widest bg-stone-200/70 text-stone-700 rounded-md">
                        {hData.badge}
                      </span>
                    )}
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.12]">
                      {renderRichText(hData.headline)}
                    </h1>
                    <p className="text-stone-600 text-lg leading-relaxed max-w-xl">
                      {hData.subheadline}
                    </p>
                    <div className="pt-4 flex items-center gap-4">
                      {hData.primaryCtaText && (
                        <button
                          onClick={() => setConsultModalOpen(true)}
                          style={{ backgroundColor: site.theme.primaryColor }}
                          className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer"
                        >
                          <span>{hData.primaryCtaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-stone-200">
                      <img src={hData.heroImage} alt="Cover" className="w-full h-[440px] object-cover" />
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          if (sec.type === 'services') {
            const sData = sec.data;
            return (
              <section key={sec.id} id="section-services" className="py-20 bg-white border-y border-stone-200">
                <div className="max-w-7xl mx-auto px-6 text-left">
                  <div className="max-w-2xl mb-12">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                      Competenze
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                      {sec.title}
                    </h2>
                    {sData.leadText && <p className="text-stone-600 mt-2">{sData.leadText}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sData.services?.map((srv: ServiceItem, idx: number) => (
                      <div key={srv.id || idx} className="p-8 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-xs font-semibold uppercase text-stone-400">
                            0{idx + 1}
                          </span>
                          <h3 className="font-display text-xl font-bold text-stone-900 mt-3 mb-2">
                            {srv.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                        {srv.priceTag && (
                          <div className="mt-6 pt-4 border-t border-stone-200 text-xs font-mono text-stone-700">
                            {srv.priceTag}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (sec.type === 'manifesto') {
            const mData = sec.data;
            return (
              <section key={sec.id} id="section-manifesto" className="py-20 max-w-7xl mx-auto px-6 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <blockquote className="font-display text-2xl sm:text-3xl italic text-stone-900 leading-relaxed">
                      {renderRichText(mData.quote)}
                    </blockquote>
                    {mData.quoteAuthor && (
                      <cite className="block text-xs uppercase font-mono text-stone-500 not-italic">
                        — {mData.quoteAuthor}
                      </cite>
                    )}
                    <p className="text-stone-600 text-base">{mData.description}</p>
                  </div>
                  <div className="lg:col-span-5">
                    <img src={mData.sideImage} alt="Manifesto" className="rounded-xl shadow-lg border border-stone-200 w-full h-[360px] object-cover" />
                  </div>
                </div>
              </section>
            );
          }

          if (sec.type === 'team') {
            const tData = sec.data;
            return (
              <section key={sec.id} id="section-team" className="py-20 bg-stone-100/70 border-t border-stone-200 text-left">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="max-w-2xl mb-12">
                    <h2 className="font-display text-3xl font-bold text-stone-900">{sec.title}</h2>
                    {tData.leadText && <p className="text-stone-600 mt-2">{tData.leadText}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tData.members?.map((m: TeamMember, idx: number) => (
                      <div key={m.id || idx} className="bg-white p-6 rounded-xl border border-stone-200 flex gap-6 items-center">
                        <img src={m.image} alt={m.name} className="w-24 h-24 rounded-full object-cover shrink-0 border border-stone-200" />
                        <div>
                          <h3 className="font-display text-lg font-bold text-stone-900">{m.name}</h3>
                          <div className="text-xs font-mono text-stone-500 mb-2">{m.role}</div>
                          <p className="text-xs text-stone-600">{m.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (sec.type === 'contact_info') {
            const cData = sec.data;
            return (
              <section key={sec.id} id="section-contact" className="py-20 bg-white border-t border-stone-200 text-left">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="font-display text-3xl font-bold text-stone-900">{sec.title}</h2>
                    <p className="text-stone-600 mt-2 text-sm">{cData.openingHoursSummary}</p>
                    <div className="mt-8 space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-stone-400" />
                        <span>{cData.address}, {cData.postalCode} {cData.city}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-stone-400" />
                        <a href={`tel:${cData.phone}`} className="hover:underline">{cData.phone}</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <a href={`mailto:${cData.email}`} className="hover:underline">{cData.email}</a>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-center">
                    <h3 className="font-display text-xl font-bold text-stone-900 mb-2">{site.booking.title || 'Richiedi Informazioni'}</h3>
                    <p className="text-xs text-stone-600 mb-6">{site.booking.description}</p>
                    <button
                      onClick={() => setConsultModalOpen(true)}
                      style={{ backgroundColor: site.theme.primaryColor }}
                      className="w-full py-3 text-white text-xs font-semibold uppercase tracking-wider rounded-md"
                    >
                      {site.booking.ctaText || 'Contattaci Subito'}
                    </button>
                  </div>
                </div>
              </section>
            );
          }

          if (sec.type === 'custom_component') {
            return (
              <CustomComponentSection
                key={sec.id}
                id={sec.id}
                data={sec.data}
                theme={site.theme}
                onOpenBooking={() => setConsultModalOpen(true)}
              />
            );
          }

          return null;
        })}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-stone-900 text-stone-400 text-xs border-t border-stone-800 text-center">
        <p>© {new Date().getFullYear()} {site.brand.name}. {site.brand.footerClaim}</p>
      </footer>

      {/* Simple consultation modal */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-left relative">
            <button onClick={() => setConsultModalOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-stone-900 mb-1">{site.booking.title || 'Contattaci'}</h3>
            <p className="text-xs text-stone-500 mb-4">{site.booking.description}</p>
            <div className="space-y-3">
              <input type="text" placeholder="Il tuo nome" className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
              <input type="email" placeholder="Indirizzo email" className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
              <textarea placeholder="Come possiamo aiutarti?" rows={3} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md resize-none" />
              <button
                onClick={() => setConsultModalOpen(false)}
                style={{ backgroundColor: site.theme.primaryColor }}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white rounded-md"
              >
                Invia Richiesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
