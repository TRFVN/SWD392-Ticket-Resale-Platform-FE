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
import Cart from "../pages/cart/cart";
import ChatsPage from "../pages/Chatspage";
import TicketDetailsPage from "../pages/tickets/TicketDetails";
// import ReviewTickets from "../pages/Staff/reviewTickets";
const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "about", element: <About /> },
  { path: "verifyemail", element: <VerifyEmail /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  // { path: "review-tickets", element: <ReviewTickets /> },
];

const privateRoutes = [
  { path: "tickets/:ticketId", element: <TicketDetailsPage /> }, // Add this line

  { path: "tickets", element: <Ticket /> },
  { path: "profile", element: <Profile /> },
  { path: "cart", element: <Cart /> },
  { path: "chat/:userId", element: <ChatsPage /> },
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
