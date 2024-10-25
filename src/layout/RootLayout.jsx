import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import Header from "../components/layout/Header";
import BreadCrumb from "../components/common/BreadCrumb";

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const LoaderWrapper = () => (
  <div
    className="flex items-center justify-center min-h-[60vh] sm:min-h-screen 
    dark:bg-gray-900 p-4 sm:p-0"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader />
    </motion.div>
  </div>
);

const AuthLayout = () => (
  <div className="min-h-screen dark:bg-gray-900 transition-colors duration-200">
    <Suspense fallback={<LoaderWrapper />}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="p-4 sm:p-0"
      >
        <Outlet />
      </motion.div>
    </Suspense>
  </div>
);
const MainLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");

  return (
    <div
      className="min-h-screen flex flex-col bg-white dark:bg-gray-900 
      text-gray-900 dark:text-gray-100 transition-colors duration-200 w-full overflow-x-hidden"
    >
      <Header />

      <main
        className={`
        flex-grow w-full 
        ${isProfilePage ? "px-4" : "px-4 sm:px-6 lg:px-8"} 
        pt-16 sm:pt-20
        max-w-[100vw]
        overflow-x-hidden
      `}
      >
        <Suspense fallback={<LoaderWrapper />}>
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="w-full max-w-[100vw] overflow-x-hidden"
          >
            {!isProfilePage && (
              <div className="mb-4">
                <BreadCrumb />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </motion.div>
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

  // Handle dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDarkMode]);

  // Handle scroll behavior
  useEffect(() => {
    const handleBodyScroll = () => {
      const isMobileMenuOpen = document.body.classList.contains("menu-open");
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("resize", handleBodyScroll);
    return () => window.removeEventListener("resize", handleBodyScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isAuthPage ? "auth" : "main"}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {isAuthPage ? <AuthLayout /> : <MainLayout />}
      </motion.div>
    </AnimatePresence>
  );
};

export default RootLayout;
