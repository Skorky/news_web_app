import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AiHistoryMessage = {
  question: string;
  answer: string;
};

function formatHistory(history: AiHistoryMessage[] = []) {
  return history
    .slice(-4)
    .map(
      (message, index) => `
Dotaz ${index + 1}:
${message.question}

Odpověď ${index + 1}:
${message.answer}
`
    )
    .join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const { title, summaryCz, whyItMatters, source, question, history } =
      await request.json();

    if (!question || !title) {
      return NextResponse.json(
        { error: 'Chybí otázka nebo titulek článku.' },
        { status: 400 }
      );
    }

    const conversationHistory = Array.isArray(history)
      ? formatHistory(history)
      : '';

    const prompt = `
Jsi český analytik zpravodajství.

Uživatel se ptá na konkrétní zprávu. Máš k dispozici krátký kontext článku, předchozí otázky k tomuto článku a můžeš doplnit i obecné znalosti.

Pravidla:
- Odpovídej česky.
- Nejprve vycházej z poskytnutého kontextu článku.
- Pokud článek odpověď přímo neobsahuje, přirozeně to přiznej a poté doplň širší kontext.
- Nepoužívej formulace typu "v poskytnutém shrnutí", "v kontextu" nebo "nemám informace v datech".
- Používej předchozí otázky a odpovědi pouze jako konverzační kontext.
- Pokud se uživatel ptá navazující otázkou typu "a co Rusko?", domysli návaznost z předchozí konverzace.
- Nepředstírej přesná aktuální fakta, pokud je nemáš v kontextu.
- U časově citlivých věcí používej formulace jako "obecně", "historicky", "podle širšího kontextu".
- Buď stručný, praktický a srozumitelný.
- Piš jako zkušený novinář nebo analytik, ne jako AI asistent.
- Nepoužívej číslované sekce ani nadpisy odpovědi.
- Nepoužívej markdown tabulky.

Zdroj:
${source || 'neznámý'}

Titulek:
${title}

Shrnutí:
${summaryCz || 'není k dispozici'}

Proč je to důležité:
${whyItMatters || 'není k dispozici'}

Předchozí konverzace k článku:
${conversationHistory || 'žádná'}

Aktuální otázka uživatele:
${question}

Odpověď drž zhruba na 2 až 4 odstavce.
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
