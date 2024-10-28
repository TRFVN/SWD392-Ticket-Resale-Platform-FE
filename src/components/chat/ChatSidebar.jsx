const ChatSidebar = ({
  userId,
  onUserIdChange,
  currentRoom,
  onRoomChange,
  onJoinRoom,
  onLeaveRoom,
  availableRooms = [
    { id: "room1", name: "General Chat" },
    { id: "room2", name: "Support" },
    { id: "room3", name: "Trading" },
  ],
}) => {
  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Chat Rooms
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your User ID
            </label>
            <input
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700
                       border border-gray-200 dark:border-gray-600
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent
                       text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Available Rooms */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            AVAILABLE ROOMS
          </h3>
          <div className="space-y-2">
            {availableRooms.map((room) => (
              <button
                key={room.id}
                onClick={() =>
                  currentRoom !== room.id ? onJoinRoom(room.id) : onLeaveRoom()
                }
                className={`w-full px-4 py-3 rounded-lg text-left transition-all
                         hover:bg-gray-50 dark:hover:bg-gray-700/50
                         ${
                           currentRoom === room.id
                             ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                             : "text-gray-700 dark:text-gray-300"
                         }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-medium">{room.name}</span>
                  </div>
                  {currentRoom === room.id && (
                    <span
                      className="text-xs bg-orange-100 dark:bg-orange-900/40 
                                 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full"
                    >
                      Active
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Status */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20
                       flex items-center justify-center"
          >
            <span className="text-lg font-medium text-orange-600 dark:text-orange-400">
              {userId ? userId[0].toUpperCase() : "?"}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {userId || "Not Connected"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentRoom ? `In ${currentRoom}` : "Not in a room"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatSidebar;
