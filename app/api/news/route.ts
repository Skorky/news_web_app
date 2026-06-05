import { NextRequest, NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news';
import { Region, Topic } from '@/lib/types';
import { getStoredArticles } from '@/lib/cache';

export const revalidate = 1800; // 30 minut

type CacheEntry = {
  updatedAt: string;
  data: Awaited<ReturnType<typeof fetchNews>>;
};

const memoryCache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minut

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const region = (searchParams.get('region') || 'world') as Region;
  const topics = (searchParams.get('topics') || '')
    .split(',')
    .filter(Boolean) as Topic[];

  const cacheKey = `${region}:${topics.sort().join(',')}`;
  const cached = memoryCache.get(cacheKey);

  if (cached) {
    const age = Date.now() - new Date(cached.updatedAt).getTime();

    if (age < CACHE_TTL_MS) {
      return NextResponse.json({
        updatedAt: cached.updatedAt,
        data: cached.data,
        cached: true,
      });
    }
  }

  try {
    const stored = getStoredArticles(region, topics);

    if (stored.length > 0) {
      return NextResponse.json({
        updatedAt: new Date().toISOString(),

        data: stored,

        cached: true,

        source: 'sqlite',
      });
    }

    const data = await fetchNews(region, topics);
    const updatedAt = new Date().toISOString();

    memoryCache.set(cacheKey, {
      updatedAt,
      data,
    });

    return NextResponse.json({
      updatedAt,
      data,
      cached: false,
    });
  } catch (error) {
    if (cached) {
      return NextResponse.json({
        updatedAt: cached.updatedAt,
        data: cached.data,
        cached: true,
        warning: 'Vrácena starší cache, protože refresh selhal.',
      });
    }

    return NextResponse.json(
      {
        error: 'Nepodařilo se načíst zprávy',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
