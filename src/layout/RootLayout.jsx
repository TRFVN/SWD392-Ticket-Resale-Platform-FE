import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import Header from "../components/layout/Header";
import BreadCrumb from "../components/common/BreadCrumb";

const LoaderWrapper = () => (
  <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
    <Loader />
  </div>
);

const AuthLayout = () => (
  <div className="min-h-screen dark:bg-gray-900 transition-colors duration-200">
    <Suspense fallback={<LoaderWrapper />}>
      <Outlet />
    </Suspense>
  </div>
);

const MainLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <main
        className={`flex-grow w-full ${
          isProfilePage ? "" : "container mx-auto px-4 sm:px-6 lg:px-8"
        } pt-24`}
      >
        <Suspense fallback={<LoaderWrapper />}>
          {!isProfilePage && <BreadCrumb />}
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const RootLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = ["/login", "/signup", "/verifyemail"].includes(pathname);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Sync dark mode class with redux state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return isAuthPage ? <AuthLayout /> : <MainLayout />;
};

export default RootLayout;
