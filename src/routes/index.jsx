import { createBrowserRouter } from "react-router-dom";
// import Home from "../pages/Home/Home";
import SignUp from "../pages/auth/SignUp";
import RootLayout from "../layout/RootLayout";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import About from "../pages/About/About";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "about", element: <About /> },
    ],
  },
]);
