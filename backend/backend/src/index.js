// Importing modules using ES6 import syntax
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { langGroq } from './agents/langGroq.js';
import {getWikipediaSummary} from './agents/wikiSum.js';
import http from 'http';
// import { WebSocketServer } from 'ws';
import WebSocket, { WebSocketServer } from 'ws';
import {fetchEmbeddings_binary, findTopKSimilarIndices} from './agents/xenova_embeddings_binary.js'
import {groq_conversational_memory} from './agents/groq_mem.js'
import {langStream} from './agents/langStream.js'

const app = express();

app.use(helmet());

// CORS for all domains (customize as needed)
app.use(cors());

// Built-in middleware to parse JSON
// app.use(express.json());
app.use(express.json({ limit: '50mb' })); // Set limit to 50MB or any other size you need




const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const rooms = {}; // Store connections by room

wss.on('connection', function connection(ws, req) {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    const room = pathname.split('/')[1];  // This splits the path and gets the room name

    // Initialize the room if it doesn't exist
    if (!rooms[room]) {
        rooms[room] = new Set();
    }

    // Add the current WebSocket to the room
    rooms[room].add(ws);
    console.log(`A new client connected to room: ${room}`);

    ws.on('message', function incoming(message) {
        // Broadcast to all clients in the room
        rooms[room].forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        rooms[room].delete(ws); // Remove WebSocket from the room on disconnect
        if (rooms[room].size === 0) {
            delete rooms[room]; // Delete the room if it's empty
        }
        console.log('Client disconnected');
    });
});
  

// Add a simple "Hello World" route at the root ("/")
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.get('/api/wikipedia-summary', async (req, res) => {
    const topic = req.query.topic;
    if (!topic) {
        res.status(400).send('Topic parameter is required');
        return;
    }

    const summary = await getWikipediaSummary(topic);
    res.send(summary);
});


app.post('/api/lang-groq', async (req, res) => {
    const text = req.body.text;
    const model_type = req.body.model_type || "llama3-8b-8192";
  
    console.log(`Generating GROQ for text: ${text}`);
    if (!text) {
      res.status(400).send('Text parameter is required');
      return;
    }
  
    res.setHeader('Content-Type', 'application/json');
    // console.log(`Generating GROQ for text: ${text}`);
    const langGroqGenerator = langGroq(text, model_type);
  
    for await (const chunk of langGroqGenerator) {
        console.log(chunk)
      res.write(JSON.stringify(chunk));

    }
  
    res.end();
  });

const PORT = process.env.PORT || 3000;


function validateConversation(req, res) {
    if (!req.body.messages) {
        res.status(400).send({ error: "No conversation provided" });
        return false;
    }
    return true;
}

function initializeResponseHeaders(res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    });
}

async function processStream(reader, res) {
    let accumulatedJson = '';

    async function processChunk({ done, value }) {
        if (done) {
            handleStreamCompletion(accumulatedJson, res);
            return;
        }

        accumulatedJson += new TextDecoder("utf-8").decode(value);
        try {
            while (accumulatedJson.length) {
                const json = JSON.parse(accumulatedJson);
                res.write(JSON.stringify(json) + "\n");
                accumulatedJson = '';
            }
        } catch (error) {
            // Wait for more data
        }

        reader.read().then(processChunk);
    }

    reader.read().then(processChunk);
}

function handleStreamCompletion(accumulatedJson, res) {
    if (accumulatedJson.trim()) {
        try {
            const json = JSON.parse(accumulatedJson);
            res.write(JSON.stringify(json) + "\n");
        } catch (error) {
            console.error("Error parsing final JSON chunk:", error);
        }
    }
    res.end();
}

async function streamGroqResponse(req, res) {
    if (!validateConversation(req, res)) return;

    try {
        const stream = await callGroqAPI(req.body.messages);
        initializeResponseHeaders(res);
        const reader = stream.getReader();
        await processStream(reader, res);
    } catch (error) {
        console.error("Failed to process stream:", error);
        res.status(500).send({ error: "Failed to fetch response from Groq" });
    }
}

app.post('/api/json-stream-response', streamGroqResponse);


app.post('/api/query_agent_conversational_memory', async (req, res) => {
    const query = req.body;

    console.log("query", query)
  
    try {
        // Since groq_stream is async, we await its resolution which should return the contents array
        const contents = await groq_conversational_memory(query);
  
        // Set headers for a plain text response
        res.writeHead(200, {
            'Content-Type': 'text/plain',
        });
  
        // Iterate over the contents array and write each content to the response
        contents.forEach(content => {
            res.write(content); // Adding a newline for readability
        });
  
        // End the response
        res.end();
    } catch (error) {
        console.error('Error streaming the response:', error);
        res.status(500).end('Error processing the query', error);
    }
  });
  

  
app.post('/api/query_agent_conversational_lang_memory', async (req, res) => {
  const query = req.body;

  console.log("query", query);

  try {
    // Set headers for a plain text response
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });

    // Since langStream is an async generator, we use a for-await-of loop
    for await (const content of langStream(query)) {
      res.write(content); // Adding a newline for readability
    }

    // End the response after the stream is done
    res.end();
  } catch (error) {
    console.error('Error streaming the response:', error);
    res.status(500).send('Error processing the query');
  }
});


///////////////////////////////////////////////////////////////
/////////////////////// EMBEDDINGS //////////////////////////////////
////////////////////////////////////////////////////////////////


app.post('/api/embeddings-binary', async (req, res) => {
    const texts = req.body.text;
  
    try {
      const embeddings = await fetchEmbeddings_binary(texts);
          res.send(embeddings);
      } catch (error) {
          console.error('Error handling query binary embeddings:', error);
          res.status(500).send({ error: 'Internal server error with binary embeddings' + error});
      }
  })
  
  app.post('/api/search-embeddings-binary', async (req, res) => {
    const targetData = req.body.targetData;
    const dataArray = req.body.queryEmbedding
    const k = req.body.k || 3
  
    try {
      const indices = await findTopKSimilarIndices(targetData, dataArray, k=3) 
          res.send(indices);
      } catch (error) {
          console.error('Error handling query binary embeddings:', error);
          res.status(500).send({ error: 'Internal server error with findTopKSimilarIndices embeddings'});
      }
  })
  

  ///////////////////////// SCRAPE ///////////////////////////////////
  ////////////////////////// SCRAPE WEBSITE AND EXTRACT TEXT //////////
  /////////////////////////// ALLOW USER TO QUERY THIS TEXT ////////////


  app.post('/api/scrape', async (req, res) => {
    const url = req.body.url;
    const scraper = new Scraper(url);
    const text = await scraper.getText();

    res.send(text);
  })

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
