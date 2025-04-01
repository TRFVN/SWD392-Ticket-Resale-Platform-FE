import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Send,
  Paperclip,
  Smile,
  DollarSign,
  Tag,
  Users,
  MessagesSquare,
  RefreshCw,
  Check,
  CheckCheck,
  ChevronRight,
  X,
  Search,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  Menu,
  Bell,
  Lightbulb,
  Sun,
  Moon,
  ThumbsUp,
  ThumbsDown,
  Clock,
  PieChart,
  ArrowUpDown,
} from "lucide-react";

// Main Component
const ChatPage = () => {
  // State management
  const [currentUserId, setCurrentUserId] = useState("user123");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return savedMode === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [inputFocused, setInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageGroups, setMessageGroups] = useState([]);
  const [showNegotiationStats, setShowNegotiationStats] = useState(false);

  const messagesEndRef = useRef(null);

  // Mock data fetching
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock chat rooms with ticket details
      const mockRooms = [
        {
          chatRoomId: "room1234567890",
          nameRoom: "Vé Hà Nội - Đà Nẵng",
          createTime: new Date().toISOString(),
          participants: 2,
          lastMessage: {
            content: "Tôi có thể giảm xuống 1.8 triệu/vé",
            time: new Date().toISOString(),
          },
          ticketInfo: {
            route: "Hà Nội → Đà Nẵng",
            date: "15/03/2025",
            initialPrice: 2100000,
            lastOfferPrice: 1800000,
            offerCount: 3,
            status: "pending",
          },
        },
        {
          chatRoomId: "room2345678901",
          nameRoom: "Vé TPHCM - Nha Trang",
          createTime: new Date(Date.now() - 86400000).toISOString(),
          participants: 2,
          lastMessage: {
            content: "Đồng ý với mức giá 1.5 triệu/vé",
            time: new Date(Date.now() - 3600000).toISOString(),
          },
          ticketInfo: {
            route: "TPHCM → Nha Trang",
            date: "20/03/2025",
            initialPrice: 1800000,
            lastOfferPrice: 1500000,
            offerCount: 4,
            status: "accepted",
          },
        },
        {
          chatRoomId: "room3456789012",
          nameRoom: "Vé Đà Lạt - TPHCM",
          createTime: new Date(Date.now() - 172800000).toISOString(),
          participants: 2,
          lastMessage: {
            content: "Chúng tôi không thể giảm thêm được nữa",
            time: new Date(Date.now() - 7200000).toISOString(),
          },
          ticketInfo: {
            route: "Đà Lạt → TPHCM",
            date: "12/03/2025",
            initialPrice: 1500000,
            lastOfferPrice: 1350000,
            offerCount: 5,
            status: "rejected",
          },
        },
        {
          chatRoomId: "room4567890123",
          nameRoom: "Vé Hà Nội - Hải Phòng",
          createTime: new Date(Date.now() - 259200000).toISOString(),
          participants: 2,
          lastMessage: {
            content: "Mời bạn đưa ra mức giá hợp lý",
            time: new Date(Date.now() - 14400000).toISOString(),
          },
          ticketInfo: {
            route: "Hà Nội → Hải Phòng",
            date: "22/03/2025",
            initialPrice: 950000,
            lastOfferPrice: null,
            offerCount: 0,
            status: "new",
          },
        },
      ];

      setChatRooms(mockRooms);
      setUnreadCounts({
        room1234567890: 3,
        room2345678901: 0,
        room3456789012: 0,
        room4567890123: 2,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  // Load messages when a room is selected
  useEffect(() => {
    if (!currentRoom) return;

    const fetchMessages = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const currentRoomData = chatRooms.find(
        (room) => room.chatRoomId === currentRoom,
      );
      const ticketInfo = currentRoomData?.ticketInfo;

      // Mock messages with negotiation history
      const mockMessages = [
        {
          messageId: "msg1",
          messageContent: `Xin chào, tôi quan tâm đến vé từ ${ticketInfo?.route
            .split("→")[0]
            .trim()} đến ${ticketInfo?.route.split("→")[1].trim()} vào ngày ${
            ticketInfo?.date
          }`,
          sendMessageUserId: currentUserId,
          createTime: new Date(Date.now() - 3600000 * 5).toISOString(),
          isRead: true,
        },
        {
          messageId: "msg2",
          messageContent: `Chào bạn, cảm ơn bạn đã liên hệ. Giá vé hiện tại là ${ticketInfo?.initialPrice.toLocaleString(
            "vi-VN",
          )} VNĐ. Bạn có thể thương lượng giá nếu muốn.`,
          sendMessageUserId: "agent1",
          createTime: new Date(Date.now() - 3600000 * 4.8).toISOString(),
          isRead: true,
        },
      ];

      // Add negotiation history based on offerCount
      if (ticketInfo && ticketInfo.offerCount > 0) {
        let startPrice = ticketInfo.initialPrice;
        let endPrice = ticketInfo.lastOfferPrice || startPrice;
        let priceDiff =
          ticketInfo.offerCount > 1
            ? (startPrice - endPrice) / (ticketInfo.offerCount - 1)
            : 0;

        for (let i = 0; i < ticketInfo.offerCount; i++) {
          const offerPrice = startPrice - priceDiff * i;

          mockMessages.push({
            messageId: `msg${3 + i * 2}`,
            messageContent: `Đề xuất giá: ${Math.round(
              offerPrice,
            ).toLocaleString("vi-VN")} VNĐ`,
            sendMessageUserId: i % 2 === 0 ? currentUserId : "agent1",
            createTime: new Date(
              Date.now() - 3600000 * (4 - i * 0.5),
            ).toISOString(),
            isRead: true,
            isNegotiation: true,
          });

          // Add response to each offer
          const responses = [
            "Mức giá này vẫn còn cao. Bạn có thể giảm thêm được không?",
            "Chúng tôi có thể cân nhắc mức giá này, nhưng vẫn muốn thấp hơn một chút.",
            "Tôi nghĩ mức giá này khá hợp lý.",
            "Cảm ơn đề xuất của bạn, tôi sẽ xem xét.",
            "Mức giá này có vẻ phù hợp với ngân sách của tôi.",
          ];

          mockMessages.push({
            messageId: `msg${4 + i * 2}`,
            messageContent: responses[i % responses.length],
            sendMessageUserId: i % 2 === 0 ? "agent1" : currentUserId,
            createTime: new Date(
              Date.now() - 3600000 * (3.9 - i * 0.5),
            ).toISOString(),
            isRead: true,
          });
        }
      }

      // Add final status message if applicable
      if (ticketInfo && ticketInfo.status === "accepted") {
        mockMessages.push({
          messageId: `msgFinal1`,
          messageContent: `Tôi đồng ý với mức giá ${ticketInfo.lastOfferPrice.toLocaleString(
            "vi-VN",
          )} VNĐ cho vé này.`,
          sendMessageUserId: "agent1",
          createTime: new Date(Date.now() - 3600000 * 0.5).toISOString(),
          isRead: true,
          isSystemMessage: true,
          status: "accepted",
        });
      } else if (ticketInfo && ticketInfo.status === "rejected") {
        mockMessages.push({
          messageId: `msgFinal1`,
          messageContent: `Rất tiếc, chúng tôi không thể đạt được thỏa thuận về giá vé.`,
          sendMessageUserId: "agent1",
          createTime: new Date(Date.now() - 3600000 * 0.5).toISOString(),
          isRead: true,
          isSystemMessage: true,
          status: "rejected",
        });
      }

      setMessages(mockMessages);

      // Reset unread count
      setUnreadCounts((prev) => ({
        ...prev,
        [currentRoom]: 0,
      }));

      setLoading(false);
    };

    fetchMessages();
  }, [currentRoom, currentUserId, chatRooms]);

  // Group messages by date and sender
  useEffect(() => {
    if (!messages.length) return;

    const groups = [];
    let currentGroup = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createTime).toLocaleDateString();
      const prevMessage = messages[index - 1];
      const prevMessageDate = prevMessage
        ? new Date(prevMessage.createTime).toLocaleDateString()
        : null;

      // Create a new date group if needed
      if (messageDate !== prevMessageDate) {
        currentGroup = {
          type: "date",
          date: messageDate,
          dateObj: new Date(message.createTime),
          messages: [],
        };
        groups.push(currentGroup);
      }

      // Add message to current group
      if (currentGroup) {
        currentGroup.messages.push(message);
      }
    });

    setMessageGroups(groups);
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messageGroups]);

  // Update document theme when dark mode changes and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Handlers
  const handleRoomChange = useCallback((roomId) => {
    setCurrentRoom(roomId);
    // On mobile, auto-close sidebar when selecting a room
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    // Hide negotiation stats when changing rooms
    setShowNegotiationStats(false);
  }, []);

  const handleRefreshRooms = useCallback(() => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = useCallback(
    (text) => {
      if (!currentRoom) return;

      const newMessage = {
        messageId: `msg${Date.now()}`,
        messageContent: text,
        sendMessageUserId: currentUserId,
        createTime: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [...prev, newMessage]);
    },
    [currentRoom, currentUserId],
  );

  const handleSendNegotiation = useCallback(
    (price) => {
      if (!currentRoom) return;

      const newMessage = {
        messageId: `msg${Date.now()}`,
        messageContent: `Đề xuất giá: ${price.toLocaleString("vi-VN")} VNĐ`,
        sendMessageUserId: currentUserId,
        createTime: new Date().toISOString(),
        isRead: false,
        isNegotiation: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Update room's ticketInfo with the new offer
      setChatRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.chatRoomId === currentRoom) {
            return {
              ...room,
              ticketInfo: {
                ...room.ticketInfo,
                lastOfferPrice: price,
                offerCount: (room.ticketInfo?.offerCount || 0) + 1,
              },
              lastMessage: {
                content: `Đề xuất giá: ${price.toLocaleString("vi-VN")} VNĐ`,
                time: new Date().toISOString(),
              },
            };
          }
          return room;
        }),
      );

      // Auto-response after a delay (simulate agent response)
      setTimeout(() => {
        const currentRoomData = chatRooms.find(
          (room) => room.chatRoomId === currentRoom,
        );
        const initialPrice = currentRoomData?.ticketInfo?.initialPrice || 0;

        let responseMessage;
        if (price < initialPrice * 0.7) {
          responseMessage = {
            messageId: `msg${Date.now() + 1}`,
            messageContent:
              "Mức giá này quá thấp so với giá thị trường. Chúng tôi có thể giảm nhưng không thể xuống mức đó.",
            sendMessageUserId: "agent1",
            createTime: new Date().toISOString(),
            isRead: true,
          };
        } else if (price < initialPrice * 0.85) {
          responseMessage = {
            messageId: `msg${Date.now() + 1}`,
            messageContent:
              "Mức giá này có thể chấp nhận được. Để tôi xác nhận với bên cung cấp và sẽ thông báo lại cho bạn sớm.",
            sendMessageUserId: "agent1",
            createTime: new Date().toISOString(),
            isRead: true,
          };
        } else {
          responseMessage = {
            messageId: `msg${Date.now() + 1}`,
            messageContent:
              "Cảm ơn đề xuất của bạn. Chúng tôi có thể chấp nhận mức giá này.",
            sendMessageUserId: "agent1",
            createTime: new Date().toISOString(),
            isRead: true,
          };
        }

        setMessages((prev) => [...prev, responseMessage]);
      }, 2000);
    },
    [currentRoom, currentUserId, chatRooms],
  );

  const handleAcceptOffer = useCallback(() => {
    const currentRoomData = chatRooms.find(
      (room) => room.chatRoomId === currentRoom,
    );
    const offerPrice = currentRoomData?.ticketInfo?.lastOfferPrice;

    if (!offerPrice) return;

    const acceptMessage = {
      messageId: `msg${Date.now()}`,
      messageContent: `Tôi đồng ý với mức giá ${offerPrice.toLocaleString(
        "vi-VN",
      )} VNĐ cho vé này.`,
      sendMessageUserId: currentUserId,
      createTime: new Date().toISOString(),
      isRead: false,
      isSystemMessage: true,
      status: "accepted",
    };

    setMessages((prev) => [...prev, acceptMessage]);

    // Update room status
    setChatRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.chatRoomId === currentRoom) {
          return {
            ...room,
            ticketInfo: {
              ...room.ticketInfo,
              status: "accepted",
            },
            lastMessage: {
              content: `Đồng ý với mức giá ${offerPrice.toLocaleString(
                "vi-VN",
              )} VNĐ`,
              time: new Date().toISOString(),
            },
          };
        }
        return room;
      }),
    );

    // Auto response after accepting
    setTimeout(() => {
      const confirmMessage = {
        messageId: `msg${Date.now() + 1}`,
        messageContent:
          "Cảm ơn bạn đã đặt vé! Chúng tôi sẽ gửi thông tin thanh toán qua email của bạn trong vòng 15 phút tới.",
        sendMessageUserId: "agent1",
        createTime: new Date().toISOString(),
        isRead: true,
      };

      setMessages((prev) => [...prev, confirmMessage]);
    }, 1500);
  }, [currentRoom, currentUserId, chatRooms]);

  const handleRejectOffer = useCallback(() => {
    const currentRoomData = chatRooms.find(
      (room) => room.chatRoomId === currentRoom,
    );
    const offerPrice = currentRoomData?.ticketInfo?.lastOfferPrice;

    if (!offerPrice) return;

    const rejectMessage = {
      messageId: `msg${Date.now()}`,
      messageContent: `Tôi không thể chấp nhận mức giá ${offerPrice.toLocaleString(
        "vi-VN",
      )} VNĐ. Cần thương lượng thêm.`,
      sendMessageUserId: currentUserId,
      createTime: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, rejectMessage]);
  }, [currentRoom, currentUserId, chatRooms]);

  const toggleNegotiationStats = useCallback(() => {
    setShowNegotiationStats((prev) => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const filterRooms = useMemo(() => {
    if (!searchQuery.trim()) return chatRooms;

    return chatRooms.filter((room) => {
      const roomName = room.nameRoom || `Room #${room.chatRoomId.slice(0, 8)}`;
      return (
        roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.ticketInfo?.route &&
          room.ticketInfo.route
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    });
  }, [chatRooms, searchQuery]);

  const currentRoomData = useMemo(() => {
    return chatRooms.find((room) => room.chatRoomId === currentRoom);
  }, [chatRooms, currentRoom]);

  return (
    <div
      className={`h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-orange-500 mr-2" />
                <h1 className="text-xl font-bold text-orange-500 dark:text-orange-400">
                  TicketChat
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUserId
                    ? currentUserId.slice(0, 2).toUpperCase()
                    : "?"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transform transition-transform duration-300 fixed md:relative z-30 md:z-auto top-0 bottom-0 left-0 w-72 md:w-80 md:min-w-[320px] md:max-w-[320px] h-full pt-14 md:pt-0`}
        >
          <ChatSidebar
            userId={currentUserId}
            currentRoom={currentRoom}
            onRoomChange={handleRoomChange}
            chatRooms={filterRooms}
            unreadCounts={unreadCounts}
            isLoading={loading}
            onRefresh={handleRefreshRooms}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {currentRoom ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={toggleSidebar}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                          <Tag size={18} />
                        </div>

                        <div>
                          <h2 className="font-medium text-gray-900 dark:text-gray-100">
                            {currentRoomData?.nameRoom ||
                              `Room #${currentRoom.slice(0, 8)}`}
                          </h2>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              {currentRoomData?.ticketInfo?.route}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">
                              •
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {currentRoomData?.ticketInfo?.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={toggleNegotiationStats}
                        className={`p-2 rounded-lg text-gray-500 hover:text-gray-700 
                                  dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 
                                  dark:hover:bg-gray-700 transition-colors
                                  ${
                                    showNegotiationStats
                                      ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                                      : ""
                                  }`}
                        aria-label="Price history"
                      >
                        <PieChart size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="More options"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Ticket status bar */}
                  {currentRoomData?.ticketInfo && (
                    <div
                      className={`px-4 py-2 text-sm flex flex-wrap items-center justify-between gap-2
                                   ${
                                     currentRoomData.ticketInfo.status ===
                                     "accepted"
                                       ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-b border-green-200 dark:border-green-800/50"
                                       : currentRoomData.ticketInfo.status ===
                                         "rejected"
                                       ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-b border-red-200 dark:border-red-800/50"
                                       : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-b border-orange-200 dark:border-orange-800/50"
                                   }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">
                            Giá khởi điểm:
                          </span>
                          <span>
                            {currentRoomData.ticketInfo.initialPrice.toLocaleString(
                              "vi-VN",
                            )}{" "}
                            VNĐ
                          </span>
                        </div>

                        {currentRoomData.ticketInfo.lastOfferPrice && (
                          <>
                            <span className="text-gray-400 dark:text-gray-500">
                              →
                            </span>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">
                                Đề xuất hiện tại:
                              </span>
                              <span className="font-bold">
                                {currentRoomData.ticketInfo.lastOfferPrice.toLocaleString(
                                  "vi-VN",
                                )}{" "}
                                VNĐ
                              </span>
                              {currentRoomData.ticketInfo.initialPrice >
                                currentRoomData.ticketInfo.lastOfferPrice && (
                                <span className="ml-1 text-green-600 dark:text-green-400 text-xs font-medium">
                                  (-
                                  {Math.round(
                                    ((currentRoomData.ticketInfo.initialPrice -
                                      currentRoomData.ticketInfo
                                        .lastOfferPrice) /
                                      currentRoomData.ticketInfo.initialPrice) *
                                      100,
                                  )}
                                  %)
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-1 px-3 py-1 rounded-full 
                                     font-medium text-xs whitespace-nowrap
                                     ${
                                       currentRoomData.ticketInfo.status === 'accepted'
                                         ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                         : currentRoomData.ticketInfo.status === 'rejected'
                                         ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                                         : currentRoomData.ticketInfo.status === 'pending'
                                         ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                         : 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                                     }"
                      >
                        {currentRoomData.ticketInfo.status === "accepted" && (
                          <>
                            <ThumbsUp size={12} />
                            <span>Đã chấp nhận</span>
                          </>
                        )}
                        {currentRoomData.ticketInfo.status === "rejected" && (
                          <>
                            <ThumbsDown size={12} />
                            <span>Đã từ chối</span>
                          </>
                        )}
                        {currentRoomData.ticketInfo.status === "pending" && (
                          <>
                            <Clock size={12} />
                            <span>Đang thương lượng</span>
                          </>
                        )}
                        {currentRoomData.ticketInfo.status === "new" && (
                          <>
                            <Tag size={12} />
                            <span>Vé mới</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Negotiation Stats Panel */}
              {showNegotiationStats && currentRoomData?.ticketInfo && (
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
                  <div className="flex flex-col space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <ArrowUpDown size={16} className="mr-2 text-orange-500" />
                      Thống kê thương lượng
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Giảm giá hiện tại
                          </span>
                          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            {currentRoomData.ticketInfo.lastOfferPrice
                              ? Math.round(
                                  ((currentRoomData.ticketInfo.initialPrice -
                                    currentRoomData.ticketInfo.lastOfferPrice) /
                                    currentRoomData.ticketInfo.initialPrice) *
                                    100,
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Số lần thương lượng
                          </span>
                          <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                            {currentRoomData.ticketInfo.offerCount || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Giá khởi điểm
                          </span>
                          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {currentRoomData.ticketInfo.initialPrice.toLocaleString(
                              "vi-VN",
                            )}{" "}
                            VNĐ
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Giá đề xuất hiện tại
                          </span>
                          <span className="text-lg font-medium text-green-600 dark:text-green-400">
                            {currentRoomData.ticketInfo.lastOfferPrice
                              ? currentRoomData.ticketInfo.lastOfferPrice.toLocaleString(
                                  "vi-VN",
                                )
                              : "—"}{" "}
                            VNĐ
                          </span>
                        </div>
                      </div>

                      {/* Price negotiation history visualization */}
                      {currentRoomData.ticketInfo.offerCount > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Lịch sử thương lượng giá
                          </p>

                          <div className="relative pt-5">
                            {/* Price markers */}
                            <div className="absolute top-0 left-0 w-full flex justify-between px-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 transform -translate-x-1/2">
                                {currentRoomData.ticketInfo.initialPrice.toLocaleString(
                                  "vi-VN",
                                )}
                              </span>
                              {currentRoomData.ticketInfo.lastOfferPrice && (
                                <span className="text-xs text-green-500 dark:text-green-400 transform translate-x-1/2">
                                  {currentRoomData.ticketInfo.lastOfferPrice.toLocaleString(
                                    "vi-VN",
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Progress bar */}
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                              {/* Progress indicator */}
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                                style={{
                                  width: currentRoomData.ticketInfo
                                    .lastOfferPrice
                                    ? `${
                                        100 -
                                        (currentRoomData.ticketInfo
                                          .lastOfferPrice /
                                          currentRoomData.ticketInfo
                                            .initialPrice) *
                                          100
                                      }%`
                                    : "0%",
                                }}
                              />
                            </div>

                            {/* Negotiation steps */}
                            <div className="mt-2 flex">
                              {Array.from({
                                length: currentRoomData.ticketInfo.offerCount,
                              }).map((_, index) => {
                                const isLast =
                                  index ===
                                  currentRoomData.ticketInfo.offerCount - 1;

                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-center flex-1"
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        isLast
                                          ? "bg-green-500 dark:bg-green-400"
                                          : "bg-orange-400 dark:bg-orange-600"
                                      }`}
                                    />
                                    {index <
                                      currentRoomData.ticketInfo.offerCount -
                                        1 && (
                                      <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggestions based on negotiation status */}
                    {currentRoomData.ticketInfo.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleAcceptOffer}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex-1 flex items-center justify-center gap-1 transition-colors"
                        >
                          <ThumbsUp size={16} />
                          <span>Chấp nhận giá</span>
                        </button>
                        <button
                          onClick={handleRejectOffer}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg flex-1 flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Tiếp tục thương lượng</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <ChatMessages
                messages={messages}
                messageGroups={messageGroups}
                currentUserId={currentUserId}
                messagesEndRef={messagesEndRef}
                isLoading={loading}
              />

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendNegotiation={handleSendNegotiation}
                disabled={
                  !currentRoom ||
                  currentRoomData?.ticketInfo?.status === "accepted"
                }
                inputFocused={inputFocused}
                setInputFocused={setInputFocused}
                negotiationDisabled={
                  currentRoomData?.ticketInfo?.status === "accepted" ||
                  currentRoomData?.ticketInfo?.status === "rejected"
                }
                roomData={currentRoomData}
              />
            </>
          ) : (
            // Empty state when no room is selected
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                  <Tag size={32} className="text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Chọn một cuộc hội thoại
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Chọn một vé từ danh sách bên trái để bắt đầu thương lượng giá.
                </p>
                <button
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors md:hidden"
                  onClick={toggleSidebar}
                >
                  Xem danh sách vé
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ChatSidebar Component
const ChatSidebar = ({
  userId,
  currentRoom,
  onRoomChange,
  chatRooms = [],
  unreadCounts = {},
  isLoading = false,
  onRefresh,
  searchQuery,
  setSearchQuery,
}) => {
  const formatRoomName = (room) => {
    if (!room.nameRoom || room.nameRoom === "string") {
      return `Room #${room.chatRoomId.slice(0, 8)}`;
    }
    return room.nameRoom;
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return dateString;
    }
  };

  // Status badges for ticket items
  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs">
            Đã chấp nhận
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs">
            Đã từ chối
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full text-xs">
            Đang thương lượng
          </span>
        );
      case "new":
        return (
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs">
            Mới
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
          </div>
        </div>

        <div className="p-4 animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm vé..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Available Rooms */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Tag size={14} />
              <span>DANH SÁCH VÉ</span>
            </div>
            <button
              onClick={onRefresh}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Refresh rooms"
            >
              <RefreshCw size={14} className="text-gray-500" />
            </button>
          </div>

          {chatRooms.length > 0 ? (
            <div className="space-y-2">
              {chatRooms.map((room) => (
                <button
                  key={room.chatRoomId}
                  onClick={() => onRoomChange(room.chatRoomId)}
                  className={`w-full rounded-xl text-left transition-all
                  hover:bg-gray-100 dark:hover:bg-gray-700/50 group
                  ${
                    currentRoom === room.chatRoomId
                      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50"
                      : "bg-white dark:bg-gray-800 border-transparent"
                  } border p-3`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center
                                       ${
                                         currentRoom === room.chatRoomId
                                           ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                           : room.ticketInfo?.status ===
                                             "accepted"
                                           ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                                           : room.ticketInfo?.status ===
                                             "rejected"
                                           ? "bg-gradient-to-br from-red-400 to-red-600 text-white"
                                           : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                       }`}
                        >
                          <Tag
                            size={20}
                            className={
                              currentRoom === room.chatRoomId
                                ? "text-white"
                                : ""
                            }
                          />
                        </div>
                        {unreadCounts[room.chatRoomId] > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                            {unreadCounts[room.chatRoomId]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <h3
                          className={`font-medium truncate ${
                            currentRoom === room.chatRoomId
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {formatRoomName(room)}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {formatDate(room.createTime)}
                        </span>
                      </div>

                      {/* Route info */}
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                        {room.ticketInfo?.route}
                        <span className="mx-1">•</span>
                        {room.ticketInfo?.date}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {room.ticketInfo &&
                            getStatusBadge(room.ticketInfo.status)}
                          {room.ticketInfo?.lastOfferPrice && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {room.ticketInfo.lastOfferPrice.toLocaleString(
                                "vi-VN",
                              )}{" "}
                              đ
                            </span>
                          )}
                        </div>

                        <ChevronRight
                          size={16}
                          className={`flex-shrink-0 ${
                            currentRoom === room.chatRoomId
                              ? "text-orange-500"
                              : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <Tag size={48} className="mb-2 opacity-50" />
              <p className="text-sm">Không có vé nào</p>
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
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {userId || "Chưa đăng nhập"}
            </p>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trực tuyến
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ChatMessages Component
const ChatMessages = ({
  messages = [],
  messageGroups = [],
  currentUserId,
  messagesEndRef,
  isLoading,
}) => {
  const formatMessageTime = (timestamp) => {
    try {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  const formatDateHeader = (dateObj) => {
    try {
      if (!dateObj) return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const messageDate = new Date(dateObj);
      messageDate.setHours(0, 0, 0, 0);

      if (messageDate.getTime() === today.getTime()) {
        return "Hôm nay";
      } else if (messageDate.getTime() === yesterday.getTime()) {
        return "Hôm qua";
      } else {
        return dateObj.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch {
      return dateObj ? dateObj.toLocaleDateString() : "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Bắt đầu thương lượng giá!
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Chưa có tin nhắn trong cuộc hội thoại này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
      {messageGroups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="space-y-4">
          {/* Date header */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {formatDateHeader(group.dateObj)}
              </span>
            </div>
          </div>

          {/* Messages in this group */}
          {group.messages.map((message, messageIndex) => {
            // Check if this message is part of a consecutive group from the same sender
            const isCurrentUser = message.sendMessageUserId === currentUserId;
            const prevMessage = group.messages[messageIndex - 1];
            const nextMessage = group.messages[messageIndex + 1];

            const isPartOfGroup =
              prevMessage &&
              prevMessage.sendMessageUserId === message.sendMessageUserId;
            const isLastInGroup =
              !nextMessage ||
              nextMessage.sendMessageUserId !== message.sendMessageUserId;

            // Only show avatar for first message in a group from the same sender
            const showAvatar = !isCurrentUser && !isPartOfGroup;

            return (
              <div
                key={message.messageId}
                className={`flex items-end gap-2 ${
                  isCurrentUser ? "flex-row-reverse" : ""
                } ${isPartOfGroup ? "mt-1" : "mt-4"}`}
              >
                {!isCurrentUser && (
                  <div
                    className={`flex-shrink-0 ${showAvatar ? "" : "invisible"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                              flex items-center justify-center text-white font-medium text-sm"
                    >
                      {message.sendMessageUserId === "agent1"
                        ? "NV"
                        : message.sendMessageUserId
                            ?.slice(0, 2)
                            .toUpperCase() || "U"}
                    </div>
                  </div>
                )}

                <div
                  className={`group max-w-[75%] ${
                    !isCurrentUser && !showAvatar ? "ml-10" : ""
                  }`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="ml-1 mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {message.sendMessageUserId === "agent1"
                          ? "Nhân viên"
                          : message.sendMessageUserId}
                      </span>
                    </div>
                  )}

                  <div
                    className={`
                      relative rounded-2xl px-4 py-2.5 
                      ${
                        isPartOfGroup && !isLastInGroup
                          ? isCurrentUser
                            ? "rounded-tr-sm"
                            : "rounded-tl-sm"
                          : ""
                      }
                      ${
                        message.isSystemMessage && message.status === "accepted"
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                          : message.isSystemMessage &&
                            message.status === "rejected"
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          : isCurrentUser
                          ? message.isNegotiation
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                          : message.isNegotiation
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
                      }
                    `}
                  >
                    {message.isNegotiation && (
                      <div className="flex items-center mb-1 text-green-100">
                        <DollarSign className="w-4 h-4 mr-1 opacity-75" />
                        <span className="text-xs font-medium">Đề xuất giá</span>
                      </div>
                    )}

                    {message.isSystemMessage &&
                      message.status === "accepted" && (
                        <div className="flex items-center mb-1 text-green-100">
                          <ThumbsUp className="w-4 h-4 mr-1 opacity-75" />
                          <span className="text-xs font-medium">
                            Chấp nhận giá
                          </span>
                        </div>
                      )}

                    {message.isSystemMessage &&
                      message.status === "rejected" && (
                        <div className="flex items-center mb-1 text-red-100">
                          <ThumbsDown className="w-4 h-4 mr-1 opacity-75" />
                          <span className="text-xs font-medium">
                            Từ chối giá
                          </span>
                        </div>
                      )}

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
                      {isCurrentUser &&
                        (message.isRead ? (
                          <CheckCheck className="w-3.5 h-3.5 opacity-75" />
                        ) : (
                          <Check className="w-3.5 h-3.5 opacity-75" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// MessageInput Component
const MessageInput = ({
  onSendMessage,
  onSendNegotiation,
  disabled = false,
  inputFocused,
  setInputFocused,
  negotiationDisabled = false,
  roomData,
}) => {
  const [message, setMessage] = useState("");
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [price, setPrice] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  // Calculate suggested prices based on room data
  const suggestedPrices = useMemo(() => {
    if (!roomData?.ticketInfo) return [];

    const initialPrice = roomData.ticketInfo.initialPrice;
    const lastPrice = roomData.ticketInfo.lastOfferPrice || initialPrice;

    // Generate smart suggestions based on negotiation context
    if (roomData.ticketInfo.offerCount === 0) {
      // First offer - suggest modest discounts
      return [
        Math.round(initialPrice * 0.95), // 5% less than initial price
        Math.round(initialPrice * 0.9), // 10% less than initial price
        Math.round(initialPrice * 0.85), // 15% less than initial price
      ];
    } else if (roomData.ticketInfo.offerCount >= 3) {
      // Later stages - offer smaller increments
      return [
        Math.round(lastPrice * 0.98), // 2% less than last price
        Math.round(lastPrice * 0.95), // 5% less than last price
        Math.round(lastPrice * 0.93), // 7% less than last price
      ];
    } else {
      // Middle stages - standard discounts
      return [
        Math.round(lastPrice * 0.95), // 5% less than last price
        Math.round(lastPrice * 0.92), // 8% less than last price
        Math.round(lastPrice * 0.9), // 10% less than last price
      ];
    }
  }, [roomData]);

  // List of quick responses
  const quickResponses = [
    "Xin chào, tôi muốn thương lượng giá vé.",
    "Mức giá này vẫn còn cao.",
    "Có thể giảm thêm được không?",
    "Cảm ơn đề xuất của bạn.",
    "Tôi sẽ cân nhắc mức giá này.",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (disabled) return;

    if (isNegotiating) {
      if (!price.trim()) return;
      const numericPrice = Number(price.replace(/[^0-9]/g, ""));
      if (numericPrice > 0) {
        onSendNegotiation(numericPrice);
        setPrice("");
        setIsNegotiating(false);
      }
    } else {
      if (!message.trim()) return;
      onSendMessage(message.trim());
      setMessage("");
    }

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleSuggestedPrice = (price) => {
    setIsNegotiating(true);
    setPrice(price.toString());
  };

  const toggleNegotiation = () => {
    setIsNegotiating((prev) => !prev);
    setPrice("");
    setShowEmojiPicker(false);

    // Focus on input after toggling
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleQuickResponse = (response) => {
    setMessage(response);
    // Focus and move cursor to end
    setTimeout(() => {
      inputRef.current?.focus();
      const length = response.length;
      if (inputRef.current) {
        inputRef.current.setSelectionRange(length, length);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`border-t dark:border-gray-700 bg-white dark:bg-gray-800 transition-all 
                    ${inputFocused ? "py-4 pb-6" : "py-4"}`}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Suggested prices or quick responses */}
        {inputFocused &&
          !isNegotiating &&
          !negotiationDisabled &&
          suggestedPrices.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Đề xuất giá:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrices.map((price, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrice(price)}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 
                       dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400
                       rounded-full text-sm transition-colors whitespace-nowrap flex items-center"
                  >
                    <DollarSign size={12} className="mr-1" />
                    <span>{price.toLocaleString("vi-VN")} đ</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Quick responses */}
        {inputFocused && !isNegotiating && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Trả lời nhanh:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickResponse(response)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                       dark:hover:bg-gray-600 rounded-full text-sm text-gray-700 
                       dark:text-gray-300 transition-colors whitespace-nowrap"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accepted notice */}
        {roomData?.ticketInfo?.status === "accepted" && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
            <div className="flex items-center text-green-800 dark:text-green-400">
              <ThumbsUp size={16} className="mr-2" />
              <p className="text-sm font-medium">
                Đã chấp nhận giá{" "}
                {roomData.ticketInfo.lastOfferPrice?.toLocaleString("vi-VN")}{" "}
                VNĐ. Cảm ơn bạn đã đặt vé!
              </p>
            </div>
          </div>
        )}

        {/* Rejected notice */}
        {roomData?.ticketInfo?.status === "rejected" && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
            <div className="flex items-center text-red-800 dark:text-red-400">
              <ThumbsDown size={16} className="mr-2" />
              <p className="text-sm font-medium">
                Thương lượng giá không thành công. Vui lòng liên hệ hỗ trợ nếu
                cần thiết.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`${
              isNegotiating
                ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50"
                : "bg-gray-100 dark:bg-gray-700 border-transparent"
            } 
            rounded-xl border p-1 transition-colors shadow-sm`}
          >
            <div className="flex items-center">
              {/* Left buttons */}
              <div className="flex px-2">
                <button
                  type="button"
                  onClick={toggleNegotiation}
                  disabled={disabled || negotiationDisabled}
                  className={`p-2 rounded-lg transition-colors
                         ${
                           isNegotiating
                             ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/30"
                             : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                         }
                         disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={isNegotiating ? "Hủy đề xuất giá" : "Đề xuất giá"}
                >
                  <DollarSign className="w-5 h-5" />
                </button>

                {!isNegotiating && (
                  <button
                    type="button"
                    disabled={disabled}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-200 
                             dark:hover:bg-gray-600 transition-colors disabled:opacity-50 
                             disabled:cursor-not-allowed"
                    aria-label="Đính kèm tập tin"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Input field */}
              <div className="flex-1">
                {isNegotiating ? (
                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={price}
                        onChange={handlePriceChange}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        className="w-full px-3 py-2 bg-transparent text-blue-600 dark:text-blue-400 
                                 border-b border-blue-200 dark:border-blue-800
                                 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Nhập giá đề xuất..."
                        disabled={disabled}
                        autoFocus
                      />
                      <div className="ml-2 whitespace-nowrap">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          VNĐ
                        </span>
                      </div>
                    </div>

                    {/* Price slider */}
                    {roomData?.ticketInfo && (
                      <div className="px-1">
                        <input
                          type="range"
                          min={Math.round(
                            roomData.ticketInfo.initialPrice * 0.7,
                          )}
                          max={roomData.ticketInfo.initialPrice}
                          value={price || roomData.ticketInfo.initialPrice}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-blue-900/30"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                          <span>-30%</span>
                          <span>-15%</span>
                          <span>Giá gốc</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400 resize-none
                             focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                             max-h-32 overflow-y-auto"
                    placeholder={
                      disabled
                        ? roomData?.ticketInfo?.status === "accepted"
                          ? "Đã hoàn tất thương lượng giá"
                          : "Chọn một vé để bắt đầu trò chuyện"
                        : "Nhập tin nhắn của bạn..."
                    }
                    disabled={disabled}
                    rows={1}
                    style={{ minHeight: "42px" }}
                  />
                )}
              </div>

              {/* Right buttons */}
              <div className="flex pr-1">
                {!isNegotiating && (
                  <button
                    type="button"
                    disabled={disabled}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-200 
                             dark:hover:bg-gray-600 transition-colors disabled:opacity-50 
                             disabled:cursor-not-allowed"
                    aria-label="Thêm biểu tượng cảm xúc"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={
                    disabled || (isNegotiating ? !price : !message.trim())
                  }
                  className="p-2 ml-1 rounded-lg bg-orange-500 text-white
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-orange-600 transition-colors"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {inputFocused && !isNegotiating && (
            <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Nhấn{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-xs">
                Enter
              </kbd>{" "}
              để gửi,
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-xs ml-1">
                Shift + Enter
              </kbd>{" "}
              để xuống dòng
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatPage;

// Add this CSS to your stylesheet
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes slideInUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slideInUp {
  animation: slideInUp 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.animate-pulse-gentle {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.price-slider {
  -webkit-appearance: none;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(to right, #3b82f6, #93c5fd);
  outline: none;
}

.price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.price-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark .price-slider {
  background: linear-gradient(to right, #1d4ed8, #2563eb);
}

.dark .price-slider::-webkit-slider-thumb {
  background: #1f2937;
  border: 2px solid #3b82f6;
}

.dark .price-slider::-moz-range-thumb {
  background: #1f2937;
  border: 2px solid #3b82f6;
}

.message-bubble-in {
  animation: slideFromLeft 0.3s ease-out;
}

.message-bubble-out {
  animation: slideFromRight 0.3s ease-out;
}

@keyframes slideFromLeft {
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideFromRight {
  from { transform: translateX(10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
*/
