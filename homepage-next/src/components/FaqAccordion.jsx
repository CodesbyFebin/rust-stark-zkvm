'use client';

import { useState } from 'react';

export default function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, idx) => (
        <div key={idx} className="border border-[#00ff41]/20 bg-black/50">
          <button
            onClick={() => setOpen(open === idx ? -1 : idx)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-mono text-sm text-white hover:text-[#00ff41] transition-colors"
          >
            <span>{item.q}</span>
            <span className={`text-[#00ff41] transition-transform ${open === idx ? 'rotate-45' : ''}`}>+</span>
          </button>
          {open === idx && (
            <div className="px-5 pb-4 font-mono text-xs text-gray-400 leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
