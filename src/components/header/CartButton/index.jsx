import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "../../../config/axiosConfig";
import { subscribeToCartUpdates } from "../../../utils/cartEvents";

/**
 * Cart button with simplified modern design
 */
const CartButton = () => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  // Fetch cart items count
  const fetchCartCount = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/Cart");

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        setCartCount(response.data.result.length);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Set up polling to refresh cart count every minute
    const intervalId = setInterval(fetchCartCount, 60000);

    // Subscribe to cart update events
    const unsubscribe = subscribeToCartUpdates(() => {
      fetchCartCount();
    });

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative transition-transform duration-200 hover:scale-105">
      <button
        onClick={() => navigate("/cart")}
        className={`p-2 rounded-full transition-colors ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-300"
            : "hover:bg-gray-100 text-gray-700"
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500`}
        aria-label={`Shopping cart with ${cartCount} items`}
      >
        <ShoppingCart className="w-5 h-5" />

        {/* Badge - simplified */}
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default CartButton;
