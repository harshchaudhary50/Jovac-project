import { parseAiJson } from "../utils/parseAiJson.js";

const OLLAMA_API_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

export const generateOllamaResponse = async (prompt, defaultTopic = "Exam Notes") => {
    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                prompt: prompt,
                format: "json",
                stream: false,
                options: {
                    temperature: 0.2
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Ollama Error (${response.status}): ${err}`);
        }

        const data = await response.json();
        const content = data.response;

        if (!content) {
            throw new Error("No response received from local Ollama model");
        }

        return parseAiJson(content, defaultTopic);

    } catch (error) {
        console.error("❌ Ollama Local Fetch Error:", error.message);
        throw error;
    }
};
