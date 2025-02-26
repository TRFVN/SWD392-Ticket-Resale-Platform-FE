import React, { useEffect, useState } from "react";
import {
  Ticket,
  Trash2,
  Loader2,
  ShoppingBag,
  CheckCircle,
  Circle,
  ArrowRight,
} from "lucide-react";
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

const CartItem = ({ ticket, onRemove, isSelected, onToggleSelect }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-4 ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } ${
        isSelected ? "border-orange-500 border-2" : "border"
      } backdrop-blur rounded-xl transition-all hover:shadow-md`}
    >
      {/* Selection */}
      <div className="flex items-center">
        <button
          onClick={() => onToggleSelect(ticket.cartItemId)}
          className="focus:outline-none"
          aria-label={isSelected ? "Deselect item" : "Select item"}
        >
          {isSelected ? (
            <CheckCircle className="w-6 h-6 text-orange-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full sm:w-32 h-32 overflow-hidden rounded-lg">
        <img
          src={ticket.ticketImage || "/api/placeholder/128/128"}
          alt={ticket.ticketName}
          className="h-full w-full object-cover"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-orange-500" />
          </div>
        )}
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
            {ticket.eventName || "Event"}
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

const CartSummary = ({
  totalAmount,
  itemCount,
  selectedCount,
  onCheckout,
  isLoading,
  showOnlySelected,
}) => {
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
          <span>
            {showOnlySelected
              ? `Selected (${selectedCount}/${itemCount})`
              : `Subtotal (${itemCount} items)`}
          </span>
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
        disabled={isLoading || selectedCount === 0}
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
          <>
            Checkout Now
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

const CartActions = ({
  onSelectAll,
  onUnselectAll,
  selectedCount,
  totalCount,
  toggleShowSelected,
  showOnlySelected,
}) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  return (
    <div className={`flex flex-wrap gap-3 mb-6 items-center`}>
      <button
        onClick={onSelectAll}
        className={`px-4 py-2 rounded-lg text-sm ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        } transition-colors`}
      >
        Select All
      </button>

      <button
        onClick={onUnselectAll}
        className={`px-4 py-2 rounded-lg text-sm ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        } transition-colors`}
      >
        Unselect All
      </button>

      <div className="flex-1"></div>

      <button
        onClick={toggleShowSelected}
        className={`px-4 py-2 rounded-lg text-sm ${
          showOnlySelected
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        } transition-colors`}
      >
        {showOnlySelected ? "Show All Items" : "Show Selected Only"}
      </button>

      <div
        className={`px-4 py-2 rounded-lg text-sm ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
      >
        {selectedCount} of {totalCount} selected
      </div>
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
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  useEffect(() => {
    fetchCart();
  }, []);

  // Select all items by default when cart is loaded
  useEffect(() => {
    if (cartItems.length > 0) {
      const allIds = new Set(cartItems.map((item) => item.cartItemId));
      setSelectedItems(allIds);
    }
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/Cart/GetCartItem");

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

  const handleRemoveFromCart = async (ticketId) => {
    try {
      const response = await axiosInstance.delete(
        `api/Cart/RemoveFromCart/?ticketId=${ticketId}`,
      );

      if (response.data.isSuccess) {
        await fetchCart();
        toast.success("Ticket removed from cart");
      } else {
        throw new Error(response.data.message || "Failed to remove ticket");
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove ticket");
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

  const toggleShowSelected = () => {
    setShowOnlySelected(!showOnlySelected);
  };

  // Calculate total amount of selected items
  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.cartItemId))
      .reduce((sum, item) => sum + (item.ticketPrice || 0), 0);
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item to checkout");
      return;
    }

    try {
      setLoading(true);

      // Get array of selected cartItemIds
      const selectedItemIds = Array.from(selectedItems);
      const totalPrice = calculateSelectedTotal();

      // First, use the checkout endpoint
      const checkoutResponse = await axiosInstance.post("api/Cart/Checkout", {
        cartItemIds: selectedItemIds,
      });

      if (!checkoutResponse.data.isSuccess) {
        throw new Error(checkoutResponse.data.message || "Checkout failed");
      }

      // Then, create an order using the Order API
      const orderResponse = await axiosInstance.post("api/Order", {
        checkedOutCartItemIds: selectedItemIds,
        checkoutTotalPrice: totalPrice,
      });

      if (orderResponse.data.isSuccess) {
        toast.success("Order created successfully!");
        navigate("/checkout", {
          state: {
            orderId: orderResponse.data.result?.orderId || null,
            totalAmount: totalPrice,
          },
        });
      } else {
        throw new Error(orderResponse.data.message || "Order creation failed");
      }
    } catch (error) {
      toast.error(error.message || "Checkout process failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on selection preference
  const displayedItems = showOnlySelected
    ? cartItems.filter((item) => selectedItems.has(item.cartItemId))
    : cartItems;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchCart} />;
  if (!cartItems.length) return <EmptyCart />;

  return (
    <div
      className={`${
        isDarkMode ? "bg-black" : "bg-gray-50"
      } min-h-screen transition-colors`}
    >
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
            Shopping Cart ({cartItems.length})
          </h1>
        </div>

        {/* Cart Actions */}
        <CartActions
          onSelectAll={handleSelectAll}
          onUnselectAll={handleUnselectAll}
          selectedCount={selectedItems.size}
          totalCount={cartItems.length}
          toggleShowSelected={toggleShowSelected}
          showOnlySelected={showOnlySelected}
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {displayedItems.length === 0 && showOnlySelected ? (
              <div
                className={`p-6 rounded-xl text-center ${
                  isDarkMode
                    ? "bg-gray-800/50 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                No items selected. Select items to display them here.
              </div>
            ) : (
              displayedItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  ticket={item}
                  onRemove={handleRemoveFromCart}
                  isSelected={selectedItems.has(item.cartItemId)}
                  onToggleSelect={handleToggleSelect}
                />
              ))
            )}
          </div>

          <div>
            <CartSummary
              totalAmount={calculateSelectedTotal()}
              itemCount={cartItems.length}
              selectedCount={selectedItems.size}
              onCheckout={handleCheckout}
              isLoading={loading}
              showOnlySelected={showOnlySelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
