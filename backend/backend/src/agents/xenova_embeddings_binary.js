'use strict';

import { pipeline } from '@xenova/transformers';

// Define the embedding pipeline using the all-MiniLM-L6-v2 model
const embedPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

export async function fetchEmbeddings_binary(texts) {
  
  if(!texts || texts.length === 0) return
  // Ensure that texts is always an array
  texts = Array.isArray(texts) ? texts : [texts];

  // const output = await extractor('This is a simple test.', { pooling: 'mean', quantize: true, precision: 'binary' });
  // Use Promise.all to process the embeddings in parallel
  const embeddingsPromises = texts.map(text =>
    embedPipeline(text, { pooling: 'mean', quantize: true, precision: 'binary' })
  );

  const embeddingsResults = await Promise.all(embeddingsPromises);

  // Extract and return the embeddings
  const embeddings = embeddingsResults.map(res => Array.from(res.data));
  // console.log("embeddings!", embeddings)
  return embeddings;
}


function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

//targetData = query, dataArray is collection of vectors 
export function findTopKSimilarIndices(targetData, dataArray, k) {
  // Calculate similarities
  let similarities = dataArray.map((data, index) => ({
      index: index,
      similarity: cosineSimilarity(targetData, data)
  }));

  // Sort by similarity
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Extract the top k indices
  return similarities.slice(0, k).map(item => item.index);
}




// async function runExample() {
//   // List of texts to embed
//   const texts = [
//       "The quick brown fox jumps over the lazy dog",
//       "A fast brown animal leaps over a sleepy canine",
//       "The quick brown fox",
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
//       "An energetic orange fox vaults over a lethargic pooch"
//   ];

//   // Fetch embeddings for the texts
//   const embeddings = await fetchEmbeddings_binary(texts);
//   console.log("Embeddings:", embeddings);

//   // Use the first embedding as the target for similarity search
//   const targetEmbedding = embeddings[0];
//   const k = 3; // Number of top similar items to find

//   // Find the top K similar embeddings (indices)
//   const topKIndices = findTopKSimilarIndices(targetEmbedding, embeddings, k);
//   console.log("Top K similar text indices:", topKIndices);

//   // Print the most similar texts based on the indices
//   topKIndices.forEach(index => {
//       console.log(`Text ${index} "${texts[index]}" is one of the most similar texts.`);
//   });
// }

// runExample();