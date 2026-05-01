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
          { role: "system", content: "You are a smart HR AI assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    // 🔴 If OpenAI fails
    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return NextResponse.json(
        { reply: "AI error. Check API key or quota." },
        { status: 500 }
      );
    }

    // 🔴 Safety check
    if (!data.choices || !data.choices[0]) {
      console.error("Invalid response:", data);
      return NextResponse.json(
        { reply: "Invalid AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { reply: "Error processing request" },
      { status: 500 }
    );
  }
}