
// import { ChatGroq } from "@langchain/groq";
// // import { JsonOutputParser } from "@langchain/core/output_parsers";
// import { config } from "dotenv";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// // import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { BufferWindowMemory } from "langchain/memory";
// // Initialize dotenv to load environment variables
// config();

// let model = new ChatGroq({
//   apiKey: process.env.GROQ_KEY,
//   model: "mixtral-8x7b-32768",
//   maxTokens: 1028,
// });

// const memory = new BufferWindowMemory({ k: 3 });

// export async function* langStream(input) {

//   const chain = model.pipe(new StringOutputParser());

//   const stream = await chain.stream(input)
//   // console.log("i am stream", stream)


//   for await (const chunk of stream) {
//     console.log("message from langGroq", chunk)
//     yield chunk;

//     // console.log("message from langGroq", chunk)
//     // yield JSON.stringify(chunk);
//   }
// }


// async function runLangStream() {
//   const inputText = "Your input string here"; // Replace this with your actual input
//   for await (const chunk of langStream(inputText)) {
//     console.log(chunk);
//   }
// }

// runLangStream();












// import { ChatGroq } from "@langchain/groq";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { BufferWindowMemory } from "langchain/memory";
// import { PromptTemplate } from "@langchain/core/prompts";
// import {
//   // RunnableConfig,
//   RunnableWithMessageHistory,
// } from "@langchain/core/runnables";
// import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
// import { config } from "dotenv";
// config();

// const model = new ChatGroq({
//   apiKey: process.env.GROQ_KEY,
//   model: "mixtral-8x7b-32768",
//   maxTokens: 1028,
// });

// const promptTemplate = new PromptTemplate({
//   template: "{input}",
//   inputVariables: ["input"],
// });

// const runnable = promptTemplate.pipe(model);
// const messageHistory = new ChatMessageHistory();

// const config2 = { configurable: { sessionId: "1" } };
// const withHistory = new RunnableWithMessageHistory({
//   runnable,
//   getMessageHistory: (_sessionId) => messageHistory,
//   inputMessagesKey: "input",
//   historyMessagesKey: "history",
//   "config":config2,
// });

// export async function* langStream(input) {
//   const chain = withHistory;

//   // Stream responses with memory
//   const response = await chain.invoke({ input }, config);

//   // Output the initial response
//   yield response;

//   // Use a loop to stream responses, updating the memory as you go
//   while (true) {
//     const response = await chain.invoke({ input }, config);

//     // Update the memory with the new response
//     messageHistory.addMessage(response);

//     // Yield the new response
//     yield response;

//     // Exit the loop if the response is complete
//     if (response.completion_type === "complete") {
//       break;
//     }
//   }
// }

// (async () => {
//   // Example usage of the langStream function
//   const langGen = langStream("tell me about machine learning");

//   for await (const response of langGen) {
//     console.log(response.output);
//   }
// })();



// import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  // RunnableConfig,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
// import { config } from "dotenv";
import { config as config2 } from "dotenv";
import { ChatGroq } from "@langchain/groq";

// config();(
config2()

// Instantiate your model and prompt.
// const model = new ChatOpenAI({});
const prompt = ChatPromptTemplate.fromMessages([
  ["ai", "You are a helpful assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);


const model = new ChatGroq({
  apiKey:  process.env.GROQ_KEY,
  model: "mixtral-8x7b-32768",
  maxTokens: 1028,
});

// Create a simple runnable which just chains the prompt to the model.
const runnable = prompt.pipe(model);

// Define your session history store.
// This is where you will store your chat history.
const messageHistory = new ChatMessageHistory();

// Create your `RunnableWithMessageHistory` object, passing in the
// runnable created above.
const withHistory = new RunnableWithMessageHistory({
  runnable,
  // Optionally, you can use a function which tracks history by session ID.
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  // This shows the runnable where to insert the history.
  // We set to "history" here because of our MessagesPlaceholder above.
  historyMessagesKey: "history",
});

// Create your `configurable` object. This is where you pass in the
// `sessionId` which is used to identify chat sessions in your message store.
const config  = { configurable: { sessionId: "1" } };

// Pass in your question, in this example we set the input key
// to be "input" so we need to pass an object with an "input" key.
let output = await withHistory.stream(
  { input: "Hello there, I'm Archibald!" },
  config,
);
console.log("output 1:", output);
/**
output 1: AIMessage {
  lc_namespace: [ 'langchain_core', 'messages' ],
  content: 'Hello, Archibald! How can I assist you today?',
  additional_kwargs: { function_call: undefined, tool_calls: undefined }
}
 */

// output = await withHistory.invoke({ input: "What's my name?" }, config);

// Create a streamable chain by using the `stream` method on the `withHistory` object
const stream = await withHistory.stream({ input: "Hello there, I'm Archibald!" }, config);

// Iterate over the stream to process the output in chunks
for await (const chunk of stream) {
  console.log("output chunk:", chunk);
}
// console.log("output 2:", output);
/**
output 2: AIMessage {
  lc_namespace: [ 'langchain_core', 'messages' ],
  content: 'Your name is Archibald, as you mentioned earlier. Is there anything specific you would like assistance with, Archibald?',
  additional_kwargs: { function_call: undefined, tool_calls: undefined }
}
 */

/**
 * You can see the LangSmith traces here:
 * output 1 @link https://smith.langchain.com/public/686f061e-bef4-4b0d-a4fa-04c107b6db98/r
 * output 2 @link https://smith.langchain.com/public/c30ba77b-c2f4-440d-a54b-f368ced6467a/r
 */