// router/index.js
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
import Tickets from "../pages/Staff/Tickets";
import Static from "../pages/Staff/Static";
import Events from "../pages/Staff/Events";
import Category from "../pages/Staff/Category";
import StaffLayout from "../layout/StaffLayout";
import CreateTicket from "../pages/User/Tickets/CreateTicket";

const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
};

const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "about", element: <About /> },
  { path: "verifyemail", element: <VerifyEmail /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "tickets", element: <Ticket /> },
];

const privateRoutes = [
  { path: "tickets/:ticketId", element: <TicketDetailsPage /> },
  { path: "create-ticket", element: <CreateTicket /> },
  { path: "profile", element: <Profile /> },
  { path: "cart", element: <Cart /> },
  {
    path: "chat",
    children: [
      { index: true, element: <ChatsPage /> },
      { path: ":userId", element: <ChatsPage /> },
    ],
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      {
        element: <PrivateRoute allowedRoles={[ROLES.MEMBER]} />,
        children: privateRoutes,
      },
    ],
  },
  {
    path: "/staff",
    element: <PrivateRoute allowedRoles={[ROLES.STAFF]} />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          { path: "tickets", element: <Tickets /> },
          { path: "static", element: <Static /> },
          { path: "category", element: <Category /> },
          { path: "events", element: <Events /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
