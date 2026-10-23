import React from 'react';
import { Site, OpeningHourItem } from '../../../types';

interface ContactBookingTabProps {
  site: Site;
  onChange: (updated: Partial<Site>) => void;
}

export const ContactBookingTab: React.FC<ContactBookingTabProps> = ({ site, onChange }) => {
  const updateHourItem = (index: number, updatedItem: Partial<OpeningHourItem>) => {
    const list = [...site.contact.hoursSchedule];
    list[index] = { ...list[index], ...updatedItem };
    onChange({
      contact: { ...site.contact, hoursSchedule: list },
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
          Contatti, Orari & Prenotazioni
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Gestisci i recapiti pubblici, gli orari di servizio e le impostazioni del modulo di prenotazione.
        </p>
      </div>

      {/* Booking Form Config */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Modulo Prenotazioni Tavoli / Contatto
          </label>
          <input
            type="checkbox"
            checked={site.booking.enabled}
            onChange={(e) =>
              onChange({
                booking: { ...site.booking, enabled: e.target.checked },
              })
            }
            className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
          />
        </div>

        {site.booking.enabled && (
          <div className="space-y-3 pt-2 border-t border-stone-200/60">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Titolo Modulo
              </label>
              <input
                type="text"
                value={site.booking.title}
                onChange={(e) =>
                  onChange({
                    booking: { ...site.booking, title: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Etichetta Pulsante CTA
              </label>
              <input
                type="text"
                value={site.booking.ctaText}
                onChange={(e) =>
                  onChange({
                    booking: { ...site.booking, ctaText: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Descrizione / Nota Informativa
              </label>
              <textarea
                rows={2}
                value={site.booking.description}
                onChange={(e) =>
                  onChange({
                    booking: { ...site.booking, description: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Recapiti & Posizione
        </h4>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Indirizzo (Via e Civico) *
          </label>
          <input
            type="text"
            value={site.contact.address}
            onChange={(e) =>
              onChange({
                contact: { ...site.contact, address: e.target.value },
              })
            }
            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Città e Provincia *
            </label>
            <input
              type="text"
              value={site.contact.city}
              onChange={(e) =>
                onChange({
                  contact: { ...site.contact, city: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">CAP</label>
            <input
              type="text"
              value={site.contact.postalCode}
              onChange={(e) =>
                onChange({
                  contact: { ...site.contact, postalCode: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono focus:ring-2 focus:ring-stone-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Telefono *</label>
            <input
              type="tel"
              value={site.contact.phone}
              onChange={(e) =>
                onChange({
                  contact: { ...site.contact, phone: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label>
            <input
              type="email"
              value={site.contact.email}
              onChange={(e) =>
                onChange({
                  contact: { ...site.contact, email: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Link Google Maps (Indicazioni stradali)
          </label>
          <input
            type="url"
            value={site.contact.googleMapsUrl}
            onChange={(e) =>
              onChange({
                contact: { ...site.contact, googleMapsUrl: e.target.value },
              })
            }
            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
          />
        </div>
      </div>

      {/* Opening Hours Schedule */}
      <div className="pt-6 border-t border-stone-200 space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Orari di Servizio
          </label>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Personalizza gli orari giorno per giorno e segnala i giorni di chiusura.
          </p>
        </div>

        <div className="space-y-2">
          {site.contact.hoursSchedule.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-white border border-stone-200 rounded-lg flex items-center justify-between gap-3 shadow-2xs"
            >
              <input
                type="text"
                value={item.dayLabel}
                onChange={(e) => updateHourItem(idx, { dayLabel: e.target.value })}
                className="w-32 px-2 py-1 text-xs font-bold text-stone-800 border border-stone-300 rounded"
              />
              <input
                type="text"
                value={item.hours}
                onChange={(e) => updateHourItem(idx, { hours: e.target.value })}
                className="flex-1 px-2 py-1 text-xs font-mono text-stone-700 border border-stone-300 rounded"
              />
              <label className="flex items-center gap-1 text-[11px] text-stone-500 shrink-0">
                <input
                  type="checkbox"
                  checked={item.closed || false}
                  onChange={(e) => updateHourItem(idx, { closed: e.target.checked })}
                />
                Chiuso
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
