import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful HR AI assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    console.log("FULL OPENAI RESPONSE:", data); // 👈 IMPORTANT

    // ❌ If OpenAI error
    if (!response.ok) {
      return NextResponse.json({
        reply: "OpenAI API error. Check key or quota.",
      });
    }

    // ❌ If wrong structure
    if (!data.choices || !data.choices[0]) {
      return NextResponse.json({
        reply: "Invalid response from AI",
      });
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({
      reply: "Server crashed",
    });
  }
}