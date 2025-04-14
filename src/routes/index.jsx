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
import Checkout from "../pages/checkout/Checkout";
import OrderConfirmation from "../pages/order-confirmation/orderconfirmation";
import ResetPassword from "../pages/auth/ResetPassword";
import CreateEventPage from "../pages/CreateEvent/CreateEvent";
import MyEvents from "../pages/tickets/Events/MyEvents";
import EditEvent from "../pages/tickets/Events/EditEvent";
import MenteeGathering from "../pages/mentee-gathering/MenteeGathering";
import MissUniverseEvent from "../pages/miss-universe-event/MissUniverseEvent";
import CriticalThinkingEvent from "../pages/critical-thinking-event/CriticalThinkingEvent";
import ManagerLayout from "../layout/ManagerLayout";
import ManagerDashboard from "../pages/Manager/Dashboard";
import ManagerCategory from "../pages/Manager/Category";
import ManagerEvent from "../pages/Manager/Event";
import ManagerTicket from "../pages/Manager/Ticket";
import ManagerAccount from "../pages/Manager/Account";
import ManagerMessage from "../pages/Manager/Message";
import ManagerReport from "../pages/Manager/Report";
import ManagerSetting from "../pages/Manager/Setting";
const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
  ORGANIZATION: "ORGANIZATION",
  MANAGER: "MANAGER",
};

const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "about", element: <About /> },
  { path: "verify-email", element: <VerifyEmail /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "mentee-gathering", element: <MenteeGathering /> },
  { path: "miss-universe-event", element: <MissUniverseEvent /> },
  {
    path: "/critical-thinking-event",
    element: <CriticalThinkingEvent />,
  },
  {
    path: "chat",
    children: [
      { index: true, element: <ChatsPage /> },
      { path: ":userId", element: <ChatsPage /> },
    ],
  },
  { path: "tickets", element: <Ticket /> },
  { path: "events", element: <EventsPage /> },
  { path: "events/:eventId", element: <EventDetails /> },
];

const privateRoutes = [
  { path: "tickets/:ticketId", element: <TicketDetailsPage /> },
  { path: "create-ticket", element: <CreateTicket /> },
  { path: "profile", element: <Profile /> },
  { path: "cart", element: <Cart /> },
  // {
  //   path: "chat",
  //   children: [
  //     { index: true, element: <ChatsPage /> },
  //     { path: ":userId", element: <ChatsPage /> },
  //   ],
  // },
  { path: "my-tickets", element: <MyTicketsPage /> },
  { path: "checkout", element: <Checkout /> },
  {
    path: "order-confirmation/:orderId",
    element: <OrderConfirmation />,
  },
  { path: "create-event", element: <CreateEventPage /> },
  { path: "my-events", element: <MyEvents /> },
  { path: "events/edit/:eventId", element: <EditEvent /> },
  { path: "edit-event/:id", element: <div>Edit Event Page (Coming soon)</div> },
  {
    path: "event-tickets/:id",
    element: <div>Event Tickets Page (Coming soon)</div>,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      {
        element: (
          <PrivateRoute allowedRoles={[ROLES.MEMBER, ROLES.ORGANIZATION]} />
        ),
        children: privateRoutes,
      },
    ],
  },
  {
    path: "/manager",
    element: <PrivateRoute allowedRoles={[ROLES.MANAGER]} />,
    children: [
      {
        element: <ManagerLayout />,
        children: [
          { path: "", element: <ManagerDashboard /> },
          { path: "dashboard", element: <ManagerDashboard /> },
          { path: "category", element: <ManagerCategory /> },
          { path: "event", element: <ManagerEvent /> },
          { path: "account", element: <ManagerAccount /> },
          { path: "report", element: <ManagerReport /> },
          { path: "ticket", element: <ManagerTicket /> },
          { path: "message", element: <ManagerMessage /> },
          { path: "setting", element: <ManagerSetting /> },
        ],
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
