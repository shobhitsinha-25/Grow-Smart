// AiHelper.jsx
import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI outside the component to avoid re-initializing on every render
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const GeminiAssistant = ({ onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    // 1. Validate user input
    if (!userInput.trim()) {
      setResponseText("Please enter a question.");
      return;
    }

    setLoading(true);
    setResponseText("");

    try {
      // 2. Defensive check for API key presence
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        setResponseText(" Error: API Key (VITE_GEMINI_API_KEY) is not set. Please check your .env file.");
        setLoading(false);
        return;
      }

      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash", // Or "gemini-2.0-flash" if you have access and prefer it
        contents: [{ role: "user", parts: [{ text: userInput }] }],
      });

      if (!result || typeof result.text === 'undefined') {
        console.error("Gemini API: The 'generateContent' call returned an empty or malformed text response.", result);
        setResponseText(" Error: Failed to get text response from the Gemini API. Response format unexpected.");
        return;
      }

      const geminiResponseText = result.text; // Access 'text' as a property, not a function
      setResponseText(geminiResponseText);

    } catch (error) {
      console.error("Gemini API error:", error);
      if (error.message.includes("API key not valid")) {
         setResponseText(" Error: Your Gemini API key is invalid or not correctly configured.");
      } else if (error.message.includes("Quota exceeded")) {
         setResponseText(" Error: API usage quota exceeded. Please check your billing or try again later.");
      } else if (error.message.includes("400") || error.message.includes("bad request")) {
         setResponseText(" Error: Invalid request to Gemini AI. Check your input or model name.");
      } else {
         setResponseText(" An unexpected error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] relative text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl"
        >
          ✖️
        </button>
        <h2 className="text-lg font-bold mb-2">Ask Cultiv AI</h2>
        <input
          type="text"
          className="w-full border p-2 mb-2 rounded"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask your question..."
        />
        <button
          onClick={askQuestion}
          disabled={loading || !userInput.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
        {responseText && (
          // Apply max-height and overflow-y-auto here
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm max-h-40 overflow-y-auto">
            {responseText}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAssistant;