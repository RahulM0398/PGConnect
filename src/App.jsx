import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ProfileMenu from './components/ProfileMenu';
import { classifyQuery } from './utils/classifier';
import { callPerplexity } from './utils/perplexity';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, MessageSquare, AlertCircle, HelpCircle, Plus, ChevronRight } from 'lucide-react';

// Follow-up suggestions mapped by category
const FOLLOW_UP_MAP = {
  'Health': [
    "How do I apply for Medicaid?",
    "Where is the nearest county clinic?",
    "How do I get a flu shot?"
  ],
  'Emergencies': [
    "How do I file a police report?",
    "Where can I find emergency shelter?",
    "How do I report a gas leak?"
  ],
  'IT/Cybersecurity Related': [
    "How do I report identity theft?",
    "What should I do if I was hacked?",
    "How to protect my accounts?"
  ],
  'Civic': [
    "How do I get a building permit?",
    "Where do I pay my property taxes?",
    "How do I report a pothole?"
  ],
  'General Queries': [
    "How do I contact PGC311?",
    "Where do I pay a traffic ticket?",
    "How do I register to vote?"
  ]
};

const SuggestedQuery = ({ text, onClick, icon: Icon, delay = 0 }) => (
  <motion.button
    onClick={() => onClick(text)}
    className="suggested-query-btn"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
  >
    <div className="sq-icon">{Icon && <Icon size={18} />}</div>
    <span>{text}</span>
  </motion.button>
);

const FollowUpChip = ({ text, onClick }) => (
  <motion.button
    onClick={() => onClick(text)}
    className="followup-chip"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25 }}
  >
    <span>{text}</span>
    <ChevronRight size={14} />
  </motion.button>
);

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, followUps]);

  const handleNewChat = () => {
    setMessages([]);
    setFollowUps([]);
    setIsLoading(false);
  };

  const handleSend = async (text) => {
    const userMsg = { type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setFollowUps([]);

    try {
      const localResult = classifyQuery(text);
      const aiResponseText = await callPerplexity(text, messages);

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

      // Generate follow-up suggestions based on response category
      const category = systemMsg.data?.category || 'General Queries';
      const suggestions = FOLLOW_UP_MAP[category] || FOLLOW_UP_MAP['General Queries'];
      // Pick 2 random suggestions from the category that aren't the current query
      const filtered = suggestions.filter(s => s.toLowerCase() !== text.toLowerCase());
      const picked = filtered.sort(() => 0.5 - Math.random()).slice(0, 2);
      setFollowUps(picked);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        type: 'system',
        text: "",
        data: null
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className={`chat-header ${messages.length === 0 ? 'hero-header' : 'compact-header'}`}>
        <div className="header-content">
          <div className="header-row">
            {messages.length > 0 && (
              <motion.button
                className="new-chat-btn"
                onClick={handleNewChat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                title="New Chat"
              >
                <Plus size={18} />
              </motion.button>
            )}
            <h1 onClick={handleNewChat} className="header-title-clickable">PGConnect</h1>
            <ProfileMenu />
          </div>
          {messages.length === 0 && (
            <p className="tagline">AI Connecting Citizens to get right Help</p>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="suggestions-grid">
              <SuggestedQuery text="I received a phishing email" onClick={handleSend} icon={AlertCircle} delay={0} />
              <SuggestedQuery text="Report a missed trash pickup" onClick={handleSend} icon={MessageSquare} delay={0.08} />
              <SuggestedQuery text="Where can I get mental health help?" onClick={handleSend} icon={Sparkles} delay={0.16} />
              <SuggestedQuery text="How do I file a police report?" onClick={handleSend} icon={HelpCircle} delay={0.24} />
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && <TypingIndicator />}

        {/* Follow-up suggestions */}
        {!isLoading && followUps.length > 0 && (
          <motion.div
            className="followup-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="followup-label">Related questions</span>
            <div className="followup-chips">
              {followUps.map((text, idx) => (
                <FollowUpChip key={idx} text={text} onClick={handleSend} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

export default App;
