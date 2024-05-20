const BASEURL = `https://letmeeatkaik.azurewebsites.net/`
const TESTURL = `http://localhost:3000/`

const jsonUrl = `${TESTURL}api/lang-groq`;

import { jsonAgentPrompt } from "../../confgs/envConfigs";


export async function* jsonAgent(text, query) {
  const response = await fetch(jsonUrl, {
      method: 'POST',
      body: JSON.stringify({ text: `Given this TEXT:\n"${text}" and this QUERY: ${query}, ${jsonAgentPrompt}`}),
      headers: { 'Content-Type': 'application/json' }
  });

  console.log(response);

  if (!response.ok) {
      console.error('Network response was not ok');
      return;
  }

  const reader = response.body.getReader();

  const stream = new ReadableStream({
      start(controller) {
          function push() {
              reader.read().then(({ done, value }) => {
                  if (done) {
                      controller.close();
                      return;
                  }

                  controller.enqueue(value);
                  push();
              });
          } 

          push();
      }
  });

  const reader2 = stream.getReader();

  while (true) {
      const { done, value } = await reader2.read();

      if (done) {
          break;
      }

      yield value;
  }
}