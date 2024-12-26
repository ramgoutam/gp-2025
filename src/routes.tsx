import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientProfile from "./pages/PatientProfile";
import { FormBuilder } from "./pages/FormBuilder";
import { FormBuilderEditor } from "./pages/FormBuilderEditor";
import Profile from "./pages/Profile";
import Scripts from "./pages/Scripts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/patients",
    element: <Index />,
  },
  {
    path: "/patients/:id",
    element: <PatientProfile />,
  },
  {
    path: "/form-builder",
    element: <FormBuilder />,
  },
  {
    path: "/form-builder/:id",
    element: <FormBuilderEditor />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/scripts",
    element: <Scripts />,
  },
]);