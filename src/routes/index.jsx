import { createBrowserRouter } from "react-router-dom";
// import Home from "../pages/Home/Home";
import SignUp from "../pages/auth/SignUp";
import RootLayout from "../layout/RootLayout";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import About from "../pages/About/About";
import Ticket from "../pages/tickets";
import NotFound from "../pages/auth/NotFound";
import Profile from "../pages/userprofile/Profile";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "about", element: <About /> },
      { path: "tickets", element: <Ticket /> },
      { path: "notfound", element: <NotFound /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
