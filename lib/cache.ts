import { createClient } from '@supabase/supabase-js';

type CachedArticle = {
  title_cz: string;
  summary_cz: string;
  why_important: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function getCachedArticle(
  url: string
): Promise<CachedArticle | undefined> {
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('ai_cache')
    .select('title_cz, summary_cz, why_important')
    .eq('url', url)
    .maybeSingle();

  if (error) {
    console.error('Supabase getCachedArticle error:', error);
    return undefined;
  }

  return data || undefined;
}

export async function saveCachedArticle(input: {
  url: string;
  titleOriginal: string;
  titleCz: string;
  summaryCz: string;
  whyImportant: string;
}) {
  if (!supabase) return;

  const { error } = await supabase.from('ai_cache').upsert({
    url: input.url,
    title_original: input.titleOriginal,
    title_cz: input.titleCz,
    summary_cz: input.summaryCz,
    why_important: input.whyImportant,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Supabase saveCachedArticle error:', error);
  }
}

export function saveArticles(_region: string, _articles: any[]) {
  return;
}

export function getStoredArticles(_region: string, _selectedTopics: string[]) {
  return [];
}
