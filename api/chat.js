
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1">
  <title>SaveMore AI Assistant</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f4f8f5;
      color: #18372a;
    }

    header {
      background: white;
      padding: 20px;
      border-bottom: 1px solid #ddd;
    }

    header a {
      color: #287a50;
      text-decoration: none;
      font-weight: bold;
    }

    main {
      max-width: 700px;
      margin: auto;
      padding: 20px;
    }

    h1 { color: #287a50; }

    #messages {
      background: white;
      border-radius: 15px;
      padding: 15px;
      height: 55vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      padding: 12px;
      border-radius: 12px;
      max-width: 85%;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .user {
      background: #287a50;
      color: white;
      align-self: flex-end;
    }

    .assistant {
      background: #edf2ee;
      align-self: flex-start;
    }

    form {
      display: flex;
      gap: 8px;
      margin-top: 15px;
    }

    input {
      flex: 1;
      min-width: 0;
      padding: 14px;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 16px;
    }

    button {
      background: #287a50;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 14px;
      font-weight: bold;
    }

    button:disabled { opacity: 0.5; }

    .notice {
      font-size: 12px;
      color: #66776d;
      line-height: 1.5;
    }
  </style>
</head>
<body>

<header>
  <a href="/">SaveMore.</a>
</header>

<main>
  <h1>AI Savings Assistant</h1>
  <p>Ask how to save money on everyday expenses.</p>

  <div id="messages" aria-live="polite">
    <div class="message assistant">
      Hi! I'm SaveMore. What would you
      like to save money on today?
    </div>
  </div>

  <form id="chatForm">
    <input
      id="messageInput"
      placeholder="Ask SaveMore..."
      maxlength="1000"
      required
    >
    <button id="sendButton" type="submit">
      Send
    </button>
  </form>

  <p class="notice">
    AI responses may contain mistakes.
    Don't share sensitive financial information.
  </p>
</main>

<script>
  const form = document.getElementById("chatForm");
  const input = document.getElementById("messageInput");
  const messages = document.getElementById("messages");
  const button = document.getElementById("sendButton");

  function addMessage(text, role) {
    const bubble = document.createElement("div");
    bubble.className = "message " + role;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message || button.disabled) return;

    addMessage(message, "user");
    input.value = "";
    button.disabled = true;

    const loading = addMessage(
      "SaveMore is thinking...",
      "assistant"
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      loading.textContent =
        data.reply || "No response received.";

    } catch (error) {
      loading.textContent =
        "Sorry, SaveMore couldn't respond. " +
        "Please try again later.";
      console.error(error);
    } finally {
      button.disabled = false;
      input.focus();
    }
  });
</script>

</body>
</html>
