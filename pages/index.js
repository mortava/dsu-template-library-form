import { useState } from 'react';

export default function KoreroApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChat, setShowChat] = useState(false);

  function startNewChat() {
    setShowChat(true);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
              <span className="ml-auto text-xs text-gray-400">Ctrl K</span>
            </button>
          </div>
          <div className="flex-1"></div>
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900">MORTAVA</div>
            <button className="text-xs text-gray-500 hover:text-gray-700 mt-1">Upgrade</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        {!showChat ? (
          /* Landing Page */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-8xl font-light tracking-wider mb-16">KŌRERO</h1>
              <button
                onClick={startNewChat}
                className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-lg"
              >
                Start Chat
              </button>
            </div>
          </div>
        ) : (
          /* Chat Iframe */
          <div className="flex-1 relative">
            <iframe
              src="https://chat.openai.com/g/g-rooty-alpha"
              className="w-full h-full border-0"
              title="Rooty Alpha GPT"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        )}
      </div>
    </div>
  );
}
