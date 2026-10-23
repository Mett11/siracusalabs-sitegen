import React, { useState } from 'react';
import { Site } from '../../../types';
import { Navbar } from './sections/Navbar';
import { HeroSection } from './sections/HeroSection';
import { ManifestoSection } from './sections/ManifestoSection';
import { KitchenSection } from './sections/KitchenSection';
import { SpacesSection } from './sections/SpacesSection';
import { GallerySection } from './sections/GallerySection';
import { ReviewsSection } from './sections/ReviewsSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './sections/Footer';
import { BookingModal } from './BookingModal';
import { CustomComponentSection } from '../common/CustomComponentSection';

interface GutkowskinoTemplateProps {
  site: Site;
  isEditorPreview?: boolean;
}

export const GutkowskinoTemplate: React.FC<GutkowskinoTemplateProps> = ({
  site,
  isEditorPreview = false,
}) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const activeSections = [...site.sections]
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen text-stone-900 transition-colors duration-300 relative"
      style={{
        backgroundColor: site.theme.backgroundColor || '#FAF7F2',
        color: site.theme.textColor || '#1F2421',
      }}
    >
      {/* Top Navbar */}
      <Navbar site={site} onOpenBooking={() => setBookingModalOpen(true)} />

      {/* Main Dynamic Sections */}
      <main>
        {activeSections.map((section) => {
          switch (section.type) {
            case 'hero':
              return (
                <HeroSection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                  onOpenBooking={() => setBookingModalOpen(true)}
                />
              );

            case 'manifesto':
              return (
                <ManifestoSection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                />
              );

            case 'kitchen':
              return (
                <KitchenSection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                  onOpenBooking={() => setBookingModalOpen(true)}
                />
              );

            case 'spaces':
              return (
                <SpacesSection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                />
              );

            case 'gallery':
              return (
                <GallerySection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                />
              );

            case 'reviews':
              return (
                <ReviewsSection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                />
              );

            case 'contact_info':
              return (
                <ContactSection
                  key={section.id}
                  data={section.data}
                  theme={site.theme}
                  onOpenBooking={() => setBookingModalOpen(true)}
                  bookingEnabled={site.booking.enabled}
                />
              );

            case 'custom_component':
              return (
                <CustomComponentSection
                  key={section.id}
                  id={section.id}
                  data={section.data}
                  theme={site.theme}
                  onOpenBooking={() => setBookingModalOpen(true)}
                />
              );

            default:
              return null;
          }
        })}
      </main>

      {/* Footer */}
      <Footer site={site} onOpenBooking={() => setBookingModalOpen(true)} />

      {/* Booking Reservation Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        bookingSettings={site.booking}
        primaryColor={site.theme.primaryColor}
        brandName={site.brand.name}
      />
    </div>
  );
};
