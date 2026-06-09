import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeToCzech(title: string, summary: string) {
  try {
    const prompt = `
Jsi zkušený český analytik světového zpravodajství.

Přelož a shrň následující článek.

Titulek:
${title}

Text:
${summary}

Vrať JSON ve formátu:

{
  "titleCz": "...",
  "summaryCz": "...",
  "whyImportant": "..."
}

Pravidla:
- piš česky
- shrnutí max 3 věty
- whyImportant max 1 věta
- žádný markdown
`;

    const response = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenAI summarizeToCzech error:", error);

    throw error;
  }
}
