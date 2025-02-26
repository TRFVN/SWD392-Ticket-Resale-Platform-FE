import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import {
  CreditCard,
  Loader2,
  ArrowLeft,
  Package,
  Clock,
  AlertCircle,
  Calendar,
  User,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component to display loading state
const LoadingState = ({ message = "Loading..." }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        {message}
      </p>
    </div>
  );
};

// Component to display error state
const ErrorState = ({ error, onRetry }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p
        className={`text-red-500 text-center mb-4 ${
          isDarkMode ? "bg-red-500/10" : "bg-red-50"
        } p-4 rounded-lg max-w-md`}
      >
        {error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

// Component to display ticket details
const TicketItem = ({ ticket }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-4 ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur rounded-xl border transition-colors`}
    >
      {/* Image */}
      <div className="relative w-full sm:w-24 h-24 overflow-hidden rounded-lg flex-shrink-0">
        <img
          src={ticket.ticketImage || "/api/placeholder/96/96"}
          alt={ticket.ticketName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div>
          <h3
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {ticket.ticketName || "Ticket"}
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {ticket.eventName || "Event"}
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              {ticket.eventDate || "Event date"}
            </span>
          </div>

          <div className="text-orange-500 font-bold">
            {formatCurrency(ticket.ticketPrice || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for order summary
const OrderSummary = ({ order, onConfirmOrder, isProcessing }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur rounded-xl border p-6 space-y-6 transition-colors sticky top-4`}
    >
      <h2
        className={`text-xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Order Summary
      </h2>

      <div className="space-y-4">
        <div
          className={`flex justify-between ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <span>Order #{order.orderNumber || "New"}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>

        <div
          className={`flex justify-between ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <span>Subtotal</span>
          <span>{formatCurrency(order.totalPrice || 0.0)}</span>
        </div>

        <div
          className={`flex justify-between ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <span>Service Fee</span>
          <span>{formatCurrency(0)}</span>
        </div>

        <div className={`h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />

        <div
          className={`flex justify-between text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <span>Total</span>
          <span>{formatCurrency(order.totalPrice || 0)}</span>
        </div>
      </div>

      <button
        onClick={onConfirmOrder}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 
          disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg 
          transition-colors font-medium"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Proceed to Payment
          </>
        )}
      </button>
    </div>
  );
};

// Payment information form - simplified
const PaymentInfoForm = ({
  order,
  isGeneratingQR,
  payosCheckoutUrl,
  paymentTransactionId,
  generatePayOSLink,
}) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur rounded-xl border p-6 mb-6 transition-colors`}
    >
      <h2
        className={`text-xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange-500" />
          Phương thức thanh toán
        </div>
      </h2>

      {/* Payment Info */}
      <div className="flex flex-col">
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          } mb-6`}
        >
          <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Đơn hàng này sẽ được thanh toán qua PayOS - hệ thống thanh toán trực
            tuyến an toàn. Khi bạn ấn <strong>Proceed to Payment</strong>, hệ
            thống sẽ tạo liên kết thanh toán.
          </p>
        </div>

        {/* Show loading state */}
        {isGeneratingQR && (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              Đang tạo liên kết thanh toán...
            </p>
          </div>
        )}

        {payosCheckoutUrl && (
          <div className="flex flex-col items-center">
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-white" : "bg-white"
              } mb-4 border`}
            >
              <img
                src="/api/placeholder/220/220"
                alt="PayOS Payment QR"
                className="w-56 h-56"
              />
            </div>
            <div className="text-center mb-6">
              <p
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                PayOS - Thanh toán trực tuyến
              </p>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Thanh toán an toàn qua cổng PayOS
              </p>
              {paymentTransactionId && (
                <p
                  className={`mt-2 text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Transaction ID: {paymentTransactionId}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                onClick={() => window.open(payosCheckoutUrl, "_blank")}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Thanh toán ngay
              </button>
              <button
                onClick={generatePayOSLink}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                Tạo lại liên kết
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Checkout component
const Checkout = () => {
  // State management
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [payosCheckoutUrl, setPayosCheckoutUrl] = useState("");
  const [paymentTransactionId, setPaymentTransactionId] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Get order ID from URL params
  const orderId =
    location.state?.orderId ||
    new URLSearchParams(location.search).get("orderId");
  const totalAmount = location.state?.totalAmount;

  // Load order on component mount
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
      setError("No order found. Please go back to your cart and try again.");
    }
  }, [orderId]);

  // Fetch order details from API
  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`api/Order/${id}`);

      if (response.data.isSuccess) {
        setCurrentOrder(response.data.result);
        await fetchOrderItems(id);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch order details",
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load order details");
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for this order (simplified)
  const fetchOrderItems = async (orderId) => {
    try {
      const response = await axiosInstance.get(`api/Order/${orderId}/items`);
      if (response.data.isSuccess) {
        setOrderItems(response.data.result || []);
      } else {
        // Fallback for testing
        setOrderItems([
          {
            id: 1,
            ticketId: "ticket-1",
            ticketName: "Concert Ticket",
            eventName: "Summer Music Festival",
            ticketPrice: currentOrder?.totalPrice || totalAmount || 0,
            eventDate: "Feb 28, 2025",
            ticketImage: "/api/placeholder/96/96",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      // Fallback data
      setOrderItems([
        {
          id: 1,
          ticketId: "ticket-1",
          ticketName: "Concert Ticket",
          eventName: "Summer Music Festival",
          ticketPrice: currentOrder?.totalPrice || totalAmount || 0,
          eventDate: "Feb 28, 2025",
          ticketImage: "/api/placeholder/96/96",
        },
      ]);
    }
  };

  // Generate PayOS payment link - Key functionality with localStorage
  const generatePayOSLink = async () => {
    if (!currentOrder?.orderId) return null;

    try {
      setIsGeneratingQR(true);

      const response = await axiosInstance.post(
        "api/Payment/create-payment-link",
        {
          orderNumber: currentOrder.orderNumber || 0,
          customerId: currentOrder.userId || "",
          amount: currentOrder.totalPrice || 0,
          description: `Payment for Order #${currentOrder.orderNumber}`,
          cancelUrl: `${window.location.origin}/order-confirmation/${currentOrder.orderId}?cancel=true`,
          returnUrl: `${window.location.origin}/order-confirmation/${currentOrder.orderId}?code=00&status=PAID`,
        },
      );

      if (
        response.data?.isSuccess &&
        response.data.result?.result?.checkoutUrl
      ) {
        // Extract checkout URL and transaction ID
        const result = response.data.result?.result;
        const checkoutUrl = result.checkoutUrl;
        const transactionId = response.data.paymentTransactionId;

        // Important: Save transaction ID to localStorage
        localStorage.setItem(
          `order_${currentOrder.orderId}_transaction`,
          transactionId,
        );

        // Update state
        setPayosCheckoutUrl(checkoutUrl);
        setPaymentTransactionId(transactionId);

        return checkoutUrl;
      } else {
        toast.error(
          response.data?.message || "Không thể tạo liên kết thanh toán PayOS",
        );
        return null;
      }
    } catch (error) {
      console.error("Error generating PayOS link:", error);
      toast.error("Lỗi kết nối đến hệ thống thanh toán");
      return null;
    } finally {
      setIsGeneratingQR(false);
    }
  };

  // Handle confirm order
  const handleConfirmOrder = async () => {
    if (!currentOrder) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    try {
      setProcessingPayment(true);
      const checkoutUrl = payosCheckoutUrl || (await generatePayOSLink());

      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        toast.info("Vui lòng hoàn tất thanh toán trong cửa sổ mới");
      } else {
        toast.error("Không thể tạo liên kết thanh toán");
      }
    } catch (error) {
      toast.error(error.message || "Thanh toán thất bại");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!currentOrder?.orderId) return;

    try {
      setDeletingOrder(true);
      const response = await axiosInstance.delete(
        `api/Order/${currentOrder.orderId}`,
      );

      if (response.data && response.data.isSuccess) {
        toast.success("Đơn hàng đã được xóa thành công");
        navigate("/tickets");
      } else {
        throw new Error(response.data?.message || "Không thể xóa đơn hàng");
      }
    } catch (error) {
      toast.error(error.message || "Xảy ra lỗi khi xóa đơn hàng");
    } finally {
      setDeletingOrder(false);
      setShowDeleteConfirm(false);
    }
  };

  // Delete Confirmation Modal - Simplified
  const DeleteConfirmationModal = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } rounded-xl border p-6 max-w-md w-full shadow-xl`}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Xác nhận xóa đơn hàng
            </h3>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className={`p-1 rounded-full ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p
            className={isDarkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}
          >
            Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn
            tác.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              disabled={deletingOrder}
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteOrder}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
              disabled={deletingOrder}
            >
              {deletingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Xóa đơn hàng
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          if (orderId) {
            fetchOrderDetails(orderId);
          } else {
            navigate("/cart");
          }
        }}
      />
    );
  }

  if (!currentOrder && !loading) {
    return (
      <ErrorState
        error="No order found. Please go back to your cart and try again."
        onRetry={() => navigate("/cart")}
      />
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-black" : "bg-gray-50"
      } min-h-screen transition-colors`}
    >
      <DeleteConfirmationModal />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button and delete order */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Checkout
            </h1>
          </div>

          {currentOrder && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDarkMode
                  ? "bg-red-900/20 text-red-400 hover:bg-red-900/30"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              } transition-colors`}
            >
              <Trash2 className="w-4 h-4" />
              Xóa đơn hàng
            </button>
          )}
        </div>

        {/* Order Status */}
        <div
          className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
            isDarkMode
              ? "bg-orange-500/10 text-orange-400"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>
            Your order is reserved for 15 minutes. Please complete your purchase
            before then.
          </span>
        </div>

        {/* Main Content Grid - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/50 border-gray-200"
              } backdrop-blur rounded-xl border p-6 mb-6 transition-colors`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  Your Items
                </div>
              </h2>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <TicketItem key={item.id || item.ticketId} ticket={item} />
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <PaymentInfoForm
              order={currentOrder}
              isGeneratingQR={isGeneratingQR}
              payosCheckoutUrl={payosCheckoutUrl}
              paymentTransactionId={paymentTransactionId}
              generatePayOSLink={generatePayOSLink}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div>
            {currentOrder && (
              <OrderSummary
                order={currentOrder}
                onConfirmOrder={handleConfirmOrder}
                isProcessing={processingPayment}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
