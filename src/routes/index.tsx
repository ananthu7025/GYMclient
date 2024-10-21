import React from "react";
import Login from "../pages/Login/index";
import Home from "../pages/Home";
import FranchisePage from "../pages/Franchises";
import FranchiseForm from "../pages/Franchises/FranchiseForm";
import GymPage from "../pages/Gym";
import GymForm from "../pages/Gym/GymForm";
import MembershipList from "../pages/MembershipPlans";
import MembershipForm from "../pages/MembershipPlans/MembershipForm";
import TarinerList from "../pages/Trainer";
import TrainerForm from "../pages/Trainer/TrainerForm";
import MemberList from "../pages/Member";
import MemberForm from "../pages/Member/MemberForm";
import WorkoutForm from "../pages/WorkoutPlans";
import WorkoutplanList from "../pages/WorkoutPlans/WorkoutPlanList";
import DietPlan from "../pages/DietPlan/DietForm";
import DietPlans from "../pages/DietPlan";

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
    layout: false, 
  },
  {
    path: "/super-admin/dashboard",
    element: <Home />,
    protected: true,
    layout: true, 
  },
  {
    path: "/franchises",
    element: <FranchisePage />,
    protected: true,
    layout: true, 
  },
  {
    path: "/add-franchise",
    element: <FranchiseForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-franchise/:id",
    element: <FranchiseForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/gyms",
    element: <GymPage />,
    protected: true,
    layout: true, 
  },
  {
    path: "/add-gym",
    element: <GymForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-gym/:id",
    element: <GymForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/memberships",
    element: <MembershipList />,
    protected: true,
    layout: true, 
  },
  {
    path: "/add-membership",
    element: <MembershipForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-membership/:id",
    element: <MembershipForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/trainers",
    element: <TarinerList />,
    protected: true,
    layout: true, 
  },
  {
    path: "/add-trainer",
    element: <TrainerForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-trainer/:id",
    element: <TrainerForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/members",
    element: <MemberList />,
    protected: true,
    layout: true, 
  },
  {
    path: "/add-member",
    element: <MemberForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-member/:id",
    element: <MemberForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/add-workout",
    element: <WorkoutForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/workoutplan",
    element: <WorkoutplanList />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-workout/:id",
    element: <WorkoutForm />,
    protected: true,
    layout: true, 
  },
  {
    path: "/dietplan/add",
    element: <DietPlan />,
    protected: true,
    layout: true, 
  },
  {
    path: "/edit-diet-plan/:id",
    element: <DietPlan />,
    protected: true,
    layout: true, 
  },
  {
    path: "/dietplans",
    element: <DietPlans />,
    protected: true,
    layout: true, 
  },
];
