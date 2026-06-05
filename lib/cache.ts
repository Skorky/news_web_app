type CachedArticle = {
  title_cz: string;
  summary_cz: string;
  why_important: string;
};

export function getCachedArticle(_url: string): CachedArticle | undefined {
  return undefined;
}

export function saveCachedArticle(_input: {
  url: string;
  titleOriginal: string;
  titleCz: string;
  summaryCz: string;
  whyImportant: string;
}) {
  return;
}

export function saveArticles(_region: string, _articles: any[]) {
  return;
}

export function getStoredArticles(_region: string, _selectedTopics: string[]) {
  return [];
}
