import { useState } from 'react';

export default function RootyApp() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Rooty, a mortgage guideline AI assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await response.json();
    setMessages([...newMessages, data.reply]);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Rooty / Alpha</h1>
      <div className="w-full max-w-3xl border rounded-lg p-4 shadow">
        <div className="h-96 overflow-y-auto space-y-2 mb-4">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md text-sm ${msg.role === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-100'}`}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Rooty'}:</strong> {msg.content}
            </div>
          ))}
          {loading && <div className="text-gray-500 text-sm">Rooty is thinking...</div>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border px-3 py-2 rounded-md"
            placeholder="Ask a mortgage scenario..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
