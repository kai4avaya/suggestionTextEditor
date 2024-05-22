// import {BASEURL} from '../../../../../configs/env_configs.js'
const tempURL = `http://localhost:3000/`
const embeddings_url =`${tempURL}api/embeddings-binary`
const find_url = `${tempURL}api/search-embeddings-binary`


export function fetchEmbeddings(text, token) {

  console.log("me is text", text)

    return fetch(embeddings_url, {
      method: 'POST',
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // console.log("response", response)

      return response.json();

    })
    .catch(error => console.error('Error fetching embeddings:', error));
  }
  

  export function fetchTopKSimilarIndices(targetData, queryEmbedding, token, k = 3) {
    return fetch(find_url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetData, queryEmbedding, k })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => console.error('Error fetching top K similar indices:', error));
  }
  