import React, { useState, useEffect, useMemo } from "react";
import {
  Ticket,
  CreditCard,
  ArrowRight,
  Minus,
  Plus,
  X,
  AlertCircle,
  Check,
  Share2,
  Sun,
  Moon,
  Clock,
  Calendar,
  MapPin,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

// Theme Hook
const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return [theme, setTheme];
};

// CartItem Component with enhanced UI
const CartItem = ({
  ticket,
  onUpdateQuantity,
  onRemove,
  onShare,
  disabled,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 group">
        <img
          src={ticket.image || "/api/placeholder/96/96"}
          alt={ticket.eventName}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onShare(ticket)}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:scale-110 transition-transform"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {ticket.eventName}
            </h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {ticket.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {ticket.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {ticket.time || "19:00"}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            ${ticket.price.toFixed(2)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Quantity:
            </span>
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onUpdateQuantity(ticket.id, ticket.quantity - 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={ticket.quantity <= 1 || disabled}
              >
                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <span className="w-12 text-center py-2 font-medium text-gray-900 dark:text-white">
                {ticket.quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onUpdateQuantity(ticket.id, ticket.quantity + 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg disabled:opacity-50"
                disabled={ticket.quantity >= ticket.maxQuantity || disabled}
              >
                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
            {ticket.quantity >= ticket.maxQuantity && (
              <span className="text-xs text-orange-500 dark:text-orange-400">
                Max limit reached
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total: ${(ticket.price * ticket.quantity).toFixed(2)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(ticket.id)}
              className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors disabled:opacity-50"
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// PromoCode Component with enhanced UI
const PromoCode = ({ onApply, disabled }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onApply(code);
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Apply Promo Code
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={disabled || isLoading}
          />
          {code && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCode("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={disabled || isLoading || !code.trim()}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg
            hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]
            font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Applying
            </span>
          ) : (
            "Apply Code"
          )}
        </motion.button>
      </form>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Enter "SUMMER2024" for 10% off
      </p>
    </div>
  );
};

// CartSummary Component with enhanced UI
const CartSummary = ({
  subtotal,
  tax,
  discount = 0,
  total,
  onCheckout,
  itemCount,
  disabled,
  timeLeft,
  progress,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-orange-800 dark:text-orange-200 font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time remaining
          </span>
          <span className="font-mono text-orange-800 dark:text-orange-200">
            {timeLeft}
          </span>
        </div>
        <div className="h-2 bg-orange-100 dark:bg-orange-800/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 dark:bg-orange-400 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        disabled={disabled || itemCount === 0}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 dark:bg-orange-600 text-white py-4 px-6 rounded-lg
          hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          text-lg font-medium"
      >
        {disabled ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Checkout Now
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m0 6h.01M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
        </svg>
        Secure checkout powered by Stripe
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = ({ onContinueShopping }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-[60vh] flex items-center justify-center"
  >
    <div className="text-center p-8 max-w-md">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Ticket className="w-12 h-12 text-orange-500 dark:text-orange-400" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Looks like you haven't added any tickets yet. Browse our events and find
        something you'll love!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinueShopping}
        className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 dark:bg-orange-600 text-white rounded-lg
          hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors font-medium gap-2"
      >
        Explore Events
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  </motion.div>
);

// Main Cart Component
const Cart = () => {
  const [theme, setTheme] = useTheme();
  const [tickets, setTickets] = useState([
    {
      id: 1,
      eventName: "Summer Music Festival",
      price: 99.99,
      date: "Aug 15, 2024",
      location: "Central Park",
      quantity: 1,
      maxQuantity: 4,
      image: "/api/placeholder/96/96",
      time: "19:00",
      category: "Music",
    },
    {
      id: 2,
      eventName: "Comedy Night Special",
      price: 49.99,
      date: "Aug 20, 2024",
      location: "Laugh Factory",
      quantity: 2,
      maxQuantity: 6,
      image: "/api/placeholder/96/96",
      time: "20:30",
      category: "Comedy",
    },
  ]);
  // Custom Hook for Cart Timer
  const useCartTimer = (expiryMinutes = 15, onExpire) => {
    const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
      if (timeLeft <= 0) {
        onExpire?.();
        return;
      }

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress((newTime / (expiryMinutes * 60)) * 100);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [timeLeft, expiryMinutes, onExpire]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return { timeLeft: formatTime(timeLeft), progress };
  };

  const [isLoading, setIsLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const { timeLeft, progress } = useCartTimer(15, () => {
    toast.error("Your cart has expired! Please try again.", {
      toastId: "cart-expired",
    });
    setTickets([]);
  });

  // Memoized calculations
  const cartCalculations = useMemo(() => {
    const subtotal = tickets.reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0,
    );
    const tax = subtotal * 0.1;
    const discount = appliedPromo
      ? subtotal * (appliedPromo.percentage / 100)
      : 0;
    const total = subtotal + tax - discount;

    return { subtotal, tax, discount, total };
  }, [tickets, appliedPromo]);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (isLoading) return;

    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || newQuantity < 1 || newQuantity > ticket.maxQuantity) {
      toast.error(`Quantity must be between 1 and ${ticket.maxQuantity}`, {
        toastId: "quantity-error",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, quantity: newQuantity } : t)),
      );
    } catch (error) {
      toast.error("Failed to update quantity", {
        toastId: "update-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTicket = async (id) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const ticket = tickets.find((t) => t.id === id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast.success(`Removed ${ticket.eventName}`, {
        toastId: "remove-success",
      });
    } catch (error) {
      toast.error("Failed to remove ticket", {
        toastId: "remove-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPromo = async (code) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (code.toLowerCase() === "summer2024") {
        setAppliedPromo({ code, percentage: 10 });
        toast.success("10% discount applied!", {
          toastId: "promo-success",
        });
      } else {
        toast.error("Invalid promo code", {
          toastId: "promo-error",
        });
      }
    } catch (error) {
      toast.error("Failed to apply promo code", {
        toastId: "promo-error",
      });
    }
  };

  const handleCheckout = async () => {
    if (tickets.length === 0) {
      toast.error("Your cart is empty", {
        toastId: "empty-cart",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Order processed successfully!", {
        toastId: "checkout-success",
      });
      setTickets([]);
    } catch (error) {
      toast.error("Checkout failed. Please try again.", {
        toastId: "checkout-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (ticket) => {
    // Share functionality
    const shareData = {
      title: ticket.eventName,
      text: `Check out this event: ${ticket.eventName} at ${ticket.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => toast.success("Shared successfully!"))
        .catch(() => toast.error("Failed to share"));
    } else {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <EmptyCart onContinueShopping={() => window.history.back()} />
        <ToastContainer limit={1} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart ({tickets.length})
          </h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
              hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {tickets.map((ticket) => (
                <CartItem
                  key={ticket.id}
                  ticket={ticket}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveTicket}
                  onShare={handleShare}
                  disabled={isLoading}
                />
              ))}
            </AnimatePresence>
            <PromoCode onApply={handleApplyPromo} disabled={isLoading} />
          </div>

          <div className="lg:sticky lg:top-4">
            <CartSummary
              {...cartCalculations}
              onCheckout={handleCheckout}
              itemCount={tickets.length}
              disabled={isLoading}
              timeLeft={timeLeft}
              progress={progress}
            />
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
};

export default Cart;
