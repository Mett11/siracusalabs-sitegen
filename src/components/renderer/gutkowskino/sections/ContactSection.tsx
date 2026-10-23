import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, Calendar } from 'lucide-react';
import { ContactInfo, ThemeTokens } from '../../../../types';

interface ContactSectionProps {
  data: ContactInfo;
  theme: ThemeTokens;
  onOpenBooking: () => void;
  bookingEnabled?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  data,
  theme,
  onOpenBooking,
  bookingEnabled = true,
}) => {
  return (
    <section id="section-contact" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
            Dove Trovarci
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mt-2 tracking-tight">
            Posizione & Orari
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
            Affacciati sul lungomare di Trapani, a pochi passi dalle antiche saline e dal porto per le Egadi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Orari di Apertura (6 cols) */}
          <div className="lg:col-span-6 bg-white p-8 rounded-2xl shadow-md border border-stone-200 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-stone-900">
                    Orari di Servizio
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    {data.openingHoursSummary}
                  </p>
                </div>
              </div>

              {/* Hours schedule table */}
              <div className="space-y-3">
                {data.hoursSchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-2 text-xs border-b border-stone-100 last:border-b-0 ${
                      item.closed ? 'text-amber-800 font-medium' : 'text-stone-700'
                    }`}
                  >
                    <span className="font-semibold uppercase tracking-wider">{item.dayLabel}</span>
                    <span className="font-mono text-stone-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {bookingEnabled && (
              <div className="mt-8 pt-6 border-t border-stone-100">
                <button
                  onClick={onOpenBooking}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-full py-3 text-xs font-semibold uppercase tracking-widest text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Prenota Ora il Tuo Tavolo</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Contatti & Mappa Interattiva (6 cols) */}
          <div className="lg:col-span-6 bg-white p-8 rounded-2xl shadow-md border border-stone-200 flex flex-col justify-between text-left space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: `${theme.secondaryColor}15`, color: theme.secondaryColor }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-stone-900">
                    Recapiti & Indicazioni
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Siamo sempre raggiungibili per richieste e informazioni
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Indirizzo
                    </div>
                    <div className="text-sm font-medium text-stone-900 mt-0.5">
                      {data.address}, {data.postalCode} {data.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Telefono
                    </div>
                    <a
                      href={`tel:${data.phone}`}
                      className="text-sm font-medium text-stone-900 hover:text-amber-700 transition-colors mt-0.5 block"
                    >
                      {data.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Email
                    </div>
                    <a
                      href={`mailto:${data.email}`}
                      className="text-sm font-medium text-stone-900 hover:text-amber-700 transition-colors mt-0.5 block"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-stone-500 uppercase">
                    Coordinate GPS
                  </span>
                  <p className="text-xs font-medium text-stone-800">
                    Costa di Trapani • Fronte Isole Egadi
                  </p>
                </div>
                {data.googleMapsUrl && (
                  <a
                    href={data.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
                  >
                    <span>Apri in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
