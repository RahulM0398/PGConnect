import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
    return (
        <div className="message-row system">
            <div className="system-msg-wrapper">
                <div className="system-avatar" style={{ opacity: 0.6 }}>
                    <span>⬤</span>
                </div>
                <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
