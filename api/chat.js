
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

    const message = typeof req.body?.message === "string"
    ? req.body.message.trim()
    : "";

  if (!message || message.length > 1000) {
    return res.status(400).json({
      error: "Enter a savings question between 1 and 1,000 characters."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OpenAI API key is missing"
    });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions:
            "You are SaveMore, a helpful AI savings assistant. " +
            "Give practical ways to save money. " +
            "Never invent prices, deals, or discounts. " +
            "Keep responses concise.",
          input: message,
          max_output_tokens: 300
        })
      }
    );

    if (!response.ok) {
      console.error(
        "OpenAI request failed:",
        response.status
      );

      return res.status(502).json({
        error: "AI service unavailable"
      });
    }

    const data = await response.json();

    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    return res.status(200).json({
      reply: reply || "No response generated."
    });

  } catch (error) {
    console.error("AI backend error:", error);

    return res.status(500).json({
      error: "Unable to contact AI"
    });
  }
}
