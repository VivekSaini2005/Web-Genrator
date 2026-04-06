import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const Preview = () => {
  const { messages } = useChat();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
        <p className="text-lg font-medium">Start a new conversation</p>
      </div>
    );
  }

  const aiMessages = messages.filter(msg => msg.role !== 'user');
  const latestAiMessage = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].content : '';

  if (!latestAiMessage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
        <p className="text-lg font-medium">No preview available yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 w-full h-full">
      <iframe
        srcDoc={latestAiMessage}
        className="w-full h-full border-none rounded-xl bg-white"
        title="Website Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default Preview;