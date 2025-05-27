import React, { useState } from 'react';

const AIHelper = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: query }],
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Gemini API Error:', errorData);
        setResponse(`Error: ${errorData.error?.message || res.statusText}`);
      } else {
        const data = await res.json();
        const summary =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response found.';
        setResponse(summary);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setResponse('Failed to fetch response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-md w-full max-w-lg z-50 border border-gray-200">
      <h2 className="text-sm font-semibold mb-2 text-gray-800 text-center">Ask Ai</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="flex-grow px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm"
        />
        <button
          onClick={handleQuery}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-green-600 transition duration-200"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {response && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md text-gray-800 text-sm max-h-20 overflow-y-auto">
          <strong>AI:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default AIHelper;
