// src/components/chat/ChatSidebar.jsx
import { memo } from "react";
import { ChevronRight, Users, MessagesSquare, RefreshCw } from "lucide-react";

const ChatSidebar = memo(
  ({
    userId,
    currentRoom,
    onRoomChange,
    chatRooms = [],
    unreadCounts = {},
    isLoading = false,
    onRefresh,
  }) => {
    const formatRoomName = (room) => {
      if (!room.nameRoom || room.nameRoom === "string") {
        return `Room #${room.chatRoomId.slice(0, 8)}`;
      }
      return room.nameRoom;
    };

    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return dateString;
      }
    };

    if (isLoading) {
      return (
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-4 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Chat Rooms
          </h2>
          <button
            onClick={onRefresh}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Refresh rooms"
          >
            <RefreshCw size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Available Rooms */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <Users size={14} />
              <span>AVAILABLE ROOMS ({chatRooms.length})</span>
            </div>

            {chatRooms.length > 0 ? (
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <button
                    key={room.chatRoomId}
                    onClick={() => onRoomChange(room.chatRoomId)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 group
                    ${
                      currentRoom === room.chatRoomId
                        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatRoomName(room)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(room.createTime)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCounts[room.chatRoomId] > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
                            {unreadCounts[room.chatRoomId]}
                          </span>
                        )}
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400"
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <MessagesSquare size={48} className="mb-2 opacity-50" />
                <p className="text-sm">No chat rooms available</p>
              </div>
            )}
          </div>
        </div>

        {/* User Status */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <span className="text-lg font-medium text-orange-600 dark:text-orange-400">
                {userId ? userId.slice(0, 2).toUpperCase() : "?"}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {userId || "Not Connected"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentRoom
                  ? `In Room #${currentRoom.slice(0, 8)}`
                  : "Not in a room"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ChatSidebar.displayName = "ChatSidebar";

export default ChatSidebar;
