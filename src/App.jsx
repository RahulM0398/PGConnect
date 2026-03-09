import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { classifyQuery } from './utils/classifier';
import { callPerplexity } from './utils/perplexity';
import { Sparkles, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';

const SuggestedQuery = ({ text, onClick, icon: Icon }) => (
  <button
    onClick={() => onClick(text)}
    className="suggested-query-btn"
  >
    <div className="sq-icon">{Icon && <Icon size={18} />}</div>
    <span>{text}</span>
  </button>
);

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const userMsg = { type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const localResult = classifyQuery(text);
      // Pass the current message history to Perplexity for context
      const aiResponseText = await callPerplexity(text, messages);

      // Only treat as error if aiResponseText is explicitly an error message
      const isActualError = !aiResponseText || aiResponseText.includes("I encountered an error") || aiResponseText.includes("unable to access");

      let systemMsg = {
        type: 'system',
        text: aiResponseText,
        data: localResult
      };

      if (!localResult) {
        systemMsg.data = {
          id: 'fallback-311',
          category: 'General Queries',
          title: 'Contact PGC311',
          description: 'General County Information & Service Requests',
          severity: 'Low',
          steps: [],
          contacts: [
            { name: "PGC311 Portal", url: "https://pgc311.com/customer/s/", description: "Submit Service Request" },
            { name: "Call 311", phone: "311", description: "Or 301-883-4748" }
          ],
          emergency_notice: null
        };
      }

      setMessages(prev => [...prev, systemMsg]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        type: 'system',
        text: "I encountered a connection error. Please try again.",
        data: null
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className={`chat-header ${messages.length === 0 ? 'hero-header' : 'compact-header'}`}>
        <div className="header-content">
          <h1>GovForms</h1>
          {messages.length === 0 && <p>Your intelligent civic guide for Prince George's County.</p>}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="suggestions-grid">
              <SuggestedQuery text="I received a phishing email" onClick={handleSend} icon={AlertCircle} />
              <SuggestedQuery text="Report a missed trash pickup" onClick={handleSend} icon={MessageSquare} />
              <SuggestedQuery text="Where can I get mental health help?" onClick={handleSend} icon={Sparkles} />
              <SuggestedQuery text="How do I file a police report?" onClick={handleSend} icon={HelpCircle} />
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

export default App;
