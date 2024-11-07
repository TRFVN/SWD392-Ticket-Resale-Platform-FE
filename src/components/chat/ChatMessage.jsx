import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";

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
        <div className="flex-1 p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!messages.length) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div
              className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 
                          flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Bắt đầu cuộc trò chuyện của bạn!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((message, index) => {
          const isCurrentUser = message.sendMessageUserId === currentUserId;
          const showAvatar =
            !isCurrentUser &&
            (!messages[index - 1] ||
              messages[index - 1].sendMessageUserId !==
                message.sendMessageUserId);

          return (
            <div
              key={message.messageId}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              {!isCurrentUser && (
                <div
                  className={`flex-shrink-0 ${showAvatar ? "" : "invisible"}`}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                                flex items-center justify-center text-white font-medium text-sm"
                  >
                    {message.sendMessageUserId?.slice(0, 2).toUpperCase() ||
                      "U"}
                  </div>
                </div>
              )}

              <div className={`group max-w-[75%] ${showAvatar ? "" : "ml-10"}`}>
                {!isCurrentUser && showAvatar && (
                  <div className="ml-1 mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {message.sendMessageUserId}
                    </span>
                  </div>
                )}

                <div
                  className={`
                    relative rounded-2xl px-4 py-2 shadow-sm
                    ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }
                  `}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.messageContent}
                  </p>

                  <div
                    className={`flex items-center gap-1 mt-1 text-xs 
                    ${
                      isCurrentUser
                        ? "text-orange-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span>{formatMessageTime(message.createTime)}</span>
                    {isCurrentUser && (
                      <CheckCheck className="w-4 h-4 opacity-75" />
                    )}
                  </div>
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
