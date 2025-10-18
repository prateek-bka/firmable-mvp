import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      richColors
      expand={false}
      closeButton
      duration={4000}
    />
  </>
);
