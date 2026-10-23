import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { Site, NavItem } from '../../../../types';
import { OliveBranchIcon } from '../GutkowskinoIcons';

interface NavbarProps {
  site: Site;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ site, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setMobileMenuOpen(false);
    if (item.isExternal && item.externalUrl) {
      window.open(item.externalUrl, '_blank');
      return;
    }
    const targetEl = document.getElementById(item.targetSectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3'
          : 'bg-[#FAF7F2] border-b border-stone-200/60 py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a href="#section-hero" className="flex items-center gap-2.5 group text-left">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${site.theme.primaryColor}15`, color: site.theme.primaryColor }}
          >
            <OliveBranchIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900 group-hover:opacity-90">
                {site.brand.name}
              </span>
              {site.brand.establishedYear && (
                <span className="text-[10px] tracking-widest uppercase font-mono text-stone-400 hidden sm:inline">
                  dal {site.brand.establishedYear}
                </span>
              )}
            </div>
            {site.brand.tagline && (
              <p className="text-[11px] text-stone-500 font-sans tracking-wide truncate max-w-[200px] sm:max-w-xs">
                {site.brand.tagline}
              </p>
            )}
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {site.navigation
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="text-xs uppercase tracking-widest font-medium text-stone-700 hover:text-stone-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-stone-900 after:transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {site.booking.enabled && (
            <button
              onClick={onOpenBooking}
              style={{ backgroundColor: site.theme.primaryColor }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              {site.booking.ctaText || 'Prenota'}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu di navigazione'}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#FAF7F2] border-b border-stone-200 shadow-xl p-6 transition-all animate-fade-in z-50">
          <nav className="flex flex-col space-y-4">
            {site.navigation
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="text-left text-base font-medium text-stone-800 hover:text-stone-950 py-2 border-b border-stone-200/50"
                >
                  {item.label}
                </button>
              ))}

            {site.booking.enabled && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                style={{ backgroundColor: site.theme.primaryColor }}
                className="w-full mt-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white rounded-md shadow-sm"
              >
                {site.booking.ctaText || 'Prenota un Tavolo'}
              </button>
            )}

            <div className="pt-4 text-xs text-stone-500 space-y-1">
              <div>{site.contact.address}, {site.contact.city}</div>
              <div>Tel: {site.contact.phone}</div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
