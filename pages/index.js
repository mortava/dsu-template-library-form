import { useState } from 'react';

export default function KoreroApp() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are an AI assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const hasConversation = messages.filter(m => m.role !== 'system').length > 0;

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...newMessages, data.reply]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please check the console for details.'
      }]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([{ role: 'system', content: 'You are an AI assistant.' }]);
    setInput('');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4">
          <button
            onClick={newChat}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
            <span className="ml-auto text-xs text-gray-400">Ctrl K</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          {/* Chat history could go here */}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-900">MORTAVA</div>
          <button className="text-xs text-gray-500 hover:text-gray-700">Upgrade</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toggle Sidebar Button */}
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {!hasConversation ? (
            /* Landing Page */
            <div className="w-full max-w-3xl flex flex-col items-center justify-center" style={{ marginTop: '-10vh' }}>
              <h1 className="text-7xl font-light tracking-wide mb-12">KŌRERO</h1>
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-4 pl-12 pr-24 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white shadow-sm"
                    placeholder="Ask Anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </button>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Chat View */
            <div className="w-full max-w-4xl flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto pb-32">
                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                  <div key={idx} className="mb-8">
                    {msg.role === 'assistant' && (
                      <div className="mb-4">
                        <h2 className="text-4xl font-light text-gray-300">Response</h2>
                      </div>
                    )}
                    <div className={`${msg.role === 'assistant' ? 'bg-gray-100 rounded-2xl p-6' : 'mb-6'}`}>
                      <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="mb-8">
                    <div className="mb-4">
                      <h2 className="text-4xl font-light text-gray-300">Response</h2>
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-6">
                      <p className="text-gray-400">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar (Fixed at bottom for chat view) */}
        {hasConversation && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pb-6 pt-12">
            <div className={`max-w-4xl mx-auto px-4 ${sidebarOpen ? 'ml-64' : ''} transition-all duration-300`}>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-4 pl-12 pr-24 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white shadow-sm"
                  placeholder="Ask Anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
