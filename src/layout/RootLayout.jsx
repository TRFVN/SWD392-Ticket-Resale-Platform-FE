import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import Header from "../components/layout/Header";
import BreadCrumb from "../components/common/BreadCrumb";

const AuthLayout = () => (
  <Suspense fallback={<Loader />}>
    <Outlet />
  </Suspense>
);

const MainLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main
        className={`flex-grow w-full ${
          isProfilePage ? "" : "container mx-auto px-4 sm:px-6 lg:px-8"
        } pt-24`}
      >
        <Suspense fallback={<Loader />}>
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

  return isAuthPage ? <AuthLayout /> : <MainLayout />;
};

export default RootLayout;
