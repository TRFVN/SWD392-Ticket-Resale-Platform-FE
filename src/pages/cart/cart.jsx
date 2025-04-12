import React, { useEffect, useState } from "react";
import {
  Ticket,
  Loader2,
  ShoppingBag,
  CheckCircle,
  Minus,
  Plus,
  ArrowLeft,
  ImageIcon,
  AlertTriangle,
  Trash,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import { notifyCartUpdated } from "../../utils/cartEvents";

/**
 * @typedef {Object} CartItem
 * @property {string} cartItemId
 * @property {string} ticketTemplateId
 * @property {string} ticketName
 * @property {string} ticketId
 * @property {number} quantity
 * @property {string} rank
 * @property {string} status
 * @property {string} imageTicket
 * @property {number} ticketPrice
 */

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const CartItem = ({
  ticket,
  onRemove,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
}) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div
      className={`flex items-start gap-3 p-4 ${
        isDarkMode
          ? "bg-gray-800/40 hover:bg-gray-800/60"
          : "bg-white hover:bg-gray-50/90"
      } rounded-xl transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-orange-500 ring-opacity-70"
          : "ring-1 ring-gray-200 dark:ring-gray-700"
      }`}
    >
      {/* Selection checkbox */}
      <div
        onClick={() => onToggleSelect(ticket.cartItemId)}
        className="mt-1 cursor-pointer"
      >
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center ${
            isSelected
              ? "bg-orange-500"
              : isDarkMode
              ? "border-2 border-gray-600"
              : "border-2 border-gray-300"
          }`}
        >
          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>

      {/* Image */}
      <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {ticket.imageTicket ? (
          <img
            src={ticket.imageTicket}
            alt={ticket.ticketName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3
              className={`text-base font-medium truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {ticket.ticketName}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  ticket.rank === "VIP"
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                }`}
              >
                {ticket.rank}
              </span>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formatCurrency(ticket.ticketPrice)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onRemove(ticket.cartItemId)}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } text-gray-400 hover:text-red-500 transition-colors`}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() =>
                onUpdateQuantity(
                  ticket.cartItemId,
                  Math.max(1, ticket.quantity - 1),
                )
              }
              className={`w-7 h-7 flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <div
              className={`w-8 text-center py-1 text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {ticket.quantity}
            </div>
            <button
              onClick={() =>
                onUpdateQuantity(ticket.cartItemId, ticket.quantity + 1)
              }
              className={`w-7 h-7 flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right font-medium text-orange-500">
            {formatCurrency(ticket.ticketPrice * ticket.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyCart = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`relative mb-6`}>
        <ShoppingCart className="w-20 h-20 text-orange-500 opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        </div>
      </div>
      <h2
        className={`text-2xl font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Your cart is empty
      </h2>
      <p
        className={`${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } text-center mb-8 max-w-md`}
      >
        Looks like you haven&apos;t added any tickets yet. Find amazing events
        and add tickets to your cart!
      </p>
      <button
        onClick={() => navigate("/tickets")}
        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
      >
        <Ticket className="w-4 h-4" />
        Browse Tickets
      </button>
    </div>
  );
};

const LoadingState = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
        </div>
      </div>
      <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Loading your cart...
      </p>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const allIds = new Set(cartItems.map((item) => item.cartItemId));
      setSelectedItems(allIds);
    }
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/Cart");

      if (response.data.isSuccess) {
        setCartItems(response.data.result || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch cart");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch cart");
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      setLoadingAction(true);
      const response = await axiosInstance.delete(
        `api/Cart/RemoveFromCart?TicketId=${cartItemId}`,
      );

      if (response.data.isSuccess) {
        setCartItems((prev) =>
          prev.filter((item) => item.cartItemId !== cartItemId),
        );
        setSelectedItems((prev) => {
          const newSelection = new Set(prev);
          if (newSelection.has(cartItemId)) {
            newSelection.delete(cartItemId);
          }
          return newSelection;
        });

        toast.success("Ticket removed from cart");

        notifyCartUpdated();
      } else {
        throw new Error(response.data.message || "Failed to remove ticket");
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove ticket");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const ticket = cartItems.find((item) => item.cartItemId === cartItemId);

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      if (newQuantity <= 0) {
        return handleRemoveFromCart(cartItemId);
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );

      toast.success("Quantity updated");

      notifyCartUpdated();
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
      fetchCart();
    }
  };

  const handleToggleSelect = (cartItemId) => {
    setSelectedItems((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(cartItemId)) {
        newSelection.delete(cartItemId);
      } else {
        newSelection.add(cartItemId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(cartItems.map((item) => item.cartItemId));
    setSelectedItems(allIds);
  };

  const handleUnselectAll = () => {
    setSelectedItems(new Set());
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.cartItemId))
      .reduce((sum, item) => sum + (item.ticketPrice * item.quantity || 0), 0);
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item to checkout");
      return;
    }

    try {
      setLoadingAction(true);

      const ticketTemplateIds = cartItems
        .filter((item) => selectedItems.has(item.cartItemId))
        .map((item) => item.ticketTemplateId);

      const checkoutResponse = await axiosInstance.post("api/Cart/Checkout", {
        ticketTemplateIds: ticketTemplateIds,
      });

      if (!checkoutResponse.data.isSuccess) {
        throw new Error(checkoutResponse.data.message || "Checkout failed");
      }

      const orderNumber = checkoutResponse.data.result.orderNumber;
      const orderId = checkoutResponse.data.result.orderId;

      const paymentResponse = await axiosInstance.post(
        "api/Payment/create-payment-link",
        {
          orderNumber: orderNumber,
          cancelUrl: `${window.location.origin}/cart`,
          returnUrl: `${window.location.origin}/order-confirmation/${orderId}`,
        },
      );

      if (paymentResponse.data.isSuccess && paymentResponse.data.result) {
        notifyCartUpdated();

        // Extract data from the nested result structure
        const result = paymentResponse.data.result;
        const checkoutUrl = result.result?.checkoutUrl;
        const paymentTransactionId = result.paymentTransactionId;

        if (checkoutUrl && paymentTransactionId) {
          // Store both orderId and orderNumber with the payment transaction ID in localStorage
          localStorage.setItem(
            `order_${orderId}_transaction`,
            paymentTransactionId,
          );
          localStorage.setItem(`order_${orderId}_number`, orderNumber);

          // Open a new window for the payment instead of redirecting
          const paymentWindow = window.open(checkoutUrl, "_blank");

          // Check if the window was successfully opened
          if (paymentWindow) {
            toast.success("Payment page opened in a new window");
          } else {
            toast.warning("Please allow pop-ups to complete your payment");
          }

          // Set loading to false since we're staying on this page
          setLoadingAction(false);
        } else {
          throw new Error("Payment information is incomplete");
        }
      } else {
        throw new Error("Failed to create payment link");
      }
    } catch (error) {
      toast.error(error.message || "Checkout process failed");
      setLoadingAction(false);
    }
  };

  if (loading && cartItems.length === 0) return <LoadingState />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2
          className={`text-xl font-semibold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Something went wrong
        </h2>
        <p
          className={`text-center mb-6 max-w-md ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <button
          onClick={fetchCart}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (!cartItems.length) return <EmptyCart />;

  const selectedCount = selectedItems.size;
  const totalAmount = calculateSelectedTotal();

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen transition-colors pb-16`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/tickets")}
            className={`inline-flex items-center gap-1 mb-4 ${
              isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to tickets</span>
          </button>

          <div className="flex justify-between items-center">
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Shopping Cart
            </h1>
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            <div
              className={`p-4 rounded-xl mb-4 ${
                isDarkMode ? "bg-gray-800/40" : "bg-white"
              }`}
            >
              {/* Selection Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className={`text-sm px-3 py-1.5 rounded-md ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-300 bg-gray-800"
                        : "hover:bg-gray-100 text-gray-700 bg-gray-50"
                    } transition-colors`}
                  >
                    Select all
                  </button>
                  <button
                    onClick={handleUnselectAll}
                    className={`text-sm px-3 py-1.5 rounded-md ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-300 bg-gray-800"
                        : "hover:bg-gray-100 text-gray-700 bg-gray-50"
                    } transition-colors`}
                  >
                    Clear selection
                  </button>
                </div>

                <div
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {selectedCount} of {cartItems.length} selected
                </div>
              </div>

              <div
                className={`h-px w-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } mb-4`}
              ></div>

              {/* Loading Indicator */}
              {loadingAction && (
                <div className="flex justify-center py-3">
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    ticket={item}
                    onRemove={handleRemoveFromCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    isSelected={selectedItems.has(item.cartItemId)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-4">
            <div
              className={`${
                isDarkMode ? "bg-gray-800/40" : "bg-white"
              } rounded-xl p-6 space-y-6 sticky top-4`}
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
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>

                <div
                  className={`h-px ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />

                <div
                  className={`flex justify-between text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <span>Total</span>
                  <span className="text-orange-500">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loadingAction || selectedCount === 0}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 
                  disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-lg 
                  transition-all shadow-sm"
              >
                {loadingAction ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Checkout</span>
                  </>
                )}
              </button>

              {selectedCount === 0 && (
                <div
                  className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700/50 text-gray-300"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <p>Please select at least one ticket to checkout</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
