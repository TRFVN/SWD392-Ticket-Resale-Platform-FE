import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function PrivateRoute({ allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = Cookies.get("accessToken");
      const isAuthenticated = !!accessToken;

      if (!isAuthenticated) {
        toast.error("You need to log in to access this page.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
      }
      // Xóa phần kiểm tra role vì chúng ta không có thông tin về role từ access token
    };

    checkAuth();
  }, [navigate, location]);

  return <Outlet />;
}

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
