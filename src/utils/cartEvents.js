// Cart event system to update cart count across components
const CART_UPDATED_EVENT = "cart-updated";

// Create a custom event to notify when cart is updated
export const notifyCartUpdated = () => {
  const event = new CustomEvent(CART_UPDATED_EVENT);
  window.dispatchEvent(event);
};

// Subscribe to cart update events
export const subscribeToCartUpdates = (callback) => {
  window.addEventListener(CART_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
  };
};
