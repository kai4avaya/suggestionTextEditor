const TESTURL = `http://localhost:3000/`

const url_conversational_memory = TESTURL + "api/query_agent_conversational_memory";


export async function* query_agent(query, token) {

  let url = url_conversational_memory;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, response: ${response}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      let chunk = decoder.decode(value, { stream: true });
      yield chunk; // Yield the chunk so it can be used immediately.
    }
  } catch (error) {
    console.error("Failed to query agent:", error);
  }
}