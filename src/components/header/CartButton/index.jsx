import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "../../../config/axiosConfig";
import { subscribeToCartUpdates } from "../../../utils/cartEvents";

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

  // Badge animation variants
  const badgeVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 25 },
    },
    exit: { scale: 0 },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
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

        {/* Badge with animation */}
        {cartCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={badgeVariants}
            key={cartCount} // Key change will trigger animation on count change
          >
            {cartCount > 99 ? "99+" : cartCount}
          </motion.span>
        )}
      </button>
    </motion.div>
  );
};

export default CartButton;
