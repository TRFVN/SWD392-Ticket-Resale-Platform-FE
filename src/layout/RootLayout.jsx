import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { HiOutlineBars3 } from "react-icons/hi2";
import Banner from "../components/common/Banner";
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
    <div className="min-h-screen flex bg-white text-black">
      <div className="flex flex-col flex-grow min-h-screen">
        <div className="sticky top-0 z-50 bg-white ">
          <Header />
        </div>
        <Banner />
        <main className="flex-grow w-full mt-8 px-64 overflow-y-auto">
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
