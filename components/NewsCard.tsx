'use client';

import { useState } from 'react';
import { ExternalLink, Flame, Lock, ShieldAlert } from 'lucide-react';
import { NewsItem } from '@/lib/types';

export function NewsCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-800"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <span className="rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1 font-medium">{item.source}</span>
        <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1">
          <Flame size={14} /> Důležitost {item.importance}/10
        </span>

        {item.topics.includes('investigations') && (
          <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1">
            <ShieldAlert size={14} /> Investigativa
          </span>
        )}

        {item.paywall !== 'ne' && (
          <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1">
            <Lock size={14} /> Paywall: {item.paywall}
          </span>
        )}
      </div>

      <h2 className="text-lg font-semibold leading-snug text-zinc-950 dark:text-zinc-100">
        {item.title}
      </h2>

      <p
        className={
          expanded
            ? 'mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300'
            : 'mt-3 line-clamp-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300'
        }
      >
        {item.summaryCz}
      </p>

      {expanded && (
        <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <strong>Proč je to důležité:</strong> {item.whyItMatters}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleString('cs-CZ')
            : 'Čas neznámý'}
        </span>

        {expanded && (
          <a
            className="inline-flex items-center gap-1 font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            Otevřít článek <ExternalLink size={14} />
          </a>
        )}
      </div>

      {!expanded && (
        <div className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Klikni pro detail
        </div>
      )}
    </article>
  );
}