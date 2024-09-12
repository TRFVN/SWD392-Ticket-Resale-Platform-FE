import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
function PrivateRoute({ allowedRoles }) {
  const { decodedToken: currentUser } = useSelector((state) => state.auth);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let redirect = false;
    const isAuthenticated =
      !!currentUser && !!currentUser.auth.decodedToken.role;
    const hasRequiredRole = allowedRoles
      ? allowedRoles.includes(currentUser?.auth?.decodedToken?.role)
      : true;

    if (!isAuthenticated || !hasRequiredRole) {
      redirect = true;
      setTimeout(() => {
        if (!isAuthenticated) {
          navigate("/login", {
            state: {
              showNotification: true,
              message: "You need to log in to access this page.",
            },
          });
        } else if (!hasRequiredRole) {
          navigate(-1, {
            state: {
              showNotification: true,
              message: "You do not have permission to access this page.",
            },
          });
        }
      }, 500);
    }

    setShouldRedirect(redirect);
  }, [currentUser, allowedRoles, navigate]);

  if (shouldRedirect) {
    return null;
  }

  return <Outlet />;
}

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
