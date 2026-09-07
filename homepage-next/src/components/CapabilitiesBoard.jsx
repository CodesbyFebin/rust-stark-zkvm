'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { STATUS_COLORS, STATUS_LABELS } from '../lib/constants';
import { CATEGORIES, ITEMS, NOT_PLANNED_COLOR, NOT_PLANNED_LABEL } from '../lib/capabilities-data';

const STATUS_ORDER = ['implemented', 'roadmap', 'research', 'not-planned'];

function statusStyle(status) {
  return status === 'not-planned' ? NOT_PLANNED_COLOR : STATUS_COLORS[status];
}

function statusLabel(status) {
  return status === 'not-planned' ? NOT_PLANNED_LABEL : STATUS_LABELS[status];
}

function ItemCard({ item, expanded, onToggle }) {
  return (
    <div
      className={`border bg-black/50 p-5 transition-all cursor-pointer ${
        expanded ? 'border-[#00ff41]/50 bg-[#00ff41]/5' : 'border-[#00ff41]/15 hover:border-[#00ff41]/40'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-mono text-sm font-bold text-white">{item.title}</h3>
        <span className={`font-mono text-[9px] px-2 py-0.5 border whitespace-nowrap ${statusStyle(item.status)}`}>
          {statusLabel(item.status)}
        </span>
      </div>
      <p className="font-mono text-xs text-gray-500 leading-relaxed">{item.desc}</p>
      {expanded && (
        <div className="border-t border-[#00ff41]/10 pt-3 mt-3">
          <p className="font-mono text-xs text-gray-300 leading-relaxed mb-2">{item.detail}</p>
          {item.external ? (
            <a href={item.link} className="font-mono text-[10px] text-[#00ff41] underline">
              Full detail &rarr;
            </a>
          ) : (
            <Link href={item.link} className="font-mono text-[10px] text-[#00ff41] underline">
              Full detail &rarr;
            </Link>
          )}
        </div>
      )}
      <div className="font-mono text-[10px] text-gray-600 mt-2">
        {expanded ? '▲ click to collapse' : '▼ click to expand'}
      </div>
    </div>
  );
}

export default function CapabilitiesBoard() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const q = query.toLowerCase();
      const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const counts = useMemo(() => {
    const c = { implemented: 0, roadmap: 0, research: 0, 'not-planned': 0 };
    ITEMS.forEach((item) => { c[item.status] += 1; });
    return c;
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 not-prose">
        {STATUS_ORDER.map((s) => (
          <div key={s} className={`border p-4 text-center ${statusStyle(s)}`}>
            <div className="font-mono text-2xl font-bold">{counts[s]}</div>
            <div className="font-mono text-[9px] tracking-wider mt-1">{statusLabel(s)}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search capabilities..."
          className="w-full bg-black border border-[#00ff41]/30 font-mono text-sm text-[#00ff41] px-4 py-3 focus:outline-none focus:border-[#00ff41]/60 placeholder:text-gray-600"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-10 not-prose">
        <button
          onClick={() => setCategory('all')}
          className={`px-3 py-1.5 font-mono text-[11px] border ${category === 'all' ? 'border-[#00ff41]/50 bg-[#00ff41]/10 text-[#00ff41]' : 'border-gray-700 text-gray-500'}`}
        >
          ALL ({ITEMS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const n = ITEMS.filter((i) => i.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 font-mono text-[11px] border ${category === cat.id ? 'border-[#00ff41]/50 bg-[#00ff41]/10 text-[#00ff41]' : 'border-gray-700 text-gray-500'}`}
            >
              {cat.icon} {cat.label.toUpperCase()} ({n})
            </button>
          );
        })}
      </div>

      <div className="space-y-12">
        {CATEGORIES.map((cat) => {
          const items = filtered.filter((i) => i.category === cat.id);
          if (items.length === 0) return null;
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41]">{cat.icon}</div>
                <h2 className="font-mono text-sm font-bold text-white tracking-wide">{cat.label}</h2>
                <div className="flex-1 h-px bg-[#00ff41]/10" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="font-mono text-sm text-gray-500 text-center py-10">No capabilities match that search.</p>
        )}
      </div>
    </>
  );
}
