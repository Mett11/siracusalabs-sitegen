import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Site } from '../../../../types';
import { OliveBranchIcon } from '../GutkowskinoIcons';

interface FooterProps {
  site: Site;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ site, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C201D] text-stone-300 pt-16 pb-12 border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: site.theme.primaryColor }}
              >
                <OliveBranchIcon className="w-4 h-4" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                {site.brand.name}
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-sans">
              {site.brand.footerClaim || site.brand.tagline}
            </p>

            <div className="text-[11px] text-stone-500 font-mono">
              Trapani (Sicilia) • {site.contact.address}
            </div>
          </div>

          {/* Quick links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-200">
              Navigazione
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {site.navigation.map((nav) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.targetSectionId}`}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {nav.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contacts & Socials (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-200">
              Contatti Rapidi
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div>Tel: <a href={`tel:${site.contact.phone}`} className="text-white hover:underline">{site.contact.phone}</a></div>
              <div>Email: <a href={`mailto:${site.contact.email}`} className="text-white hover:underline">{site.contact.email}</a></div>
              <div className="pt-2 text-[11px] text-stone-500 font-mono">
                {site.contact.openingHoursSummary}
              </div>
            </div>

            {site.booking.enabled && (
              <button
                onClick={onOpenBooking}
                style={{ backgroundColor: site.theme.primaryColor }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                {site.booking.ctaText || 'Prenota un Tavolo'}
              </button>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {site.brand.name}. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Torna in alto</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
