import React from 'react';
import { motion } from 'framer-motion';
import ActionCard from './ActionCard';
import { Bot } from 'lucide-react';

const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';

    return (
        <div className={`message-row ${isUser ? 'user' : 'system'}`}>
            {isUser ? (
                <div className="message-bubble user">
                    <p>{message.text}</p>
                </div>
            ) : (
                <div className="system-msg-wrapper">
                    <div className="system-avatar">
                        <Bot size={18} />
                    </div>
                    <div className="system-msg-content">
                        <div className="message-bubble system">
                            <p>{message.text}</p>
                            {message.data && <ActionCard data={message.data} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
