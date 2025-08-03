import { useState, useEffect, useRef } from 'react';

// --- Icon Components ---
const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm7.125 4.5a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm-7.125 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 11.25a3.375 3.375 0 100 6.75 3.375 3.375 0 000-6.75z" clipRule="evenodd" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

// --- UI Components ---

// Renders a single chat message bubble
const ChatMessage = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    
    return (
        <div className={`flex items-start gap-4 ${!isAssistant && 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAssistant ? 'bg-gray-600' : 'bg-blue-500'}`}>
                {isAssistant ? <BotIcon /> : <UserIcon />}
            </div>
            <div className={`p-4 rounded-lg max-w-2xl ${isAssistant ? 'bg-gray-700' : 'bg-blue-600'}`}>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
};

// Renders the input form at the bottom
const ChatInput = ({ input, setInput, handleSendMessage, isLoading }) => {
    const textareaRef = useRef(null);

    // Auto-resize the textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <footer className="bg-gray-800/80 backdrop-blur-sm p-4 w-full">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-end gap-3">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 p-3 bg-gray-700 rounded-lg resize-none border-2 border-transparent focus:border-indigo-500 focus:outline-none transition duration-300 max-h-48"
                    rows="1"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="h-12 w-12 flex-shrink-0 bg-indigo-600 rounded-lg text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !input.trim()}
                >
                    <SendIcon />
                </button>
            </form>
        </footer>
    );
};


// --- Main Chat Component ---
export default function Home() {
  const [messages, setMessages] = useState([
      { role: 'assistant', content: "Hi, describe your machinery problem, the context, history and the CBM data, the more information the better..." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // --- Scroll logic ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // --- Set document title ---
  useEffect(() => {
    document.title = "Chat Agent";
  }, []);

  // --- API Connection Logic (Preserved) ---
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const userMessageContent = input.trim();
    if (!userMessageContent) return;

    const newMessages = [...messages, { role: 'user', content: userMessageContent }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const apiEndpoint = 'https://eucnfpofat5q2e7g4oy6gczf.agents.do-ai.run/api/v1/chat/completions'; 
    const accessToken = 'iF7nF1iW60budmD73Pu9jjrHgzGid1HB';

    try {
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
                <ChatMessage message={{ role: 'assistant', content: 'Thinking...' }} />
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
