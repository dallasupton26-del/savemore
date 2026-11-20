
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "AI is not configured"
    });
  }

  const message = req.body?.message;

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 1000
  ) {
    return res.status(400).json({
      error: "Enter a message under 1000 characters"
    });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: `
You are SaveMore, a friendly AI savings assistant.

Help users:
- Save money on everyday expenses
- Create grocery budgets
- Reduce monthly bills
- Identify unnecessary subscriptions
- Compare shopping options
- Build realistic savings plans

Give clear, practical advice.
Ask questions when needed.
Never invent live prices or discounts.
Never guarantee savings.
Do not request bank passwords or card numbers.
          `,
          input: message,
          max_output_tokens: 400
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error", response.status);
      return res.status(502).json({
        error: "AI service unavailable"
      });
    }

    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    return res.status(200).json({
      reply: reply || "Please try again."
    });

  } catch (error) {
    console.error("SaveMore AI error", error);

    return res.status(500).json({
      error: "Something went wrong"
    });
  }
}
