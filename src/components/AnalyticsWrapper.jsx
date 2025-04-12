import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logPageView } from "../config/firebase";

export const AnalyticsWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Log page view when location changes
    logPageView(location.pathname);
  }, [location]);

  return children;
};
