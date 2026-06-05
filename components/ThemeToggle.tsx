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
      className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
    >
      {dark ? (
        <span className="inline-flex items-center gap-2">
          <Sun size={16} /> Světlý režim
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Moon size={16} /> Tmavý režim
        </span>
      )}
    </button>
  );
}
