import React from "react";
import Login from "../pages/Login/index";
import Home from "../pages/Home";
import FranchisePage from "../pages/Franchises";
import FranchiseForm from "../pages/Franchises/FranchiseForm";
import GymPage from "../pages/Gym";
import GymForm from "../pages/Gym/GymForm";

interface Route {
  path: string;
  element: React.ReactNode;
  protected?: boolean; // Optional for clarity
  layout?: boolean; // Optional for layout management
}

export const routes: Route[] = [
  {
    path: "/",
    element: <Login />,
    layout: false, // No layout for login
  },
  {
    path: "/super-admin/dashboard",
    element: <Home />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
  {
    path: "/franchises",
    element: <FranchisePage />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
  {
    path: "/add-franchise",
    element: <FranchiseForm />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
  {
    path: "/edit-franchise/:id",
    element: <FranchiseForm />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
  {
    path: "/gyms",
    element: <GymPage />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
  {
    path: "/add-gym",
    element: <GymForm />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
  {
    path: "/edit-gym/:id",
    element: <GymForm />,
    protected: true, // Protected route
    layout: true, // No layout for login
  },
];
