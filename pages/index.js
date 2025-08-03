import { useState, useEffect, useRef } from 'react';

// --- Icon Components ---
// Using inline SVGs for icons to avoid extra dependencies.
const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm7.125 4.5a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm-7.125 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 11.25a3.375 3.375 0 100 6.75 3.375 3.375 0 000-6.75z" clipRule="evenodd" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);


// --- Main Chat Component ---
export default function Home() {
  // State to hold the conversation messages
  const [messages, setMessages] = useState([
      { role: 'assistant', content: "Hi, describe your machinery problem, the context, history and the CBM data, the more information the better..." }
  ]);
  // State for the user's input
  const [input, setInput] = useState('');
  // State to track if the bot is typing
  const [isLoading, setIsLoading] = useState(false);
  // Ref to the messages container for auto-scrolling
  const messagesEndRef = useRef(null);

  // Function to automatically scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect to scroll whenever new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // useEffect to set the document title on component mount
  useEffect(() => {
    document.title = "Chat Agent";
  }, []);


  // --- This is where you connect to your DigitalOcean Chatbot ---
  const handleSendMessage = async (e) => {
    // Prevents the default form submission behavior (page reload)
    e.preventDefault();
    
    // Trim the input and do nothing if it's empty
    const userMessageContent = input.trim();
    if (!userMessageContent) return;

    const newMessages = [...messages, { role: 'user', content: userMessageContent }];
    // Add user's message to the chat and clear the input field
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // --- API Call to your Chatbot ---
    const apiEndpoint = 'https://eucnfpofat5q2e7g4oy6gczf.agents.do-ai.run/api/v1/chat/completions'; 
    const accessToken = 'iF7nF1iW60budmD73Pu9jjrHgzGid1HB';

    try {
      // Send the user's message to the chatbot API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({ role: msg.role, content: msg.content })),
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }
      
      const data = await response.json();
      const botReply = data.choices && data.choices[0] ? data.choices[0].message.content : "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error("Failed to connect to the chatbot:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please check the console for errors." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white font-sans">
      {/* CORRECTED: Removed sticky positioning and added flex-shrink-0 for a more robust flexbox layout. */}
      <header className="flex-shrink-0 bg-gray-900 shadow-md p-4 flex items-center space-x-3 z-10">
        <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full">
            <BotIcon />
        </div>
        <div>
            <h1 className="text-xl font-bold">Chat Agent</h1>
            <p className="text-sm text-green-400">Online</p>
        </div>
      </header>

      {/* CORRECTED: This flex-1 and overflow-y-auto setup will now work correctly. */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 max-w-xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
            </div>
            <div className={`px-5 py-3 rounded-2xl shadow-lg ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4 max-w-xl">
                <div className="p-2 bg-gray-700 rounded-full">
                    <BotIcon />
                </div>
                <div className="px-5 py-3 rounded-2xl shadow-lg bg-gray-700 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* CORRECTED: Removed sticky positioning and added flex-shrink-0 for a more robust flexbox layout. */}
      <footer className="flex-shrink-0 bg-gray-900 p-4 z-10">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-gray-700 rounded-full border-2 border-transparent focus:border-indigo-500 focus:outline-none transition duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
}
