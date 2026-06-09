import Parser from "rss-parser";
import { feeds } from "./config";
import { NewsItem, Region, Topic } from "./types";
import { summarizeToCzech } from "./ai";
import { getCachedArticle, saveCachedArticle } from "./cache";

const parser = new Parser({ timeout: 8000 });

const investigationTerms = [
  "investigation",
  "investigative",
  "exclusive",
  "documents show",
  "leaked",
  "leak",
  "probe",
  "corruption",
  "whistleblower",
  "fraud",
  "lobbying",
  "classified",
  "secret",
];

const bombTerms = [
  "breaking",
  "war",
  "attack",
  "strike",
  "election",
  "court",
  "sanction",
  "crisis",
  "resigns",
  "killed",
  "dead",
  "invasion",
  "trump",
  "biden",
  "putin",
  "china",
  "ukraine",
  "israel",
  "iran",
  "gaza",
  "nato",
  "fed",
  "inflation",
];

const lowValueTerms = [
  "tennis",
  "football",
  "soccer",
  "sport",
  "sports",
  "roland garros",
  "olympic",
  "celebrity",
  "actor",
  "actress",
  "movie",
  "film",
  "music",
  "singer",
  "royal family",
  "prince",
  "princess",
  "fashion",
  "recipe",
  "travel",
  "holiday",
  "zodiac",
];

const MAX_AI_SUMMARIES_PER_RUN = 10;

function normalizeText(text?: string) {
  return (text || "").toLowerCase();
}

function detectExtraTopics(title: string, summary: string): Topic[] {
  const text = normalizeText(`${title} ${summary}`);
  const extra: Topic[] = [];

  if (investigationTerms.some((term) => text.includes(term))) {
    extra.push("investigations");
  }

  if (
    /(ai|artificial intelligence|technology|cyber|software|chip|semiconductor)/i.test(
      text,
    )
  ) {
    extra.push("technology");
  }

  if (/(market|stocks|fed|inflation|bond|bank|rates|finance)/i.test(text)) {
    extra.push("finance");
  }

  if (
    /(war|military|security|attack|missile|defense|nato|ukraine|israel|iran|gaza)/i.test(
      text,
    )
  ) {
    extra.push("war_security");
  }

  if (
    /(government|president|minister|parliament|congress|election|court|law|eu|white house)/i.test(
      text,
    )
  ) {
    extra.push("politics");
  }

  if (
    /(economy|economic|budget|deficit|tax|trade|industry|energy)/i.test(text)
  ) {
    extra.push("economy");
  }

  return extra;
}

function importanceScore(title: string, summary: string, topics: Topic[]) {
  const text = normalizeText(`${title} ${summary}`);

  let score = 0;

  if (topics.includes("investigations")) score += 3;
  if (topics.includes("war_security")) score += 3;
  if (topics.includes("finance")) score += 3;
  if (topics.includes("economy")) score += 2;
  if (topics.includes("politics")) score += 2;
  if (topics.includes("technology")) score += 1;
  if (topics.includes("top")) score += 1;

  score += Math.min(3, bombTerms.filter((term) => text.includes(term)).length);

  if (lowValueTerms.some((term) => text.includes(term))) {
    score -= 5;
  }

  if (
    /(dead|killed|attack|strike|sanction|resigns|court|election|war|crisis)/i.test(
      text,
    )
  ) {
    score += 2;
  }

  return Math.max(1, Math.min(10, score));
}

function whyItMatters(title: string, topics: Topic[]) {
  if (topics.includes("investigations")) {
    return "Může odhalovat skryté vazby, pochybení nebo systémový problém.";
  }

  if (topics.includes("war_security")) {
    return "Může ovlivnit bezpečnostní situaci, diplomacii nebo trhy.";
  }

  if (topics.includes("finance") || topics.includes("economy")) {
    return "Může mít dopad na ekonomiku, trhy, inflaci nebo rozhodování firem.";
  }

  if (topics.includes("technology")) {
    return "Může ovlivnit technologický sektor, regulaci nebo konkurenci.";
  }

  if (topics.includes("politics")) {
    return "Může ovlivnit politické rozhodování, veřejnou debatu nebo fungování institucí.";
  }

  return "Patří mezi důležité titulky, které mohou určovat hlavní zpravodajskou agendu dne.";
}

export async function fetchNews(
  region: Region,
  selectedTopics: Topic[],
): Promise<NewsItem[]> {
  const relevantFeeds =
    region === "top10" ? feeds : feeds.filter((feed) => feed.region === region);

  const items = await Promise.allSettled(
    relevantFeeds.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);

      return await Promise.all(
        (parsed.items || []).slice(0, 4).map(async (item) => {
          const title = item.title || "Bez titulku";
          const summary =
            item.contentSnippet || item.content || item.summary || "";
          const articleUrl = item.link || "#";

          const cached =
            articleUrl !== "#" ? await getCachedArticle(articleUrl) : undefined;

          const detectedTopics = detectExtraTopics(title, summary);
          const allTopics = Array.from(
            new Set([...feed.topics, ...detectedTopics]),
          );

          const fallbackWhy = whyItMatters(title, allTopics);

          let ai = {
            titleCz: title,
            summaryCz: summary.slice(0, 500) || "Shrnutí není k dispozici.",
            whyImportant: fallbackWhy,
          };

          if (cached) {
            ai = {
              titleCz: cached.title_cz,
              summaryCz: cached.summary_cz,
              whyImportant: cached.why_important || fallbackWhy,
            };
          } else {
            try {
              ai = await summarizeToCzech(title, summary.slice(0, 1500));

              if (articleUrl !== "#") {
                await saveCachedArticle({
                  url: articleUrl,
                  titleOriginal: title,
                  titleCz: ai.titleCz,
                  summaryCz: ai.summaryCz,
                  whyImportant: ai.whyImportant || fallbackWhy,
                });
              }
            } catch {
              // OpenAI limit nebo chyba: použijeme fallback, ale neukládáme ho do cache.
            }
          }

          const newsItem: NewsItem = {
            id: `${feed.name}-${item.guid || item.link || title}`,
            title: ai.titleCz || title,
            source: feed.name,
            url: articleUrl,
            publishedAt: item.isoDate || item.pubDate,
            region: feed.region,
            topics: allTopics,
            summaryCz: ai.summaryCz || summary.slice(0, 500),
            whyItMatters: ai.whyImportant || fallbackWhy,
            importance: importanceScore(title, summary, allTopics),
            paywall: feed.paywall || "neznámé",
          };

          return newsItem;
        }),
      );
    }),
  );

  const flat = items.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  const deduped = Array.from(
    new Map(flat.map((item) => [item.url, item])).values(),
  );

  const filtered = deduped
    .filter(
      (item) =>
        selectedTopics.length === 0 ||
        selectedTopics.some((topic) => item.topics.includes(topic)),
    )
    .sort((a, b) => {
      if (b.importance !== a.importance) {
        return b.importance - a.importance;
      }

      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

      return dateB - dateA;
    });

  const sourceCounts = new Map<string, number>();

  const diversified = filtered.filter((item) => {
    const count = sourceCounts.get(item.source) || 0;
    const limit = region === "top10" ? 2 : 3;

    if (count >= limit) {
      return false;
    }

    sourceCounts.set(item.source, count + 1);
    return true;
  });

  return diversified.slice(0, region === "top10" ? 20 : 60);
}
