import React, { useEffect, useState } from "react";
import { Ticket, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const CartItem = ({ ticket, onRemove }) => {
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
      <div className="relative w-full sm:w-32 h-32 overflow-hidden rounded-lg">
        <img
          src={ticket.ticketImage || "/api/placeholder/128/128"}
          alt={ticket.ticketName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {ticket.ticketName}
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {ticket.eventName}
          </p>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="text-orange-500 font-bold">
            {formatCurrency(ticket.ticketPrice)}
          </div>

          <button
            onClick={() => onRemove(ticket.ticketId)}
            className={`p-2 ${
              isDarkMode
                ? "text-gray-400 hover:bg-red-500/10"
                : "text-gray-500 hover:bg-red-50"
            } hover:text-red-500 rounded-lg transition-colors`}
            title="Remove from cart"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CartSummary = ({ totalAmount, itemCount, onCheckout, isLoading }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur rounded-xl border p-6 space-y-6 transition-colors`}
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
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>

        <div className={`h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />

        <div
          className={`flex justify-between text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isLoading || itemCount === 0}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 
          disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg 
          transition-colors font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>Checkout Now</>
        )}
      </button>
    </div>
  );
};

const EmptyCart = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div
        className={`p-6 ${
          isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
        } backdrop-blur rounded-full mb-6`}
      >
        <ShoppingBag className="w-12 h-12 text-orange-500" />
      </div>
      <h2
        className={`text-2xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-2`}
      >
        Your cart is empty
      </h2>
      <p
        className={`${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } text-center mb-6`}
      >
        Looks like you haven&apos;t added any tickets yet
      </p>
      <button
        onClick={() => (window.location.href = "/tickets")}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Browse Tickets
      </button>
    </div>
  );
};

const LoadingState = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Loading cart...
      </p>
    </div>
  );
};

const ErrorState = ({ error, onRetry }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <p
        className={`text-red-500 text-center mb-4 ${
          isDarkMode ? "bg-red-500/10" : "bg-red-50"
        } p-4 rounded-lg`}
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

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/Cart/GetCart");
      setCart(response.data.result);
    } catch (err) {
      setError(err.message || "Failed to fetch cart");
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (ticketId) => {
    try {
      await axiosInstance.delete(`/Cart/RemoveFromCart/?ticketId=${ticketId}`);
      await fetchCart();
      toast.success("Ticket removed from cart");
    } catch (error) {
      toast.error("Failed to remove ticket");
    }
  };

  const handleCheckout = async () => {
    try {
      toast.success("Proceeding to checkout...");
      navigate("/checkout");
    } catch (error) {
      toast.error("Checkout failed");
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchCart} />;
  if (!cart?.cartItemsDtos?.length) return <EmptyCart />;

  return (
    <div className={isDarkMode ? "bg-black" : "bg-gray-50"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`p-3 ${
              isDarkMode ? "bg-orange-500/10" : "bg-orange-100"
            } rounded-lg transition-colors`}
          >
            <Ticket className="w-6 h-6 text-orange-500" />
          </div>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Shopping Cart ({cart.cartItemsDtos.length})
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.cartItemsDtos.map((item) => (
              <CartItem
                key={item.ticketId}
                ticket={item}
                onRemove={handleRemoveFromCart}
              />
            ))}
          </div>

          <div>
            <CartSummary
              totalAmount={cart.totalAmount}
              itemCount={cart.cartItemsDtos.length}
              onCheckout={handleCheckout}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
