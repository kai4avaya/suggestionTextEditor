
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

const model = new ChatGroq({
  apiKey:  process.env.GROQ_KEY,
  model: "mixtral-8x7b-32768",
  maxTokens: 1028,
});


// Define your custom memory object
class CustomMemory {
  constructor() {
    this.messages = []; // Initialize an empty array to store chat messages
  }

  // Method to add a message to the memory
  addMessage(message) {
    this.messages.push(message);
  }

  // Method to get the stored messages
  getMessages() {
    return this.messages;
  }
}

// Instantiate your custom memory object
const customMemory = new CustomMemory();

const prompt = ChatPromptTemplate.fromMessages([
  ["ai", "You are a helpful assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);


const runnable = prompt.pipe(model);

const config  = { configurable: { sessionId: "1" } };

// Create your `RunnableWithMessageHistory` object, passing in the custom memory object
const withCustomMemory = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory: (_sessionId) => customMemory, // Use the custom memory object
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

// Pass in your question, using the custom memory
let output = await withCustomMemory.stream(
  { input: "Hello there, I'm Archibald!" },
  config,
);
// console.log("output 1:", output);


for await (const chunk of output) {
  console.log("output chunk:", chunk);
}
