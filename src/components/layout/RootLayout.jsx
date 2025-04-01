import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// Lazy load components that are not immediately needed
const ToastContainer = lazy(() => import("../common/ToastContainer"));
const LoadingSpinner = lazy(() => import("../common/LoadingSpinner"));

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Container */}
      <Suspense>
        <ToastContainer />
      </Suspense>

      {/* Loading Spinner */}
      <Suspense>
        <LoadingSpinner />
      </Suspense>
    </div>
  );
};

export default RootLayout;
