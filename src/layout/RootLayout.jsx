import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import Sidebar from "../components/layout/sidebar";
import Header from "../components/layout/header";

function RootLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return (
      //   <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white w-full">
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
      //   </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow ml-64 min-h-screen">
        <div className="fixed top-0 right-0 left-64 z-10">
          <Header />
        </div>
        <main className="flex-grow w-full mt-16 overflow-y-auto">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default RootLayout;
