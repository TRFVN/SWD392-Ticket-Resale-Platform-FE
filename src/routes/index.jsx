import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import About from "../pages/About/About";
import Ticket from "../pages/tickets";
import NotFound from "../pages/auth/NotFound";
import Profile from "../pages/userprofile/Profile";
import VerifyEmail from "../pages/auth/VerifyEmail";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "about", element: <About /> },
  { path: "verifyemail", element: <VerifyEmail /> },
  { path: "forgot-password", element: <ForgotPassword /> },
];

const privateRoutes = [
  { path: "tickets", element: <Ticket /> },
  { path: "profile", element: <Profile /> },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      {
        element: <PrivateRoute />,
        children: privateRoutes,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
