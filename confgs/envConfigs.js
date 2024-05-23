

// export let jsonAgentPrompt = `Output a list of dictionaries of annotations in JSON format. The list should be in the following format: [{label: "annotation label", "highlight": "text to highlight", "description": "description of the annotation"}, {...},...]. The "text to highlight" should be exactly the same text as the one you want to highlight from the original text.\n\n`;

export let jsonAgentPrompt = `Output a list of annotations in JSON format. Use a list of dictionaries; each dictionary should have the keys "label": "annotation label", "highlight": "text to highlight", and "description": "description of the annotation". The "highlight" should be exactly the text to highlight from the original text.`;


export let streamAgentPrompt = `You are a master coach and teacher. Given the BACKGROUND information and QUERY, output in markdown a response: `
