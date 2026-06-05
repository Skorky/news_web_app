import Database from 'better-sqlite3';

const db = new Database('news-cache.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS ai_cache (
    url TEXT PRIMARY KEY,
    title_original TEXT,
    title_cz TEXT,
    summary_cz TEXT,
    why_important TEXT,
    created_at TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT,
    source TEXT,
    url TEXT,
    published_at TEXT,
    region TEXT,
    topics TEXT,
    summary_cz TEXT,
    why_it_matters TEXT,
    importance INTEGER,
    paywall TEXT,
    updated_at TEXT
  )
`);

export function getCachedArticle(url: string) {
  return db.prepare('SELECT * FROM ai_cache WHERE url = ?').get(url) as
    | {
        title_cz: string;
        summary_cz: string;
        why_important: string;
      }
    | undefined;
}

export function saveCachedArticle(input: {
  url: string;
  titleOriginal: string;
  titleCz: string;
  summaryCz: string;
  whyImportant: string;
}) {
  db.prepare(
    `
    INSERT OR REPLACE INTO ai_cache
    (url, title_original, title_cz, summary_cz, why_important, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    input.url,
    input.titleOriginal,
    input.titleCz,
    input.summaryCz,
    input.whyImportant,
    new Date().toISOString()
  );
}

export function saveArticles(region: string, articles: any[]) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO articles
    (
      id, title, source, url, published_at, region, topics,
      summary_cz, why_it_matters, importance, paywall, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  const transaction = db.transaction((items) => {
    for (const item of items) {
      stmt.run(
        item.id,
        item.title,
        item.source,
        item.url,
        item.publishedAt,
        region,
        JSON.stringify(item.topics),
        item.summaryCz,
        item.whyItMatters,
        item.importance,
        item.paywall,
        now
      );
    }
  });

  transaction(articles);
}

export function getStoredArticles(region: string, selectedTopics: string[]) {
  const rows =
    region === 'top10'
      ? (db
          .prepare(
            `
            SELECT * FROM articles
            WHERE region != 'top10'
            ORDER BY importance DESC, published_at DESC
            LIMIT 80
          `
          )
          .all() as any[])
      : (db
          .prepare(
            `
            SELECT * FROM articles
            WHERE region = ?
            ORDER BY importance DESC, published_at DESC
            LIMIT 80
          `
          )
          .all(region) as any[]);

  const items = rows
    .map((row) => ({
      id: row.id,
      title: row.title,
      source: row.source,
      url: row.url,
      publishedAt: row.published_at,
      region: row.region,
      topics: JSON.parse(row.topics || '[]'),
      summaryCz: row.summary_cz,
      whyItMatters: row.why_it_matters,
      importance: row.importance,
      paywall: row.paywall,
    }))
    .filter(
      (item) =>
        selectedTopics.length === 0 ||
        selectedTopics.some((topic) => item.topics.includes(topic))
    );

  const sourceCounts = new Map<string, number>();

  return items
    .filter((item) => {
      const count = sourceCounts.get(item.source) || 0;
      const limit = region === 'top10' ? 2 : 3;

      if (count >= limit) {
        return false;
      }

      sourceCounts.set(item.source, count + 1);
      return true;
    })
    .slice(0, region === 'top10' ? 10 : 40);
}
