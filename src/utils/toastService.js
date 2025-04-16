import { toast } from "react-toastify";

// Configure toast options for consistency across the app
const DEFAULT_TOAST_OPTIONS = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  containerId: "toast-container-main",
};

// Toast service that ensures newer toasts override older ones
export const toastService = {
  success: (message) => {
    // Dismiss any existing toasts before showing the new one
    toast.dismiss();
    return toast.success(message, DEFAULT_TOAST_OPTIONS);
  },

  error: (message) => {
    toast.dismiss();
    return toast.error(message, DEFAULT_TOAST_OPTIONS);
  },

  info: (message) => {
    toast.dismiss();
    return toast.info(message, DEFAULT_TOAST_OPTIONS);
  },

  warning: (message) => {
    toast.dismiss();
    return toast.warning(message, DEFAULT_TOAST_OPTIONS);
  },

  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),

  // Custom toast with options override
  custom: (message, options = {}) => {
    toast.dismiss();
    return toast(message, { ...DEFAULT_TOAST_OPTIONS, ...options });
  },
};
