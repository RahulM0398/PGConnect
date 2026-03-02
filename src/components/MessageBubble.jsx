import React from 'react';
import ActionCard from './ActionCard';

const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';

    return (
        <div className={`message-row ${isUser ? 'user' : 'system'}`}>
            <div className={`message-bubble ${isUser ? 'user' : 'system'}`}>
                <p>{message.text}</p>

                {/* Render Action Card if data is present */}
                {message.data && <ActionCard data={message.data} />}
            </div>
        </div>
    );
};

export default MessageBubble;
