import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

const buildSystemInstructions = (code, config) => {
    return `You are an AI assistant specialized in explaining Python code used for evolutionary algorithms (EA).
You will be given the Python code and its configuration parameters (JSON).
Your primary goal is to help the user understand this specific code and configuration.
First, analyze the provided code and configuration.
Then, answer the user's questions based on the code, the configuration, related EA concepts, or general programming knowledge if relevant.
Be concise and clear in your explanations. The code uses DEAP (Distributed Evolutionary Algorithms in Python) library.
The code is a Python script that implements a genetic algorithm for the configuration that is provided.
The configuration is a JSON object that contains the parameters used in the code.
The code may contain the following components:
1. Import statements
2. Function definitions
The code uses scoop for parallel execution.

--- START CODE ---
${code || "Code not provided."}
--- END CODE ---

--- START CONFIGURATION ---
${config || "Configuration not provided."}
--- END CONFIGURATION ---

Now, answer the user's query based on the provided context and your general knowledge.`;
};

export async function POST(req) {
    try {
        const requestBody = await req.json();
        // console.log(
        // 	"Received request body in API:",
        // 	JSON.stringify(requestBody, null, 2),
        // );

        const { messages } = requestBody;

        let codeContent = requestBody.code;
        let configContent = requestBody.config;

        if (!messages || !Array.isArray(messages)) {
            console.error("API Error: 'messages' array missing or invalid.");
            return new Response("Missing 'messages' in request body", {
                status: 400,
            });
        }

        if (!codeContent || !configContent) {
            console.error(
                "API Error: Missing code or configuration content. Code Provided:",
                !!codeContent,
                "Config Provided:",
                !!configContent,
            );
        }

        const systemPrompt = buildSystemInstructions(
            codeContent,
            configContent,
        );

        const result = streamText({
            model: google("gemini-2.0-flash-001"),
            system: systemPrompt,
            messages: messages,
            maxTokens: 10008,
            temperature: 0.7,
            topP: 1,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in Gemini API route:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        return new Response(`Error processing request: ${errorMessage}`, {
            status: 500,
            headers: { "Content-Type": "text/plain" },
        });
    }
}
