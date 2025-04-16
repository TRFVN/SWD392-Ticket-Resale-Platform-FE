// router/index.js
import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import NotFound from "../pages/auth/NotFound";
import PrivateRoute from "./PrivateRoute";

// Lazy loaded components
const Home = lazy(() => import("../pages/home/Home"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const Login = lazy(() => import("../pages/auth/Login"));
const About = lazy(() => import("../pages/About/About"));
const Ticket = lazy(() => import("../pages/tickets"));
const Profile = lazy(() => import("../pages/userprofile/Profile"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Cart = lazy(() => import("../pages/cart/cart"));
const ChatsPage = lazy(() => import("../pages/Chatspage"));
const TicketDetailsPage = lazy(() => import("../pages/tickets/TicketDetails"));
const Tickets = lazy(() => import("../pages/Staff/Tickets"));
const Static = lazy(() => import("../pages/Staff/Static"));
const Category = lazy(() => import("../pages/Staff/Category"));
const StaffLayout = lazy(() => import("../layout/StaffLayout"));
const CreateTicket = lazy(() => import("../pages/User/Tickets/CreateTicket"));
const MyTicketsPage = lazy(() => import("../pages/User/Tickets/MyTickets"));
const EventsPage = lazy(() => import("../pages/tickets/Events/Event"));
const EventDetails = lazy(() => import("../pages/tickets/Events/EventDetails"));
const Checkout = lazy(() => import("../pages/checkout/Checkout"));
const OrderConfirmation = lazy(() =>
  import("../pages/order-confirmation/orderconfirmation"),
);
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const CreateEventPage = lazy(() => import("../pages/CreateEvent/CreateEvent"));
const MyEvents = lazy(() => import("../pages/tickets/Events/MyEvents"));
const EditEvent = lazy(() => import("../pages/tickets/Events/EditEvent"));
const MenteeGathering = lazy(() =>
  import("../pages/mentee-gathering/MenteeGathering"),
);
const MissUniverseEvent = lazy(() =>
  import("../pages/miss-universe-event/MissUniverseEvent"),
);
const CriticalThinkingEvent = lazy(() =>
  import("../pages/critical-thinking-event/CriticalThinkingEvent"),
);
const ManagerLayout = lazy(() => import("../layout/ManagerLayout"));
const ManagerDashboard = lazy(() => import("../pages/Manager/Dashboard"));
const ManagerCategory = lazy(() => import("../pages/Manager/Category"));
const ManagerEvent = lazy(() => import("../pages/Manager/Event"));
const ManagerTicket = lazy(() => import("../pages/Manager/Ticket"));
const ManagerAccount = lazy(() => import("../pages/Manager/Account"));
const ManagerMessage = lazy(() => import("../pages/Manager/Message"));
const ManagerReport = lazy(() => import("../pages/Manager/Report"));
const ManagerSetting = lazy(() => import("../pages/Manager/Setting"));

// Loading component
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-orange-500 border-t-transparent"></div>
  </div>
);

// Add display name for the component
LoadingFallback.displayName = "LoadingFallback";

const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
  ORGANIZATION: "ORGANIZATION",
  MANAGER: "MANAGER",
};

// Wrap component with Suspense
const withSuspense = (Component) => {
  const SuspenseWrapper = (props) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
  SuspenseWrapper.displayName = `withSuspense(${
    Component.displayName || Component.name || "Component"
  })`;
  return SuspenseWrapper;
};

const publicRoutes = [
  { index: true, element: withSuspense(Home)() },
  { path: "login", element: withSuspense(Login)() },
  { path: "signup", element: withSuspense(SignUp)() },
  { path: "about", element: withSuspense(About)() },
  { path: "verify-email", element: withSuspense(VerifyEmail)() },
  { path: "forgot-password", element: withSuspense(ForgotPassword)() },
  { path: "reset-password", element: withSuspense(ResetPassword)() },
  { path: "mentee-gathering", element: withSuspense(MenteeGathering)() },
  { path: "miss-universe-event", element: withSuspense(MissUniverseEvent)() },
  {
    path: "/critical-thinking-event",
    element: withSuspense(CriticalThinkingEvent)(),
  },
  {
    path: "chat",
    children: [
      { index: true, element: withSuspense(ChatsPage)() },
      { path: ":userId", element: withSuspense(ChatsPage)() },
    ],
  },
  { path: "tickets", element: withSuspense(Ticket)() },
  { path: "events", element: withSuspense(EventsPage)() },
  { path: "events/:eventId", element: withSuspense(EventDetails)() },
];

const privateRoutes = [
  { path: "tickets/:ticketId", element: withSuspense(TicketDetailsPage)() },
  { path: "create-ticket", element: withSuspense(CreateTicket)() },
  { path: "profile", element: withSuspense(Profile)() },
  { path: "cart", element: withSuspense(Cart)() },
  { path: "my-tickets", element: withSuspense(MyTicketsPage)() },
  { path: "checkout", element: withSuspense(Checkout)() },
  {
    path: "order-confirmation/:orderId",
    element: withSuspense(OrderConfirmation)(),
  },
];

// Routes only for organization users (non-members)
const organizationRoutes = [
  { path: "create-event", element: withSuspense(CreateEventPage)() },
  { path: "my-events", element: withSuspense(MyEvents)() },
  { path: "events/edit/:eventId", element: withSuspense(EditEvent)() },
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
      {
        element: (
          <PrivateRoute
            allowedRoles={[ROLES.ORGANIZATION, ROLES.ADMIN, ROLES.MANAGER]}
          />
        ),
        children: organizationRoutes,
      },
    ],
  },
  {
    path: "/manager",
    element: <PrivateRoute allowedRoles={[ROLES.MANAGER]} />,
    children: [
      {
        element: withSuspense(ManagerLayout)(),
        children: [
          { path: "", element: withSuspense(ManagerDashboard)() },
          { path: "dashboard", element: withSuspense(ManagerDashboard)() },
          { path: "category", element: withSuspense(ManagerCategory)() },
          { path: "event", element: withSuspense(ManagerEvent)() },
          { path: "account", element: withSuspense(ManagerAccount)() },
          { path: "report", element: withSuspense(ManagerReport)() },
          { path: "ticket", element: withSuspense(ManagerTicket)() },
          { path: "message", element: withSuspense(ManagerMessage)() },
          { path: "setting", element: withSuspense(ManagerSetting)() },
        ],
      },
    ],
  },
  {
    path: "/staff",
    element: <PrivateRoute allowedRoles={[ROLES.STAFF]} />,
    children: [
      {
        element: withSuspense(StaffLayout)(),
        children: [
          { path: "tickets", element: withSuspense(Tickets)() },
          { path: "static", element: withSuspense(Static)() },
          { path: "category", element: withSuspense(Category)() },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
