"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { regions, topics } from "@/lib/config";
import { NewsItem, Region, Topic } from "@/lib/types";
import { NewsCard } from "@/components/NewsCard";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [activeRegion, setActiveRegion] = useState<Region>("world");
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(["top"]);
  const [itemsByRegion, setItemsByRegion] = useState<
    Record<string, NewsItem[]>
  >({});
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dailySummary, setDailySummary] = useState("");

  const [summaryOpen, setSummaryOpen] = useState(false);

  const [summaryLoading, setSummaryLoading] = useState(false);

  const items = itemsByRegion[activeRegion] || [];

  const activeRegionMeta = useMemo(
    () => regions.find((region) => region.id === activeRegion),
    [activeRegion],
  );

  async function loadNews(regionToLoad: Region = activeRegion) {
    setLoading(true);

    const params = new URLSearchParams({
      region: regionToLoad,
      topics: selectedTopics.join(","),
    });

    const response = await fetch(`/api/news?${params.toString()}`, {
      cache: "no-store",
    });

    const payload = await response.json();

    setItemsByRegion((current) => ({
      ...current,
      [regionToLoad]: payload.data || [],
    }));

    setUpdatedAt(payload.updatedAt || new Date().toISOString());
    setLoading(false);

    setDailySummary("");
    setSummaryOpen(false);
    setSummaryLoading(false);
  }

  async function preloadRegions() {
    const regionIds = regions.map((region) => region.id);

    await Promise.all(
      regionIds.map(async (regionId) => {
        if (regionId === activeRegion) return;

        const params = new URLSearchParams({
          region: regionId,
          topics: selectedTopics.join(","),
        });

        const response = await fetch(`/api/news?${params.toString()}`, {
          cache: "no-store",
        });

        const payload = await response.json();

        setItemsByRegion((current) => ({
          ...current,
          [regionId]: payload.data || [],
        }));
      }),
    );
  }

  useEffect(() => {
    loadNews();
    preloadRegions();

    const timer = setInterval(
      () => {
        loadNews();
        preloadRegions();
      },
      30 * 60 * 1000,
    );

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRegion, selectedTopics.join(",")]);

  function toggleTopic(topic: Topic) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  async function generateSummary() {
    if (dailySummary) {
      setSummaryOpen((current) => !current);
      return;
    }

    try {
      setSummaryLoading(true);

      const response = await fetch("/api/daily-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regionName: activeRegionMeta?.label || activeRegion,
          articles: items,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Nepodařilo se vytvořit souhrn.");
      }

      setDailySummary(payload.summary || "");
      setSummaryOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-5 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 max-w-full overflow-hidden">
          <section className="min-w-0 overflow-x-auto pb-1">
            <div className="flex gap-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    setActiveRegion(region.id);
                    setFiltersOpen(false);
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeRegion === region.id
                      ? "bg-zinc-950 text-white dark:bg-blue-600 dark:text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setFiltersOpen((current) => !current)}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <Filter size={16} />
            {filtersOpen ? "Zavřít filtry" : "Filtry"}
          </button>

          <ThemeToggle />
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside
            className={`h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-5 lg:block ${
              filtersOpen ? "block" : "hidden"
            }`}
          >
            <div className="mb-4 hidden lg:flex">
              <ThemeToggle />
            </div>

            <h2 className="text-lg font-semibold">{activeRegionMeta?.label}</h2>

            <div className="mt-5 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Témata
              </h3>

              {topics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                    className="h-4 w-4 rounded border-zinc-300"
                  />

                  <span className="text-sm text-zinc-800 dark:text-zinc-100">
                    {topic.label}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={() => loadNews()}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Aktualizovat
            </button>

            {updatedAt && (
              <p className="mt-3 text-xs text-zinc-500">
                Aktualizováno: {new Date(updatedAt).toLocaleString("cs-CZ")}
              </p>
            )}
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                onClick={generateSummary}
                disabled={summaryLoading}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                {summaryLoading
                  ? "🧠 Vytvářím souhrn..."
                  : summaryOpen
                    ? "🧠 Skrýt souhrn"
                    : `🧠 Souhrn ${activeRegionMeta?.label}`}
              </button>

              <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                {items.length} článků
              </span>
            </div>

            {summaryOpen && dailySummary && (
              <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-3 text-sm font-semibold text-zinc-500">
                  AI briefing
                </div>

                <div className="whitespace-pre-line text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                  {dailySummary}
                </div>
              </div>
            )}

            {loading && items.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                Načítám zprávy…
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                Pro tuto kombinaci zatím nejsou žádné články.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {items.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
