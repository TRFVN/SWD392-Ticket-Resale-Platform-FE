// src/components/chat/ChatMessage.jsx
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const ChatMessages = memo(
  ({ messages = [], currentUserId, messagesEndRef, isLoading }) => {
    const formatMessageTime = (timestamp) => {
      try {
        return formatDistanceToNow(new Date(timestamp), {
          addSuffix: true,
          locale: vi,
        });
      } catch {
        return timestamp;
      }
    };

    if (isLoading) {
      return (
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!messages.length) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
          <p>Bắt đầu cuộc trò chuyện của bạn!</p>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sendMessageUserId === currentUserId;

          return (
            <div
              key={message.messageId}
              className={`flex items-start gap-2 ${
                isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">
                    {message.sendMessageUserId?.slice(0, 2).toUpperCase() ||
                      "U"}
                  </span>
                </div>
              )}

              <div
                className={`
                rounded-lg px-4 py-2 max-w-[70%] shadow-sm
                ${
                  isCurrentUser
                    ? "bg-orange-500 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-700 rounded-bl-none"
                }
              `}
              >
                <div className="flex flex-col">
                  {!isCurrentUser && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.sendMessageUserId}
                    </span>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words my-1">
                    {message.messageContent}
                  </p>
                  <span className="text-xs opacity-75 self-end">
                    {formatMessageTime(message.createTime)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  },
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
