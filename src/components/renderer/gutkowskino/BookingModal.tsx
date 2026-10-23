import React, { useState } from 'react';
import { X, Calendar, Users, Clock, CheckCircle2, Phone, Mail } from 'lucide-react';
import { BookingSettings } from '../../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingSettings: BookingSettings;
  primaryColor?: string;
  brandName?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingSettings,
  primaryColor = '#8C3823',
  brandName = 'Osteria Gutkowskino',
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: '2',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] text-[#1F2421] rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              {brandName}
            </span>
            <h3 className="font-editorial text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
              {bookingSettings.title || 'Prenota un Tavolo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'success' ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                Richiesta di Prenotazione Inviata!
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto mb-6">
                Grazie {formData.name || 'Gentile Ospite'}. Abbiamo ricevuto la tua richiesta per {formData.guests} persone il {formData.date} alle ore {formData.time}. Ti contatteremo a breve per la conferma telefonica.
              </p>
              <div className="p-4 bg-stone-100 rounded-lg text-xs text-stone-600 text-left mb-6 space-y-1">
                <div><strong>Ospite:</strong> {formData.name}</div>
                <div><strong>Data & Ora:</strong> {formData.date} ore {formData.time}</div>
                <div><strong>Telefono:</strong> {formData.phone}</div>
                {formData.notes && <div><strong>Note:</strong> {formData.notes}</div>}
              </div>
              <button
                onClick={handleReset}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Chiudi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {bookingSettings.description ||
                  'Compila i dettagli e il nostro staff preparerà il tavolo ideale per la tua esperienza culinaria.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Nome e Cognome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mario Rossi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Recapito Telefonico *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+39 333 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" /> Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" /> Ora *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="12:30">12:30 (Pranzo)</option>
                    <option value="13:15">13:15 (Pranzo)</option>
                    <option value="14:00">14:00 (Pranzo)</option>
                    <option value="19:30">19:30 (Cena)</option>
                    <option value="20:15">20:15 (Cena)</option>
                    <option value="21:00">21:00 (Cena)</option>
                    <option value="21:45">21:45 (Cena)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-500" /> Persone *
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="1">1 Ospite</option>
                    <option value="2">2 Ospiti</option>
                    <option value="3">3 Ospiti</option>
                    <option value="4">4 Ospiti</option>
                    <option value="5">5 Ospiti</option>
                    <option value="6">6 Ospiti</option>
                    <option value="7+">7+ Ospiti (Gruppo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Email di Conferma
                </label>
                <input
                  type="email"
                  placeholder="mario@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Allergie, Preferenze o Richieste Speciali
                </label>
                <textarea
                  rows={2}
                  placeholder="Es. Tavolo all'aperto se disponibile, intolleranze al glutine o celiachia..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: primaryColor }}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white rounded-lg shadow-md hover:opacity-95 transition-opacity"
                >
                  Invia Prenotazione
                </button>
              </div>

              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
                {bookingSettings.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    Oppure chiama: <strong className="text-stone-700">{bookingSettings.phone}</strong>
                  </span>
                )}
                {bookingSettings.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    {bookingSettings.email}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
