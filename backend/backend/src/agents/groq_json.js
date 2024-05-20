
const GROQ_API_KEY = process.env.GROQ_API_KEY; // Use environment variables in production

async function callGroqAPI(conversation) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const headers = {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify({
    messages: conversation,
    model: "llama3-8b-8192",
    temperature: 0.9,
    max_tokens: 512,
    top_p: 0.95,
    stream: true,
    // response_format: { type: "json_object" },
    stop: ["\n", "\r"]
  });

  try {
    const response = await fetch(url, { method: 'POST', headers: headers, body: body });
    return response.body;
  } catch (error) {
    console.error("Failed to fetch response from Groq:", error);
    throw error;
  }
}