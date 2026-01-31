import { createBrowserRouter } from "react-router";
import MainApp from "./MainApp";
import { WorkoutBuilder } from "./components/workout/WorkoutBuilder";
import { TemplateSelector } from "./components/workout/TemplateSelector";
import { WorkoutCompletion } from "./components/workout/WorkoutCompletion";
import { Streaks } from "./components/Streaks";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainApp,
  },
  {
    path: "/workout/new",
    Component: WorkoutBuilder,
  },
  {
    path: "/workout/new/template",
    Component: WorkoutBuilder,
  },
  {
    path: "/workout/template/:templateId",
    Component: WorkoutBuilder,
  },
  {
    path: "/workout/recent/:workoutId",
    Component: WorkoutBuilder,
  },
  {
    path: "/workout/templates",
    Component: TemplateSelector,
  },
  {
    path: "/workout/complete",
    Component: WorkoutCompletion,
  },
  {
    path: "/streaks",
    Component: Streaks,
  },
]);