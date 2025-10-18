import { getAllFilters } from "@/http/api";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import AbnRecordsTable from "@/components/AbnRecordsTable";
import type { FilterData } from "@/types/abnRecord.types";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filterData, setFilterData] = useState<FilterData | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const getAllFilterOptions = async () => {
    setLoadingFilters(true);
    try {
      const response = await getAllFilters();
      setFilterData(response.data.data);
    } catch (error) {
      toast.error(
        "Failed to fetch filters",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoadingFilters(false);
    }
  };

  useEffect(() => {
    getAllFilterOptions();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out", "See you soon!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed", "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              ABN Registry Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Search and explore Australian Business Number records
            </p>
            {user && (
              <p className="text-sm text-muted-foreground mt-1">
                Welcome, {user.name || user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {loadingFilters ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            <span className="ml-3 text-lg">Loading...</span>
          </div>
        ) : (
          <AbnRecordsTable filterData={filterData} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
