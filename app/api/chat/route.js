import { NextResponse } from "next/server";

export async function POST(req) {
  const { chat } = await req.json();

  const messages = chat.map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
  role: "system",
  content: `
You are an AI HR assistant.

Your job is to analyze employee data and give clear, concise insights.

Rules:
- Be SHORT and direct
- Avoid generic explanations
- Focus on decisions, not theory
- No long paragraphs

Output format:

🚨 Risk Employees:
- [Name] → [1 short reason]

⚠️ Key Observations:
- Bullet points (max 3)

✅ Recommended Actions:
- Bullet points (max 3, very practical)

Important:
- No fluff
- No repetition
- No long sentences
`
},
        ...messages,
      ],
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    reply: data.choices[0].message.content,
  });
}