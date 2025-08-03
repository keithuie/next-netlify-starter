import { useState, useEffect, useRef } from 'react';

// Placeholder for icons (replace with your actual icon components)
const UserIcon = () => <span>👤</span>;
const BotIcon = () => <span>🤖</span>;
const SendIcon = () => <span>➤</span>;

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, describe your machinery problem..." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const wasAtBottomRef = useRef(true);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if user is at the bottom
  const checkIfAtBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const { scrollHeight, scrollTop, clientHeight } = chatContainer;
      wasAtBottomRef.current = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    }
  };

  // Auto-scroll only if at bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      checkIfAtBottom();
      if (wasAtBottomRef.current) {
        scrollToBottom();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [messages]);

  // Set document title
  useEffect(() => {
    document.title = "Chat Agent";
  }, []);

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessageContent = input.trim();
    if (!userMessageContent) return;

    const newMessages = [...messages, { role: 'user', content: userMessageContent }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Simulate API call with a long response
    setTimeout(() => {
      const botReply = "This is a simulated long response to test scrolling. Here's a detailed explanation: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white font-sans">
      {/* Header */}
      <header className="flex-shrink-0 bg-gray-900 shadow-md p-4 flex items-center space-x-3 z-10">
        <span className="text-lg font-semibold">Chat Agent</span>
        <span className="text-green-400">Online</span>
      </header>

      {/* Chat Messages */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-800"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 max-w-xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
            </div>
            <div
              className={`px-5 py-3 rounded-2xl shadow-lg ${
                msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
              }`}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 max-w-xl">
            <div className="p-2 rounded-full bg-gray-700">
              <BotIcon />
            </div>
            <div className="px-5 py-3 rounded-2xl shadow-lg bg-gray-700 rounded-bl-none">
              <p className="text-base">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 bg-gray-900 p-4 z-10">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-gray-700 rounded-full border-2 border-transparent focus:border-indigo-500 focus:outline-none transition duration-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
}
