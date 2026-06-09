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

Uživatel se ptá na konkrétní zprávu. Máš k dispozici krátký kontext článku, ale můžeš doplnit i obecné znalosti.

Pravidla:
- Odpovídej česky.
- Nejprve vycházej z poskytnutého kontextu článku.
- Pokud odpověď není v kontextu uvedena, jasně napiš: "V poskytnutém shrnutí to není uvedeno."
- Potom můžeš doplnit obecný kontext ze svých znalostí.
- Nepředstírej přesná aktuální fakta, pokud je nemáš v kontextu.
- U časově citlivých věcí používej formulace jako "obecně", "historicky", "podle širšího kontextu".
- Buď stručný, praktický a srozumitelný.
- Nepoužívej markdown tabulky.

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

Struktura odpovědi:
1. Krátká odpověď
2. Pokud je potřeba: doplňující kontext
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
    console.error('AI ask error:', error);

    return NextResponse.json(
      {
        error: 'Nepodařilo se získat odpověď od AI.',
      },
      { status: 500 }
    );
  }
}
