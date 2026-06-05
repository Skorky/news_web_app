import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news';
import { regions } from '@/lib/config';
import { Topic } from '@/lib/types';
import { saveArticles } from '@/lib/cache';

export async function POST() {
  try {
    const topicIds: Topic[] = [];

    const results = await Promise.allSettled(
      regions.map(async (region) => {
        const data = await fetchNews(region.id, topicIds);
        saveArticles(region.id, data);

        return {
          region: region.id,
          count: data.length,
        };
      })
    );

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
