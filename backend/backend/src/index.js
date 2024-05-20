// Importing modules using ES6 import syntax
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { langGroq } from './agents/langGroq.js';
import {getWikipediaSummary} from './agents/wikiSum.js';
import http from 'http';
// import { WebSocketServer } from 'ws';
import WebSocket, { WebSocketServer } from 'ws';


const app = express();

app.use(helmet());

// CORS for all domains (customize as needed)
app.use(cors());

// Built-in middleware to parse JSON
app.use(express.json());


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

// const result = [];
// for await (const chunk of langGroqGenerator) {
//   result.push(chunk);
// }

// res.json(result);
// });


// Start the server
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


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
