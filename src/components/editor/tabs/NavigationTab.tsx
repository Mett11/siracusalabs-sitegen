import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Site, NavItem } from '../../../types';

interface NavigationTabProps {
  site: Site;
  onChange: (updated: Partial<Site>) => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ site, onChange }) => {
  const [newLabel, setNewLabel] = useState('');
  const [newTarget, setNewTarget] = useState('section-hero');

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const items = [...site.navigation];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    // reindex order
    items.forEach((item, i) => {
      item.order = i + 1;
    });

    onChange({ navigation: items });
  };

  const deleteItem = (id: string) => {
    const items = site.navigation.filter((i) => i.id !== id);
    onChange({ navigation: items });
  };

  const updateItemLabel = (id: string, label: string) => {
    const items = site.navigation.map((i) => (i.id === id ? { ...i, label } : i));
    onChange({ navigation: items });
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      targetSectionId: newTarget,
      order: site.navigation.length + 1,
    };

    onChange({ navigation: [...site.navigation, newItem] });
    setNewLabel('');
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
          Voci del Menu di Navigazione
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Modifica le etichette, riordina i link o collega nuove sezioni alla navbar.
        </p>
      </div>

      {/* Nav items list */}
      <div className="space-y-2">
        {site.navigation
          .sort((a, b) => a.order - b.order)
          .map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-stone-200 rounded-lg flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="font-mono text-xs text-stone-400 w-5">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItemLabel(item.id, e.target.value)}
                  className="px-2.5 py-1 text-xs font-medium border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 w-36 sm:w-44"
                />
                <span className="text-[11px] font-mono text-stone-500 truncate hidden sm:inline">
                  → #{item.targetSectionId}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, 'up')}
                  className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === site.navigation.length - 1}
                  onClick={() => moveItem(index, 'down')}
                  className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add new nav item */}
      <form onSubmit={addItem} className="pt-4 border-t border-stone-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Aggiungi Voce di Menu
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Etichetta (es. Chi Siamo)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
          <select
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            {site.sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} (#{s.id})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!newLabel.trim()}
          className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-md hover:bg-stone-800 disabled:opacity-40 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Aggiungi Voce</span>
        </button>
      </form>
    </div>
  );
};
