import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function PrivateRoute({ allowedRoles }) {
  const { decodedToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = !!decodedToken?.role;
      const hasRequiredRole = allowedRoles
        ? allowedRoles.includes(decodedToken?.role)
        : true;

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
      } else if (!hasRequiredRole) {
        toast.error("You do not have permission to access this page.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/", { replace: true });
      }
    };

    checkAuth();
  }, [decodedToken, allowedRoles, navigate, location]);

  return <Outlet />;
}

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
