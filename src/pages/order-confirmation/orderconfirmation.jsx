import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Package,
  Ticket,
  Download,
  Share2,
  Calendar,
  Copy,
} from "lucide-react";

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Loading state component
const LoadingState = ({ message = "Processing your payment..." }) => {
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

// Error state component
const ErrorState = ({ error, onRetry }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <XCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2
        className={`text-xl font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Payment Failed
      </h2>
      <p
        className={`text-center text-red-500 mb-4 ${
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

// Success state component
const SuccessState = ({ order }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const navigate = useNavigate();

  // Function to copy order ID to clipboard
  const copyOrderId = () => {
    if (order.orderId) {
      navigator.clipboard.writeText(order.orderId);
      toast.success("Order ID copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`p-4 rounded-full ${
          isDarkMode ? "bg-green-900/30" : "bg-green-100"
        } mb-4`}
      >
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h2
        className={`text-2xl font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Payment Successful!
      </h2>
      <p
        className={`text-center mb-8 max-w-md ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Thank you for your payment. Your order has been confirmed and your
        tickets are ready.
      </p>

      <div
        className={`flex flex-col items-center p-6 rounded-xl mb-8 w-full max-w-md ${
          isDarkMode
            ? "bg-gray-800/50 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-orange-500" />
          <span
            className={`font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Order #{order.orderNumber || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-800"
            }`}
          >
            PAID
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode
                ? "bg-blue-900/30 text-blue-400"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            CONFIRMED
          </div>
        </div>

        <div
          className={`w-full p-3 rounded-lg mb-4 flex items-center justify-between ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Order ID:
            </span>
            <span
              className={`text-sm font-mono truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {order.orderId || "N/A"}
            </span>
          </div>
          <button
            onClick={copyOrderId}
            className={`p-1 rounded hover:bg-gray-200 ${
              isDarkMode ? "hover:bg-gray-600" : ""
            }`}
            title="Copy Order ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`w-full h-px ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } mb-4`}
        />

        <div className="w-full flex justify-between mb-2">
          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Total Amount:
          </span>
          <span
            className={`font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {formatCurrency(order.totalPrice || 0)}
          </span>
        </div>

        <div className="w-full flex justify-between mb-4">
          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Payment Method:
          </span>
          <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            PayOS
          </span>
        </div>

        <div
          className={`w-full h-px ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } mb-4`}
        />

        <div className="w-full flex gap-2">
          <button
            onClick={() => navigate("/my-tickets")}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            View Tickets
          </button>
          <button
            onClick={() => navigate("/")}
            className={`px-4 py-2 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My Ticket Order",
                  text: `I've just ordered tickets! Order #${order.orderNumber}`,
                  url: window.location.href,
                });
              } else {
                toast.info("Sharing is not supported by your browser");
              }
            }}
            className={`px-4 py-2 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const cancelled = queryParams.get("cancel") === "true";
  const paymentStatus = queryParams.get("status");

  useEffect(() => {
    if (orderId) {
      // Log for debugging
      console.log("OrderId detected:", orderId);
      console.log("URL parameters:", location.search);

      // Check if cancelled first
      if (cancelled) {
        setLoading(false);
        return;
      }

      // Retrieve transaction ID and order number from localStorage
      const transactionKey = `order_${orderId}_transaction`;
      const orderNumberKey = `order_${orderId}_number`;

      const storedTransactionId = localStorage.getItem(transactionKey);
      const storedOrderNumber = localStorage.getItem(orderNumberKey);

      console.log("Transaction ID from localStorage:", storedTransactionId);
      console.log("Order Number from localStorage:", storedOrderNumber);

      // Check if we came from payment page
      const fromPayment = code || paymentStatus === "PAID";

      if (storedTransactionId && storedOrderNumber) {
        // If we have the transaction ID and order number in localStorage, use them
        confirmPayment(storedTransactionId, storedOrderNumber);
      } else if (fromPayment) {
        // If we came from payment but don't have the transaction data
        setError(
          "Payment transaction information not found. Please contact support.",
        );
        setLoading(false);
      } else {
        // Normal order view, just fetch the details
        fetchOrderDetails();
      }
    } else {
      setLoading(false);
      setError("Invalid order information");
    }
  }, [orderId, code, cancelled, paymentStatus]);

  const confirmPayment = async (transactionId, orderNumber) => {
    try {
      setLoading(true);

      // Log the payment confirmation details
      console.log("Confirming payment with transaction ID:", transactionId);
      console.log("Order Number:", orderNumber);

      // Make the API call to confirm payment
      const response = await axiosInstance.post("api/Payment/confirm-payment", {
        orderNumber: orderNumber,
        paymentTransactionId: transactionId,
      });
      console.log(response.data);

      if (response.data.isSuccess) {
        // Success - clean up localStorage
        localStorage.removeItem(`order_${orderId}_transaction`);
        localStorage.removeItem(`order_${orderId}_number`);
        console.log(
          "Payment data cleared from localStorage after successful confirmation",
        );

        // Store payment details from the response
        if (response.data.result) {
          setPaymentDetails(response.data.result);

          // Log the number of tickets assigned
          if (response.data.result.ticketsAssigned) {
            console.log(
              `${response.data.result.ticketsAssigned} tickets assigned successfully`,
            );
          }

          // Log transaction ID from response
          if (response.data.result.transactionId) {
            console.log(
              "Confirmed Transaction ID:",
              response.data.result.transactionId,
            );
          }
        }

        setPaymentConfirmed(true);
        toast.success(
          response.data.message || "Payment confirmed successfully!",
        );

        // Now fetch order details to display the up-to-date information
        await fetchOrderDetails();
      } else {
        throw new Error(response.data.message || "Payment confirmation failed");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setError(err.message || "Failed to confirm payment");
      toast.error("Payment confirmation failed. Please contact support.");

      // Still try to fetch order details to show at least basic information
      try {
        await fetchOrderDetails();
      } catch (fetchErr) {
        console.error("Failed to fetch order after payment error:", fetchErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`api/Order`);

      if (response.data.isSuccess) {
        setOrder(response.data.result);
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

  // Success state component (updated to include payment details if available)
  const renderSuccessState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div
          className={`p-4 rounded-full ${
            isDarkMode ? "bg-green-900/30" : "bg-green-100"
          } mb-4`}
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h2
          className={`text-2xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Payment Successful!
        </h2>

        <p
          className={`text-center mb-8 max-w-md ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {paymentDetails && paymentDetails.ticketsAssigned
            ? `Thank you for your payment. Your order has been confirmed and ${paymentDetails.ticketsAssigned} ticket(s) are ready.`
            : "Thank you for your payment. Your order has been confirmed and your tickets are ready."}
        </p>

        {order && <SuccessState order={order} />}
      </div>
    );
  };

  // Main render logic
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
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
              Order Confirmation
            </h1>
          </div>
          <ErrorState error={error} onRetry={fetchOrderDetails} />
        </div>
      </div>
    );
  }

  // Render the canceled payment state
  if (cancelled) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
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
              Order Confirmation
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className={`p-4 rounded-full ${
                isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100"
              } mb-4`}
            >
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Payment Cancelled
            </h2>
            <p
              className={`text-center mb-8 max-w-md ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your payment has been cancelled. You can try again from your cart.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle successful payment
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
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
            Order Confirmation
          </h1>
        </div>

        {paymentConfirmed
          ? renderSuccessState()
          : order && <SuccessState order={order} />}
      </div>
    </div>
  );
};

export default OrderConfirmation;
