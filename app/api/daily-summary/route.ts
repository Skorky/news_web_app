import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { NewsItem } from '@/lib/types';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {
      regionName,
      articles,
    }: {
      regionName: string;
      articles: NewsItem[];
    } = await request.json();

    if (!articles?.length) {
      return NextResponse.json({ error: 'Chybí články.' }, { status: 400 });
    }

    const topArticles = [...articles]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 15);

    const context = topArticles
      .map(
        (article, index) => `
${index + 1}. ${article.title}

Shrnutí:
${article.summaryCz}

Důležitost:
${article.importance}/10
`
      )
      .join('\n\n');

    const prompt = `
Jsi zkušený editor mezinárodního zpravodajství.

Na základě článků vytvoř stručný briefing regionu "${regionName}".

Pravidla:

- Piš česky.
- Vypíchni 3 až 5 nejdůležitějších témat.
- Vysvětli souvislosti.
- Neopisuj každý článek zvlášť.
- Hledej společné trendy.
- Piš jako redaktor ranního briefingu.
- Max 250 slov.
- Nepoužívej markdown tabulky.
- Nepoužívej nadpisy typu "Úvod" nebo "Závěr".

Články:

${context}
`;

    const response = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      summary:
        response.choices[0].message.content || 'Souhrn se nepodařilo vytvořit.',
    });
  } catch (error) {
    console.error('Daily summary error:', error);

    return NextResponse.json(
      {
        error: 'Nepodařilo se vytvořit souhrn.',
      },
      { status: 500 }
    );
  }
}
