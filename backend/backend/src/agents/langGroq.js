// import { ChatGroq } from "@langchain/groq";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { config } from "dotenv";
// import { JsonOutputParser } from "@langchain/core/output_parsers";

// // Initialize dotenv to load environment variables
// config();

// let model = new ChatGroq({
//   apiKey: process.env.GROQ_KEY,
//   model: "mixtral-8x7b-32768",
//   maxTokens: 1028,
// });


// export async function langGroq(input, model_type = "") {
//   if (model_type !== "") {
//     model = new ChatGroq({
//       apiKey: process.env.GROQ_KEY,
//       model: model_type,
//       maxTokens: 1028,
//     });
//   }


//   const chain = model.pipe(new JsonOutputParser());
//   //   const chain = prompt.pipe(model);

//   const stream = await chain.stream(
//     input // `output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`
//   );

//   for await (const chunk of stream) {
//     console.log(chunk);
//   }
// }


// // langGroq("output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of 'countries' which contains a list of countries. Each country should have the key 'name' and 'population'")

import { ChatGroq } from "@langchain/groq";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { config } from "dotenv";

// Initialize dotenv to load environment variables
config();

let model = new ChatGroq({
  apiKey: process.env.GROQ_KEY,
  model: "mixtral-8x7b-32768",
  maxTokens: 1028,
});

export async function* langGroq(input, model_type = "") {


  // Check if a different model type is specified
  // if (model_type !== "") {
  //   model = new ChatGroq({
  //     apiKey: process.env.GROQ_KEY,
  //     model: model_type,
  //     maxTokens: 1028,
  //   });
  // }

  // console.log("i am input", input)


  const chain = model.pipe(new JsonOutputParser());

  const stream = await chain.stream(input)
  // console.log("i am stream", stream)


  for await (const chunk of stream) {
    console.log("message from langGroq", chunk)
    yield chunk;

    // console.log("message from langGroq", chunk)
    // yield JSON.stringify(chunk);
  }
}


// async function handleStream() {
//   const input = "output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of 'countries' which contains a list of countries. Each country should have the key 'name' and 'population'";

//   try {
//     for await (const chunk of langGroq(input)) {
//       console.log(chunk); // This will log each chunk to the console as it is received.
//     }
//   } catch (error) {
//     console.error("Error during streaming:", error);
//   }
// }

// handleStream();




// Test the function
async function handleStreamTest() {
  const input = `Given the TEXT:  
   "CNN commentator Van Jones slammed Rep. Marjorie Taylor Greene (R-Ga.) following her personal attacks on a fellow member of Congress during a House Oversight Committee hearing Thursday night.
  The committee hearing, held to vote on whether to hold Attorney General Merrick Garland in contempt of Congress, divulged into chaos after Greene made a comment about the appearance of Rep. Jasmine Crockett (D-Texas) and her “fake eyelashes.”, 
   
  create a dataset of the relationships between entities. The dataset should be formatted as follows:

[
  {id: "Entity", parent: null, relationship: null},
  {id: "Entity", parent: "Parent Entity", relationship: "Description of relationship"},
  {id: "Another Entity", parent: "Entity", relationship: "Description of relationship"},
  ...
]

Output this data structure. No commentary.
`

const input2 = `output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of 'countries' which contains a list of countries. Each country should have the key 'name' and 'population`
const input3 = `Use this TEXT: "CNN commentator Van Jones slammed Rep. Marjorie Taylor Greene (R-Ga.) following her personal attacks on a fellow member of Congress during a House Oversight Committee hearing Thursday night.
The committee hearing, held to vote on whether to hold Attorney General Merrick Garland in contempt of Congress, divulged into chaos after Greene made a comment about the appearance of Rep. Jasmine Crockett (D-Texas) and her “fake eyelashes.” Output a list of entities and their relationships in JSON format. Use a dictionary with an outer key of 'entities' which contains a list of entities. Each entity should have the keys 'id', 'parent', and 'relationship'. The 'id' key should contain the entity's name, the 'parent' key should contain the parent entity's name (or null if none), and the 'relationship' key should describe the relationship (or null if none). Each entity should appear only once. If an entity has multiple parents or relationships, list it multiple times with the respective parent and relationship.`

  try {
    for await (const chunk of langGroq(input3)) {
      console.log("Processed chunk:", chunk); // This will log each chunk to the console as it is received.
    }
  } catch (error) {
    console.error("Error during streaming:", error);
  }
}

// handleStreamTest();