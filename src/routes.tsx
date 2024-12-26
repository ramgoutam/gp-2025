import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />, // Assuming you have a Home component
  },
  {
    path: "/dashboard",
    element: <Dashboard />, // Assuming you have a Dashboard component
  },
  // Add other routes as necessary
]);
