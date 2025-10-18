import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const NonAuthLayout = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuthLayout;
