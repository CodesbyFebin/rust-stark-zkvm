'use client';

import { useState, useEffect } from 'react';
import { TERMINAL_LINES } from '../lib/constants';

// Reveals TERMINAL_LINES one at a time. Written so a duplicate effect
// invocation (StrictMode, HMR, or otherwise) can only ever converge the
// count toward the same end state -- never index past the array's end.
export default function HeroTerminal() {
  const [terminalCount, setTerminalCount] = useState(0);

  useEffect(() => {
    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setTerminalCount((c) => {
          const next = Math.min(c + 1, TERMINAL_LINES.length);
          if (next >= TERMINAL_LINES.length) clearInterval(intervalId);
          return next;
        });
      }, 350);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="p-6 font-mono text-sm min-h-[320px]">
      {TERMINAL_LINES.slice(0, terminalCount).map((line, idx) => (
        <div
          key={idx}
          className={`mb-1 animate-fadeUp ${
            line.type === 'command' ? 'text-white' :
            line.type === 'success' ? 'text-[#00ff41]' :
            line.type === 'info' ? 'text-gray-400' : 'text-[#00ff41]'
          }`}
          style={{ animationDuration: '0.25s' }}
        >
          {line.text}
          {line.type === 'cursor' && <span className="inline-block w-2 h-4 bg-[#00ff41] ml-1 animate-pulse" />}
        </div>
      ))}
    </div>
  );
}
