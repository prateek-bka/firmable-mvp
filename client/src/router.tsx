import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);
