// components/routes/PrivateRoute.jsx
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const findRoleFromToken = (decodedToken) => {
  const roleKey = Object.keys(decodedToken).find((key) =>
    key.toLowerCase().includes("role"),
  );
  return roleKey ? decodedToken[roleKey] : null;
};
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
        return;
      }

      if (allowedRoles?.length > 0) {
        const decodedTokenStr = localStorage.getItem("decodedToken");
        if (!decodedTokenStr) return;

        const decodedToken = JSON.parse(decodedTokenStr);
        // Tìm role động
        const userRole = findRoleFromToken(decodedToken);

        console.log("Current Role:", userRole);

        if (!userRole || !allowedRoles.includes(userRole)) {
          toast.error("You don't have permission to access this page.", {
            position: "top-center",
            autoClose: 5000,
          });
          navigate("/", { replace: true });
        }
      }
    };

    checkAuth();
  }, [navigate, location, allowedRoles]);

  return <Outlet />;
}

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
