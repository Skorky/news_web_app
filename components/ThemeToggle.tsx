'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const shouldBeDark = saved === 'dark';

    setDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  function toggleTheme() {
    const next = !dark;

    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 sm:h-auto sm:w-auto sm:px-4 sm:py-2"
    >
      {dark ? (
        <span className="inline-flex items-center gap-2">
          <Sun size={18} />
          <span className="hidden text-sm font-semibold sm:inline">
            Světlý režim
          </span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Moon size={18} />
          <span className="hidden text-sm font-semibold sm:inline">
            Tmavý režim
          </span>
        </span>
      )}
    </button>
  );
}
