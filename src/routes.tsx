import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  // Add other routes as necessary
]);