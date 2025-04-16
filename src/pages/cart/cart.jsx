import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Ticket,
  Loader2,
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
  ImageIcon,
  AlertTriangle,
  Trash,
  ShoppingCart,
  CreditCard,
  Plus,
  Minus,
  ChevronRight,
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

const CartItem = React.memo(
  ({
    ticket,
    onRemove,
    onIncrement,
    onDecrement,
    isSelected,
    onToggleSelect,
    pendingAction,
  }) => {
    const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
    const isPending = pendingAction && pendingAction.id === ticket.cartItemId;

    return (
      <div
        className={`group flex items-center gap-5 py-6 border-b ${
          isDarkMode ? "border-gray-700/50" : "border-gray-200"
        } transition-all duration-300 relative ${
          isPending ? "opacity-70" : ""
        }`}
        style={{ minHeight: "120px" }}
      >
        <div
          onClick={() => onToggleSelect(ticket.cartItemId)}
          className="flex-shrink-0 cursor-pointer w-6 h-6"
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? "bg-gradient-to-r from-orange-500 to-orange-600 scale-110"
                : isDarkMode
                ? "border-2 border-gray-600 hover:border-gray-500"
                : "border-2 border-gray-300 hover:border-orange-300"
            }`}
          >
            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>

        {/* Image */}
        <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 transition-all duration-300 shadow-sm group-hover:shadow-md">
          {ticket.imageTicket ? (
            <img
              src={ticket.imageTicket}
              alt={ticket.ticketName}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-50 dark:from-gray-700 dark:to-gray-800">
              <Ticket className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 flex-1">
          <div className="md:col-span-2">
            <div className="flex flex-col gap-2">
              <h3
                className={`font-semibold text-base md:text-lg ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } group-hover:text-orange-600 transition-colors`}
              >
                {ticket.ticketName}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    ticket.rank === "VIP"
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                      : "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {ticket.rank}
                </span>
              </div>
              <div className="font-medium text-base text-gray-600 dark:text-gray-400 transition-all duration-300 group-hover:text-orange-600">
                {formatCurrency(ticket.ticketPrice)}
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center md:justify-center mt-4 md:mt-0">
            <div className="flex items-center">
              <button
                onClick={() => onDecrement(ticket.cartItemId)}
                className={`group rounded-l-xl px-4 py-3 border ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                } flex items-center justify-center shadow-sm shadow-transparent transition-all duration-300 hover:border-orange-300 ${
                  ticket.quantity <= 1 || isPending
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={ticket.quantity <= 1 || isPending}
              >
                <Minus
                  size={16}
                  className={
                    isDarkMode
                      ? "text-gray-400 group-hover:text-orange-400"
                      : "text-gray-700 group-hover:text-orange-600"
                  }
                />
              </button>

              <div
                className={`w-14 py-3 border-y ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-800/50 text-white"
                    : "border-gray-200 bg-white text-gray-900"
                } text-center font-semibold text-lg`}
              >
                {isPending && pendingAction.type === "increment"
                  ? ticket.quantity + 1
                  : isPending && pendingAction.type === "decrement"
                  ? ticket.quantity - 1
                  : ticket.quantity}
              </div>

              <button
                onClick={() => onIncrement(ticket.cartItemId)}
                className={`group rounded-r-xl px-4 py-3 border ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                } flex items-center justify-center shadow-sm shadow-transparent transition-all duration-300 hover:border-orange-300 ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isPending}
              >
                <Plus
                  size={16}
                  className={
                    isDarkMode
                      ? "text-gray-400 group-hover:text-orange-400"
                      : "text-gray-700 group-hover:text-orange-600"
                  }
                />
              </button>
            </div>
          </div>

          {/* Total and Remove */}
          <div className="flex flex-wrap items-center justify-between md:justify-end mt-4 md:mt-0">
            <div className="font-bold text-lg text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:text-orange-600">
              {formatCurrency(ticket.ticketPrice * ticket.quantity)}
            </div>

            <button
              onClick={() => onRemove(ticket.cartItemId)}
              disabled={isPending}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-400"
              } hover:text-red-500 transition-all duration-300 ml-auto md:ml-4 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isPending && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
            <div className="w-7 h-7 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
          </div>
        )}
      </div>
    );
  },
);

const EmptyCart = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`relative mb-8 animate-float`}>
        <div className="absolute inset-0 bg-orange-500/10 rounded-full filter blur-xl animate-pulse"></div>
        <ShoppingCart className="w-24 h-24 text-orange-500 opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-orange-500" />
        </div>
      </div>
      <h2
        className={`text-2xl font-bold mb-3 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Giỏ hàng của bạn đang trống
      </h2>
      <p
        className={`${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } text-center mb-8 max-w-md`}
      >
        Bạn chưa thêm vé nào vào giỏ hàng. Hãy khám phá các sự kiện hấp dẫn và
        chọn vé ngay!
      </p>
      <button
        onClick={() => navigate("/tickets")}
        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md"
      >
        <Ticket className="w-5 h-5" />
        Khám phá vé
      </button>
    </div>
  );
};

const LoadingState = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500/20 to-orange-600/5 animate-pulse"></div>
        <div className="absolute inset-0 w-16 h-16 m-auto border-4 border-gray-200 dark:border-gray-700 border-t-orange-500 border-b-orange-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-orange-500" />
        </div>
      </div>
      <p
        className={`mt-6 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } animate-pulse`}
      >
        Đang tải giỏ hàng của bạn...
      </p>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const navigate = useNavigate();
  const cartItemsRef = useRef([]); // To track actual cart items for operations

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      // Select all items by default
      const allIds = new Set(cartItems.map((item) => item.cartItemId));
      setSelectedItems(allIds);

      // Update ref
      cartItemsRef.current = cartItems;
    }
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/Cart");

      if (response.data.isSuccess) {
        setCartItems(response.data.result || []);
        cartItemsRef.current = response.data.result || [];
      } else {
        throw new Error(response.data.message || "Failed to fetch cart");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch cart");
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = useCallback(async (cartItemId) => {
    try {
      // Set pending state for UI feedback
      setPendingAction({ id: cartItemId, type: "remove" });

      // Find the current item
      const currentItem = cartItemsRef.current.find(
        (item) => item.cartItemId === cartItemId,
      );

      if (!currentItem) {
        throw new Error("Item not found");
      }

      // If quantity is more than 1, decrease by 1
      if (currentItem.quantity > 1) {
        // Update locally first for immediate UI feedback
        setCartItems((prev) =>
          prev.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        );

        // Call API to remove one ticket (backend already handles this)
        const response = await axiosInstance.delete(
          `api/Cart/RemoveFromCart?TicketId=${cartItemId}`,
        );

        if (!response.data.isSuccess) {
          // Revert local change if API call fails
          setCartItems((prev) => [...cartItemsRef.current]);
          throw new Error(response.data.message || "Failed to remove ticket");
        }

        // Update ref after successful operation
        cartItemsRef.current = cartItemsRef.current.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      } else {
        // If quantity is 1, remove the item completely
        // Optimistically update UI first
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

        const response = await axiosInstance.delete(
          `api/Cart/RemoveFromCart?TicketId=${cartItemId}`,
        );

        if (!response.data.isSuccess) {
          // Revert local change if API call fails
          setCartItems([...cartItemsRef.current]);
          throw new Error(response.data.message || "Failed to remove ticket");
        }

        // Update ref after successful operation
        cartItemsRef.current = cartItemsRef.current.filter(
          (item) => item.cartItemId !== cartItemId,
        );
      }

      notifyCartUpdated();
    } catch (error) {
      toast.error(error.message || "Không thể xóa vé");
    } finally {
      setPendingAction(null);
    }
  }, []);

  const handleIncrementQuantity = useCallback(async (cartItemId) => {
    try {
      // Set pending state for UI feedback
      setPendingAction({ id: cartItemId, type: "increment" });

      // Find the item to increment
      const item = cartItemsRef.current.find(
        (item) => item.cartItemId === cartItemId,
      );
      if (!item) return;

      // Update locally first for immediate UI feedback
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );

      const response = await axiosInstance.post("api/Cart/AddToCart", {
        ticketTemplateId: item.ticketTemplateId,
        quantity: 1,
      });

      if (!response.data.isSuccess) {
        // Revert local change if API call fails
        setCartItems([...cartItemsRef.current]);
        throw new Error(response.data.message || "Failed to add ticket");
      }

      // Update ref after successful operation
      cartItemsRef.current = cartItemsRef.current.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );

      notifyCartUpdated();
    } catch (error) {
      toast.error(error.message || "Không thể tăng số lượng vé");
    } finally {
      setPendingAction(null);
    }
  }, []);

  const handleDecrementQuantity = useCallback(async (cartItemId) => {
    try {
      // Set pending state for UI feedback
      setPendingAction({ id: cartItemId, type: "decrement" });

      // Find the current item
      const currentItem = cartItemsRef.current.find(
        (item) => item.cartItemId === cartItemId,
      );

      if (!currentItem || currentItem.quantity <= 1) {
        setPendingAction(null);
        return;
      }

      // Update locally first for immediate UI feedback
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      );

      // Call API to remove one ticket
      const response = await axiosInstance.delete(
        `api/Cart/RemoveFromCart?TicketId=${cartItemId}`,
      );

      if (!response.data.isSuccess) {
        // Revert local change if API call fails
        setCartItems([...cartItemsRef.current]);
        throw new Error(response.data.message || "Failed to remove ticket");
      }

      // Update ref after successful operation
      cartItemsRef.current = cartItemsRef.current.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );

      notifyCartUpdated();
    } catch (error) {
      toast.error(error.message || "Không thể giảm số lượng vé");
    } finally {
      setPendingAction(null);
    }
  }, []);

  const handleToggleSelect = useCallback((cartItemId) => {
    setSelectedItems((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(cartItemId)) {
        newSelection.delete(cartItemId);
      } else {
        newSelection.add(cartItemId);
      }
      return newSelection;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = new Set(cartItems.map((item) => item.cartItemId));
    setSelectedItems(allIds);
  }, [cartItems]);

  const handleUnselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const calculateSelectedTotal = useCallback(() => {
    return cartItems
      .filter((item) => selectedItems.has(item.cartItemId))
      .reduce((sum, item) => sum + (item.ticketPrice * item.quantity || 0), 0);
  }, [cartItems, selectedItems]);

  const handleApplyPromoCode = useCallback(() => {
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    toast.info("Chức năng mã giảm giá đang được phát triển");
    // Here you would normally call an API to validate and apply the promo code
  }, [promoCode]);

  const handleCheckout = useCallback(async () => {
    if (selectedItems.size === 0) {
      toast.error("Vui lòng chọn ít nhất một vé để thanh toán");
      return;
    }

    try {
      setPendingAction({ id: "checkout", type: "checkout" });

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
            toast.success("Đã mở trang thanh toán trong cửa sổ mới");
          } else {
            toast.warning(
              "Vui lòng cho phép trình duyệt mở cửa sổ mới để thanh toán",
            );
          }
        } else {
          throw new Error("Payment information is incomplete");
        }
      } else {
        throw new Error("Failed to create payment link");
      }
    } catch (error) {
      toast.error(error.message || "Không thể thanh toán");
    } finally {
      setPendingAction(null);
    }
  }, [cartItems, selectedItems]);

  if (loading && cartItems.length === 0) return <LoadingState />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500/10 rounded-full filter blur-xl"></div>
          <AlertTriangle className="w-20 h-20 text-red-500 relative z-10" />
        </div>
        <h2
          className={`text-xl font-semibold mb-3 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Đã xảy ra lỗi
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
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  if (!cartItems.length) return <EmptyCart />;

  const selectedCount = selectedItems.size;
  const totalAmount = calculateSelectedTotal();
  const isCheckoutPending = pendingAction && pendingAction.id === "checkout";

  return (
    <section
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen transition-colors pb-16 relative`}
    >
      <div
        className={`w-full max-w-7xl mx-auto px-4 md:px-5 py-8 relative z-10`}
      >
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Cart Items */}
          <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-8 pb-8 lg:py-8">
            <div className="flex items-center justify-between pb-6 border-b border-gray-300 dark:border-gray-700">
              <h2
                className={`font-bold text-2xl md:text-3xl ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Giỏ hàng
              </h2>
              <div
                className={`font-medium text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {cartItems.length} {cartItems.length === 1 ? "vé" : "vé"}
              </div>
            </div>

            {/* Header row for larger screens */}
            <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-12 md:col-span-7">
                <p
                  className={`font-normal text-lg ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Chi tiết vé
                </p>
              </div>
              <div className="col-span-12 md:col-span-5">
                <div className="grid grid-cols-5">
                  <div className="col-span-3">
                    <p
                      className={`font-normal text-lg text-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Số lượng
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className={`font-normal text-lg text-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Tổng cộng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className={`text-sm px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-300 bg-gray-800/60"
                      : "hover:bg-gray-100 text-gray-700 bg-gray-50/80"
                  } transition-all duration-300`}
                >
                  Chọn tất cả
                </button>
                <button
                  onClick={handleUnselectAll}
                  className={`text-sm px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-300 bg-gray-800/60"
                      : "hover:bg-gray-100 text-gray-700 bg-gray-50/80"
                  } transition-all duration-300`}
                >
                  Bỏ chọn
                </button>
              </div>

              <div
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Đã chọn {selectedCount}/{cartItems.length}
              </div>
            </div>

            {/* Cart Items Container - Fixed height with overflow to prevent layout shifts */}
            <div className="space-y-2 min-h-[400px]">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  ticket={item}
                  onRemove={handleRemoveFromCart}
                  onIncrement={handleIncrementQuantity}
                  onDecrement={handleDecrementQuantity}
                  isSelected={selectedItems.has(item.cartItemId)}
                  onToggleSelect={handleToggleSelect}
                  pendingAction={pendingAction}
                />
              ))}
            </div>

            {/* Add coupon button */}
            <div className="flex items-center justify-end mt-8">
              <button className="flex items-center px-5 py-3 rounded-full gap-2 outline-none group font-semibold text-lg text-orange-600 transition-all duration-300 hover:text-orange-700">
                Thêm mã giảm giá
                <ChevronRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-span-12 xl:col-span-4 h-fit sticky top-24">
            <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-md overflow-hidden transform-gpu">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 dark:from-orange-500/20 dark:to-orange-600/10 border-b border-orange-100 dark:border-orange-900/20 px-6 py-5">
                <h2
                  className={`font-bold text-xl ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Thông tin đơn hàng
                </h2>
              </div>

              <div className="p-6">
                {/* Tickets Summary */}
                <div className="flex items-center justify-between py-3 px-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      {cartItems.length} {cartItems.length === 1 ? "vé" : "vé"}
                    </p>
                  </div>
                  <p
                    className={`font-semibold text-lg ${
                      isDarkMode ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
                {/* Shipping selection */}
                <div className="mb-5">
                  {/* <label
                    className={`flex items-center mb-2 text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Phương thức vận chuyển
                  </label>
                  <div className="relative w-full mb-4">
                    <select
                      className={`block w-full px-4 py-3 text-base font-normal rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      } border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none`}
                    >
                      <option value="standard">
                        Giao hàng tiêu chuẩn - Miễn phí
                      </option>
                      <option value="fast">Giao hàng nhanh - 50.000đ</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div> */}

                  {/* Promo Code input */}
                  <label
                    className={`flex items-center mb-2 text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Mã giảm giá
                  </label>
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className={`block flex-1 px-4 py-3 text-base font-normal rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                      } border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      className={`px-4 py-3 rounded-lg font-semibold bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300 flex-shrink-0`}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
                {/* Divider */}
                <div
                  className={`h-px my-2 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                />
                {/* Total */}
                <div className="flex items-center justify-between py-4 mt-1">
                  <p
                    className={`font-medium text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Tổng cộng
                  </p>
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-xl text-orange-600 dark:text-orange-400">
                      {formatCurrency(totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Đã bao gồm thuế VAT
                    </p>
                  </div>
                </div>
                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutPending || selectedCount === 0}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-md font-semibold text-lg mt-4"
                >
                  {isCheckoutPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Thanh toán</span>
                    </>
                  )}
                </button>
                {selectedCount === 0 && (
                  <div
                    className={`flex items-center gap-2 text-sm p-4 mt-4 rounded-xl ${
                      isDarkMode
                        ? "bg-gray-700/40 text-gray-300 border border-gray-700/40"
                        : "bg-orange-50 text-orange-700 border border-orange-100"
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p>Vui lòng chọn ít nhất một vé để thanh toán</p>
                  </div>
                )}
                {/* Extra info */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                    <span>Bảo mật thanh toán</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
