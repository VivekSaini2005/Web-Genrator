import React from 'react';

const ChatHistory = ({ messages }) => {
  return (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className="flex justify-end mb-4 shrink-0">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-2xl rounded-tr-md max-w-[80%] shadow-md text-sm md:text-base leading-relaxed">
            {msg.content}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatHistory;
