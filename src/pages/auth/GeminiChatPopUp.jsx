import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChatAlt2, HiX, HiPaperAirplane } from "react-icons/hi";
import { GoogleGenerativeAI } from "@google/generative-ai";

// !!! CẢNH BÁO BẢO MẬT NGHIÊM TRỌNG !!!
// KHÔNG BAO GIỜ ĐỂ API KEY Ở ĐÂY TRONG MÔI TRƯỜNG PRODUCTION HOẶC CODE CÔNG KHAI
// API KEY NÀY SẼ BỊ LỘ RA NGOÀI! CHỈ DÙNG ĐỂ TEST CÁ NHÂN.
// HÃY THU HỒI KEY NÀY SAU KHI TEST XONG.
const API_KEY = "AIzaSyAUPeRkCl3VNxW14iB-ZJdPlNoIIbmqz98"; // <-- API Key CỰC KỲ NGUY HIỂM KHI ĐỂ Ở ĐÂY

const websiteStructureInfo = `
Cấu trúc các trang (routes) trên website TicketHub:

**I. Trang Công Khai (Ai cũng truy cập được):**
*   Trang chủ (/)
*   Đăng nhập (/login)
*   Đăng ký (/signup)
*   Giới thiệu (/about)
*   Xác thực Email (/verify-email)
*   Quên mật khẩu (/forgot-password)
*   Đặt lại mật khẩu (/reset-password)
*   Chat (/chat)
*   Danh sách Vé/Sự kiện chung (/tickets)
*   Danh sách Sự kiện (/events)
*   Chi tiết Sự kiện (/events/:eventId)

**II. Trang Riêng Tư (Cần đăng nhập với vai trò MEMBER hoặc ORGANIZATION):**
*   Chi tiết Vé (/tickets/:ticketId)
*   Tạo Vé (/create-ticket)
*   Hồ sơ cá nhân (/profile)
*   Giỏ hàng (/cart)
*   Vé của tôi (/my-tickets)
*   Thanh toán (/checkout)
*   Xác nhận đơn hàng (/order-confirmation/:orderId)
*   Tạo Sự kiện (/create-event)
*   Sự kiện của tôi (/my-events)
*   Chỉnh sửa Sự kiện (/events/edit/:eventId)

**III. Trang Dành Cho Nhân Viên (Cần đăng nhập với vai trò STAFF):**
*   Truy cập qua đường dẫn /staff
*   Quản lý Vé (/staff/tickets)
*   Thống kê (/staff/static)
*   Quản lý Danh mục (/staff/category)

**IV. Trang Lỗi:**
*   Không tìm thấy trang (/*)
`;
// --- Kết thúc thông tin cấu trúc ---

const GeminiChatPopup = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    try {
      if (!API_KEY) {
        setError(
          "API Key không được cung cấp. Đây là rủi ro bảo mật nghiêm trọng.",
        );
        return;
      }
      console.warn(
        "!!! CẢNH BÁO: API Key đang được sử dụng trực tiếp trong Frontend. RỦI RO BẢO MẬT CAO !!!",
      );
      const genAI = new GoogleGenerativeAI(API_KEY);
      modelRef.current = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });
      setMessages([
        {
          sender: "ai",
          text: "Chào bạn! Bạn muốn hỏi gì về các trang trên TicketHub?",
        },
      ]);
    } catch (err) {
      console.error("Lỗi khởi tạo Gemini:", err);
      setError(
        "Không thể khởi tạo trợ lý AI. Kiểm tra API Key và kết nối mạng.",
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userQuery = input.trim();
    if (!userQuery || isLoading || !modelRef.current) return;

    setError(null);
    const newMessages = [...messages, { sender: "user", text: userQuery }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // *** THAY ĐỔI CHÍNH: Tạo prompt với context trực tiếp ở đây ***
      const prompt = `
        Bạn là trợ lý ảo của trang web TicketHub.
        Nhiệm vụ của bạn CHỈ là trả lời các câu hỏi liên quan đến cấu trúc và các trang có thể truy cập trên website, dựa vào thông tin dưới đây. KHÔNG trả lời các câu hỏi về chủ đề khác.

        Thông tin cấu trúc trang web:
        ${websiteStructureInfo}
        ---
        Dựa CHỈ vào thông tin cấu trúc ở trên, hãy trả lời câu hỏi sau của người dùng một cách rõ ràng:
        Người dùng hỏi: ${userQuery}
      `;

      // Gọi API Gemini trực tiếp từ Frontend (NGUY HIỂM)
      const result = await modelRef.current.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (err) {
      console.error("Lỗi gọi Gemini API:", err);
      let errorMsg = "Xin lỗi, tôi không thể trả lời ngay bây giờ.";
      if (err.message.includes("API key not valid")) {
        errorMsg = "Lỗi: API Key không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (err.message.includes("fetch")) {
        errorMsg = "Lỗi kết nối mạng hoặc API bị chặn. Kiểm tra console log.";
      }
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Đã có lỗi xảy ra khi xử lý yêu cầu." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePopup = () => setIsOpen(!isOpen);

  // ... (Phần JSX cho giao diện popup không thay đổi so với ví dụ trước) ...
  // ... (Đảm bảo phần JSX hiển thị lỗi `error` nếu có) ...

  const popupVariants = {
    /* ... không đổi ... */
  };
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const buttonColor = isDarkMode
    ? "text-orange-400 hover:text-orange-300"
    : "text-orange-500 hover:text-orange-600";

  return (
    <>
      {/* Nút mở Popup */}
      <button
        onClick={togglePopup}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-colors duration-300 ${
          isDarkMode
            ? "bg-orange-500 hover:bg-orange-600 text-white"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
        aria-label="Mở Trợ lý Đăng nhập"
      >
        <HiOutlineChatAlt2 className="w-6 h-6" />
      </button>

      {/* Nội dung Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-24 right-6 w-80 h-96 shadow-xl rounded-lg z-50 flex flex-col overflow-hidden border ${borderColor} ${bgColor} ${textColor}`}
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center p-3 border-b ${borderColor} ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold text-sm">Trợ lý Trang Web</h3>
              <button
                onClick={togglePopup}
                className={`p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                }`}
                aria-label="Đóng"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-grow p-3 overflow-y-auto space-y-3 text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg ${
                      msg.sender === "user"
                        ? isDarkMode
                          ? "bg-orange-600 text-white"
                          : "bg-orange-500 text-white"
                        : isDarkMode
                        ? "bg-gray-600"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className={`p-2 rounded-lg ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-0"></span>
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-red-500 text-xs px-1">{error}</div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className={`p-2 border-t ${borderColor} flex items-center space-x-2 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về các trang..."
                disabled={isLoading || !!error}
                className={`flex-grow px-3 py-1.5 rounded-md text-sm border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50`}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !!error}
                className={`p-2 rounded-md ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Gửi"
              >
                <HiPaperAirplane className="w-5 h-5 transform rotate-45" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeminiChatPopup;
