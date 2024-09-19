import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { HiOutlineBars3 } from "react-icons/hi2";
function RootLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [showSidebar, setShowSidebar] = useState(false);
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
      {showSidebar && (
        <div className="fixed left-0 top-0 h-full">
          <Sidebar />
        </div>
      )}

      <div
        className={`flex flex-col flex-grow ${
          showSidebar && "ml-64"
        } min-h-screen`}
      >
        {!showSidebar && <HiOutlineBars3 />}
        <div className="">
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
