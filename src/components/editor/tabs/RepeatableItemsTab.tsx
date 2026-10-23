import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Image as ImageIcon, Check } from 'lucide-react';
import {
  Site,
  DishItem,
  GalleryItem,
  ReviewItem,
  SpaceItem,
  PillarItem,
} from '../../../types';

interface RepeatableItemsTabProps {
  site: Site;
  onChange: (updated: Partial<Site>) => void;
}

type RepeatableType = 'dishes' | 'gallery' | 'reviews' | 'spaces' | 'pillars';

export const RepeatableItemsTab: React.FC<RepeatableItemsTabProps> = ({ site, onChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<RepeatableType>('dishes');

  // Dish modal state
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Partial<DishItem> | null>(null);

  // Gallery modal state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<ReviewItem> | null>(null);

  // Spaces modal state
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Partial<SpaceItem> | null>(null);

  // Find sections
  const kitchenSec = site.sections.find((s) => s.type === 'kitchen');
  const gallerySec = site.sections.find((s) => s.type === 'gallery');
  const reviewsSec = site.sections.find((s) => s.type === 'reviews');
  const spacesSec = site.sections.find((s) => s.type === 'spaces');
  const manifestoSec = site.sections.find((s) => s.type === 'manifesto');

  // --- DISHES HANDLERS ---
  const saveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish || !editingDish.name) return;

    if (!kitchenSec) return;
    const currentDishes = [...kitchenSec.data.dishes];

    if (editingDish.id) {
      // update
      const idx = currentDishes.findIndex((d) => d.id === editingDish.id);
      if (idx >= 0) {
        currentDishes[idx] = editingDish as DishItem;
      }
    } else {
      // create
      const newDish: DishItem = {
        id: `dish-${Date.now()}`,
        name: editingDish.name || 'Nuovo Piatto',
        category: editingDish.category || 'Specialità',
        description: editingDish.description || '',
        price: editingDish.price || '€ 20',
        image:
          editingDish.image ||
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        dietaryTags: editingDish.dietaryTags || [],
        winePairing: editingDish.winePairing,
        highlighted: editingDish.highlighted,
      };
      currentDishes.push(newDish);
    }

    const updatedSections = site.sections.map((s) =>
      s.id === kitchenSec.id ? { ...s, data: { ...s.data, dishes: currentDishes } } : s
    );
    onChange({ sections: updatedSections });
    setDishModalOpen(false);
    setEditingDish(null);
  };

  const deleteDish = (dishId: string) => {
    if (!kitchenSec) return;
    const currentDishes = (kitchenSec.data.dishes || []).filter((d: any) => d.id !== dishId);
    const updatedSections = site.sections.map((s) =>
      s.id === kitchenSec.id ? { ...s, data: { ...s.data, dishes: currentDishes } } : s
    );
    onChange({ sections: updatedSections });
  };

  // --- GALLERY HANDLERS ---
  const saveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.imageUrl) return;
    if (!gallerySec) return;

    const currentItems = [...gallerySec.data.items];
    if (editingGallery.id) {
      const idx = currentItems.findIndex((g) => g.id === editingGallery.id);
      if (idx >= 0) currentItems[idx] = editingGallery as GalleryItem;
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: editingGallery.title || 'Nuovo Scatto',
        category: editingGallery.category || 'Tutti',
        imageUrl: editingGallery.imageUrl,
        aspectRatio: editingGallery.aspectRatio || 'square',
      };
      currentItems.push(newItem);
    }

    const updatedSections = site.sections.map((s) =>
      s.id === gallerySec.id ? { ...s, data: { ...s.data, items: currentItems } } : s
    );
    onChange({ sections: updatedSections });
    setGalleryModalOpen(false);
    setEditingGallery(null);
  };

  const deleteGallery = (itemId: string) => {
    if (!gallerySec) return;
    const currentItems = (gallerySec.data.items || []).filter((g: any) => g.id !== itemId);
    const updatedSections = site.sections.map((s) =>
      s.id === gallerySec.id ? { ...s, data: { ...s.data, items: currentItems } } : s
    );
    onChange({ sections: updatedSections });
  };

  // --- REVIEWS HANDLERS ---
  const saveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editingReview.quote) return;
    if (!reviewsSec) return;

    const currentReviews = [...reviewsSec.data.items];
    if (editingReview.id) {
      const idx = currentReviews.findIndex((r) => r.id === editingReview.id);
      if (idx >= 0) currentReviews[idx] = editingReview as ReviewItem;
    } else {
      const newReview: ReviewItem = {
        id: `rev-${Date.now()}`,
        author: editingReview.author || 'Cliente Felice',
        source: editingReview.source || 'Google Recensioni',
        rating: editingReview.rating || 5,
        quote: editingReview.quote,
        date: editingReview.date || 'Recente',
        verified: true,
      };
      currentReviews.push(newReview);
    }

    const updatedSections = site.sections.map((s) =>
      s.id === reviewsSec.id ? { ...s, data: { ...s.data, items: currentReviews } } : s
    );
    onChange({ sections: updatedSections });
    setReviewModalOpen(false);
    setEditingReview(null);
  };

  const deleteReview = (revId: string) => {
    if (!reviewsSec) return;
    const currentReviews = (reviewsSec.data.items || []).filter((r: any) => r.id !== revId);
    const updatedSections = site.sections.map((s) =>
      s.id === reviewsSec.id ? { ...s, data: { ...s.data, items: currentReviews } } : s
    );
    onChange({ sections: updatedSections });
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
          Gestione Elementi Ripetibili
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Modifica elenchi di pietanze, galleria fotografica, recensioni e sale.
        </p>
      </div>

      {/* Sub-tab pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSubTab('dishes')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'dishes'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Piatti & Menu ({kitchenSec?.data.dishes.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('gallery')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'gallery'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Galleria Foto ({gallerySec?.data.items.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'reviews'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Recensioni ({reviewsSec?.data.items.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('spaces')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'spaces'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Spazi & Sale ({spacesSec?.data.spaces.length || 0})
        </button>
      </div>

      {/* 1. DISHES TAB */}
      {activeSubTab === 'dishes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Piatti del Menu
            </h4>
            <button
              onClick={() => {
                setEditingDish({
                  name: '',
                  category: kitchenSec?.data.categories[0] || 'Antipasti',
                  description: '',
                  price: '€ ',
                  dietaryTags: [],
                });
                setDishModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-sm hover:bg-stone-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Aggiungi Piatto</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(kitchenSec?.data.dishes || []).map((dish: any) => (
              <div
                key={dish.id}
                className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-stone-900 truncate">
                        {dish.name}
                      </h5>
                      <span className="font-mono text-xs font-bold text-amber-800">
                        {dish.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      {dish.category} • {dish.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingDish({ ...dish });
                      setDishModalOpen(true);
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteDish(dish.id)}
                    className="p-1.5 text-stone-500 hover:text-red-600 rounded hover:bg-stone-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GALLERY TAB */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Immagini della Galleria
            </h4>
            <button
              onClick={() => {
                setEditingGallery({
                  title: '',
                  category: 'Piatti',
                  imageUrl: '',
                  aspectRatio: 'square',
                });
                setGalleryModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-sm hover:bg-stone-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Aggiungi Foto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(gallerySec?.data.items || []).map((item: any) => (
              <div
                key={item.id}
                className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center gap-3 shadow-2xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-stone-900 truncate">{item.title}</h5>
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingGallery({ ...item });
                      setGalleryModalOpen(true);
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-900"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteGallery(item.id)}
                    className="p-1.5 text-stone-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REVIEWS TAB */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Recensioni & Testimonianze
            </h4>
            <button
              onClick={() => {
                setEditingReview({
                  author: '',
                  source: 'Google Recensioni',
                  rating: 5,
                  quote: '',
                });
                setReviewModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-sm hover:bg-stone-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Aggiungi Recensione</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(reviewsSec?.data.items || []).map((rev: any) => (
              <div
                key={rev.id}
                className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{rev.author}</span>
                    <span className="text-[11px] font-mono text-stone-500">• {rev.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-600 font-bold">★ {rev.rating}</span>
                    <button
                      onClick={() => {
                        setEditingReview({ ...rev });
                        setReviewModalOpen(true);
                      }}
                      className="p-1 text-stone-400 hover:text-stone-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-stone-600 italic">"{rev.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SPACES TAB */}
      {activeSubTab === 'spaces' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Spazi & Sale del Locale
            </h4>
          </div>

          <div className="space-y-2.5">
            {(spacesSec?.data.spaces || []).map((sp: any) => (
              <div
                key={sp.id}
                className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
              >
                <img
                  src={sp.image}
                  alt={sp.name}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-stone-900">{sp.name}</h5>
                  <p className="text-[11px] text-stone-500 truncate">
                    {sp.capacity} • {sp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISH MODAL FORM */}
      {dishModalOpen && editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900">
              {editingDish.id ? 'Modifica Piatto' : 'Nuovo Piatto'}
            </h3>

            <form onSubmit={saveDish} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nome Piatto *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  placeholder="Es. Couscous di Pesce Trapanese"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editingDish.category || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                    placeholder="Es. Primi al Bronzo"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Prezzo *</label>
                  <input
                    type="text"
                    required
                    value={editingDish.price || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                    placeholder="€ 24"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-mono focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Descrizione & Ingredienti</label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  placeholder="Dettagli e note gastronomiche..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL Immagine</label>
                <input
                  type="url"
                  value={editingDish.image || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Vino Consigliato</label>
                <input
                  type="text"
                  value={editingDish.winePairing || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, winePairing: e.target.value })}
                  placeholder="Es. Grillo di Sicilia Tasca d'Almerita"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDishModalOpen(false)}
                  className="px-3 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Salva Piatto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {galleryModalOpen && editingGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              {editingGallery.id ? 'Modifica Foto' : 'Aggiungi Foto alla Galleria'}
            </h3>

            <form onSubmit={saveGallery} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Titolo / Didascalia *</label>
                <input
                  type="text"
                  required
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="Es. Tramonto sulla terrazza"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Categoria Filtro</label>
                <input
                  type="text"
                  value={editingGallery.category || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                  placeholder="Es. Piatti, Atmosfera, Terrazza"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL Immagine *</label>
                <input
                  type="url"
                  required
                  value={editingGallery.imageUrl || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-3 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Salva Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              {editingReview.id ? 'Modifica Recensione' : 'Aggiungi Recensione'}
            </h3>

            <form onSubmit={saveReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Autore / Testata *</label>
                <input
                  type="text"
                  required
                  value={editingReview.author || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, author: e.target.value })}
                  placeholder="Es. Guida Michelin / Marco R."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fonte</label>
                  <input
                    type="text"
                    value={editingReview.source || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, source: e.target.value })}
                    placeholder="Es. Google / TripAdvisor"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Punteggio (1-5)</label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  >
                    <option value={5}>5 Stelle (Eccellente)</option>
                    <option value={4}>4 Stelle (Molto Buono)</option>
                    <option value={3}>3 Stelle (Medio)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Citazione / Testo Recensione *</label>
                <textarea
                  rows={3}
                  required
                  value={editingReview.quote || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                  placeholder="«Un’esperienza memorabile...»"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-3 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Salva Recensione
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
