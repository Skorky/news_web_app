import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, summaryCz, whyItMatters, source, question } =
      await request.json();

    if (!question || !title) {
      return NextResponse.json(
        { error: 'Chybí otázka nebo titulek článku.' },
        { status: 400 }
      );
    }

    const prompt = `
Jsi český analytik zpravodajství.

Odpověz česky na dotaz uživatele k dané zprávě.
Nevymýšlej si fakta, která nejsou v poskytnutém kontextu.
Pokud odpověď z kontextu nevyplývá, jasně to řekni a nabídni opatrnou interpretaci.

Zdroj:
${source || 'neznámý'}

Titulek:
${title}

Shrnutí:
${summaryCz || 'není k dispozici'}

Proč je to důležité:
${whyItMatters || 'není k dispozici'}

Otázka uživatele:
${question}

Odpověz stručně, prakticky a srozumitelně.
`;

    const response = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
    });

    return NextResponse.json({
      answer:
        response.choices[0].message.content ||
        'Nepodařilo se vygenerovat odpověď.',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Nepodařilo se získat odpověď od AI.',
      },
      { status: 500 }
    );
  }
}
