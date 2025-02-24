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
import Category from "../pages/Staff/Category";
import StaffLayout from "../layout/StaffLayout";
import CreateTicket from "../pages/User/Tickets/CreateTicket";
import MyTicketsPage from "../pages/User/Tickets/MyTickets";
import EventsPage from "../pages/tickets/Events/Event";
import EventDetails from "../pages/tickets/Events/EventDetails";
const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
  ORGANIZATION: "ORGANIZATION",
};

const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "about", element: <About /> },
  { path: "verifyemail", element: <VerifyEmail /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "tickets", element: <Ticket /> },
  { path: "events", element: <EventsPage /> },
  { path: "events/:eventId", element: <EventDetails /> }, // Thêm dòng này
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
  { path: "mytickets", element: <MyTicketsPage /> },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      {
        element: (
          <PrivateRoute allowedRoles={[ROLES.CUSTOMER || ROLES.ORGANIZATION]} />
        ),
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
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
