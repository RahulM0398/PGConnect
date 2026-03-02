import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask about county services..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled}
                />
                <button
                    type="submit"
                    className="send-btn"
                    disabled={!input.trim() || disabled}
                    aria-label="Send message"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
