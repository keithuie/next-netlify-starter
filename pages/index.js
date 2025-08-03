import { useState, useEffect, useRef } from 'react';

// --- Icon Components ---
const LogoIcon = () => (
    // Using the uploaded logomark. Ensure it is in the /public folder.
    <img src="/uie-logomark.png" alt="Uie Assist Logo" className="w-6 h-6" />
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
  </svg>
);

// --- UI Components ---

const ChatMessage = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    return (
        <div className="w-full max-w-3xl mx-auto flex items-start gap-4 px-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                {isAssistant ? <LogoIcon /> : <UserIcon />}
            </div>
            <div className="flex-grow pt-1">
                <p className="font-semibold text-gray-100">{isAssistant ? 'Uie Assist' : 'You'}</p>
                <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </div>
            </div>
        </div>
    );
};

const ChatInput = ({ input, setInput, handleSendMessage, isLoading }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <div className="w-full bg-gray-900/80 backdrop-blur-sm pt-2 pb-4">
            <form 
                onSubmit={handleSendMessage} 
                className="max-w-3xl mx-auto p-2 flex items-end bg-gray-800 border border-gray-700 rounded-2xl shadow-lg"
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your machinery problem..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none px-4 py-2 max-h-48"
                    rows="1"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-10 h-10 flex-shrink-0 bg-indigo-600 rounded-full text-white flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !input.trim()}
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  
  useEffect(() => {
    document.title = "Uie Assist";
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
    <div className="flex h-screen bg-gray-900 text-white font-sans">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
            <header className="p-4 border-b border-gray-700 text-center">
                <h1 className="text-2xl font-bold text-gray-100">Uie Assist</h1>
                <p className="text-sm text-gray-400">Ai help for machinery analysis</p>
            </header>
            
            <div className="flex-1 overflow-y-auto">
                <div className="pt-8 pb-4 space-y-8">
                    {messages.map((msg, index) => (
                      <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="w-full max-w-3xl mx-auto flex items-start gap-4 px-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                                <LogoIcon />
                            </div>
                            <div className="flex-grow pt-1">
                                <p className="font-semibold text-gray-100">Uie Assist</p>
                                <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <ChatInput 
                input={input}
                setInput={setInput}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
    </div>
  );
}
