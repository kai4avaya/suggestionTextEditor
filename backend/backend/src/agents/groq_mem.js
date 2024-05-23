// import { config } from "dotenv";
// // import fetch from "node-fetch";

// config(); // Loads the environment variables from the .env file into process.env
// const url = "https://api.groq.com/openai/v1/chat/completions";


// function clean(messages){
 
//   const cleanMessages = messages.map((msg) => ({
//     ...msg,
//     content: msg.content.replace(/<[^>]+>/g, '') // Remove HTML tags
//   }));
//   return cleanMessages
//  }
 

// export async function groq_conversational_memory(query) {
//   let { prompt, model, messages } = query;
//   const effectiveModel = model || "gemma-7b-it";

//   console.log("i am streammmmer", prompt)
//   console.log("i am messages", [
//     {
//       role: "system",
//       content: "You are a helpful assistant",
//     },
//     ...messages || [],

//     {
//       role: "user",
//       content: prompt,
//     },
//   ])
//   console.log("---------------------------------------------------")

// //   if (!messages) {
// //     messages = [] 
// //   }

// //   const cleanMessages =  clean(messages) d

//   const body = JSON.stringify({
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful assistant",
//       },
//       ...messages || [],

//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//     model: effectiveModel,
//     "temperature": 1,
//     "max_tokens": 1024,
//     "top_p": 1,
//     "stream": true,
//     "stop": null
//   });

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GROQ_KEY}`,
//     },
//     body: body,
//   });

//   if (!response.ok) {
//     console.error(`HTTP error streaming converation agent! status: ${response.status}`);
//     console.log(response);
//     // console.log(response.text, response.json())
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder("utf-8");

//   return new Promise((resolve, reject) => {
//     const contents = [];

//     function read() {
//       reader.read().then(({ done, value }) => {
//         if (done) {
//           resolve(contents);
//           return;
//         }

//         const text = decoder.decode(value, { stream: true });
//         const contentPattern = /"content":"(.*?)"/g;
//         let match;
//         while ((match = contentPattern.exec(text)) !== null) {
//           const formattedContent = match[1].replace(/\\n/g, "<br/>");
//           contents.push(formattedContent);
//         }

//         read();
//       }).catch(error => {
//         console.error("Stream failed", error);
//         reject(error);
//       });
//     }

//     read();
//   });
// }


import { config } from "dotenv";
// import fetch from "node-fetch";

config(); // Loads the environment variables from the .env file into process.env
const url = "https://api.groq.com/openai/v1/chat/completions";

function clean(messages) {
  return messages.map((msg) => ({
    ...msg,
    content: msg.content.replace(/<[^>]+>/g, '') // Remove HTML tags
  }));
}

export async function groq_conversational_memory(query) {
  let { prompt, model, messages } = query;
  const effectiveModel = model || "gemma-7b-it";

//   console.log("i am streammmmer", prompt);
//   console.log("i am messages", [
//     {
//       role: "system",
//       content: "You are a helpful assistant",
//     },
//     ...messages || [],
//     {
//       role: "user",
//       content: prompt,
//     },
//   ]);
//   console.log("---------------------------------------------------");

  const body = JSON.stringify({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant",
      },
      ...messages || [],
      {
        role: "user",
        content: prompt,
      },
    ],
    model: effectiveModel,
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_KEY}`,
    },
    body: body,
  });

  if (!response.ok) {
    console.error(`HTTP error streaming conversation agent! status: ${response.status}`);
    console.log(response);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  return new Promise((resolve, reject) => {
    const contents = [];

    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          resolve(contents);
          return;
        }

        const text = decoder.decode(value, { stream: true });
        const contentPattern = /"content":"(.*?)"/g;
        let match;
        while ((match = contentPattern.exec(text)) !== null) {
          contents.push(match[1]);
        }

        read();
      }).catch(error => {
        console.error("Stream failed", error);
        reject(error);
      });
    }

    read();
  });
}
