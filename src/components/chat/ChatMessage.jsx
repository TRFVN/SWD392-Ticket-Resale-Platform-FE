// src/components/chat/ChatMessage.jsx
const ChatMessages = ({ messages, userId, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 flex ${
            msg.userId === userId ? "justify-end" : "justify-start"
          }`}
        >
          {msg.userId !== userId && (
            <div
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 
                        flex items-center justify-center mr-2"
            >
              <span className="text-sm font-medium">
                {msg.userId[0].toUpperCase()}
              </span>
            </div>
          )}
          <div
            className={`rounded-lg px-4 py-2 max-w-[70%] shadow-sm
              ${
                msg.userId === userId
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 rounded-bl-none"
              }`}
          >
            {msg.userId !== userId && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {msg.userId}
              </p>
            )}
            <p className="text-sm">{msg.content}</p>
            <span className="text-xs opacity-75 mt-2 block">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default ChatMessages;
