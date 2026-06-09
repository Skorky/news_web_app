'use client';

import { useState } from 'react';
import {
  Bot,
  ExternalLink,
  Flame,
  Lock,
  Send,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import { NewsItem } from '@/lib/types';
type AiMessage = {
  question: string;
  answer: string;
};

export function NewsCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState('');
  const [shareNotice, setShareNotice] = useState('');

  async function askAi() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    setAsking(true);
    setAskError('');

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,

          summaryCz: item.summaryCz,

          whyItMatters: item.whyItMatters,

          source: item.source,

          question: trimmedQuestion,

          history: messages,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Nepodařilo se získat odpověď.');
      }

      setMessages((current) => [
        ...current,

        {
          question: trimmedQuestion,

          answer: payload.answer || 'AI nevrátila žádnou odpověď.',
        },
      ]);

      setQuestion('');
    } catch (error) {
      setAskError(
        error instanceof Error ? error.message : 'Nepodařilo se získat odpověď.'
      );
    } finally {
      setAsking(false);
    }
  }

  async function shareArticle() {
    const shareText = `${item.title}\n\n${item.summaryCz}\n\n${item.url}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,

          text: item.summaryCz,

          url: item.url,
        });
      } else {
        await navigator.clipboard.writeText(shareText);

        setShareNotice('Odkaz zkopírován.');

        setTimeout(() => setShareNotice(''), 2500);
      }
    } catch {
      // uživatel mohl zavřít sdílení
    }
  }

  return (
    <article
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-800"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {item.source}
        </span>

        <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <Flame size={14} /> Důležitost {item.importance}/10
        </span>

        {item.topics.includes('investigations') && (
          <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <ShieldAlert size={14} /> Investigativa
          </span>
        )}

        {item.paywall !== 'ne' && (
          <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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
        <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          <strong>Proč je to důležité:</strong> {item.whyItMatters}
        </div>
      )}

      {expanded && askOpen && (
        <div
          className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900"
          onClick={(event) => event.stopPropagation()}
        >
          <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Dotaz k článku
          </label>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Na co se chceš zeptat?"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />

          <button
            onClick={askAi}
            disabled={asking || !question.trim()}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Send size={16} />
            {asking ? 'Ptám se AI…' : 'Zeptat se'}
          </button>

          {askError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              {askError}
            </p>
          )}

          {messages.length > 0 && (
            <div className="mt-4 space-y-4">
              {messages.map((message, index) => (
                <div key={`${message.question}-${index}`} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-sm leading-6 text-white">
                      {message.question}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
                      {message.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleString('cs-CZ')
            : 'Čas neznámý'}
        </span>

        {expanded && (
          <div className="mt-3 grid w-full grid-cols-3 border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <button
              onClick={(event) => {
                event.stopPropagation();
                setAskOpen((current) => !current);
              }}
              className="inline-flex items-center justify-center gap-1 text-center text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              <Bot size={14} />
              {askOpen ? 'Zavřít AI dotaz' : 'Zeptat se AI'}
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();

                shareArticle();
              }}
              className="inline-flex items-center justify-center gap-1 text-center text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              <Share2 size={14} />
              Sdílet
            </button>

            <a
              className="inline-flex items-center justify-center gap-1 text-center text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-100"
              href={item.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              Otevřít článek <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {shareNotice && (
        <div className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {shareNotice}
        </div>
      )}

      {!expanded && (
        <div className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Klikni pro detail
        </div>
      )}
    </article>
  );
}
