import { getAllFilters } from "@/http/api";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import AbnRecordsTable from "@/components/AbnRecordsTable";
import type { FilterData } from "@/types/abnRecord.types";

const DashboardPage = () => {
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filterData, setFilterData] = useState<FilterData | null>(null);

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

  return (
    <div className="h-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            ABN Registry Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Search and explore Australian Business Number records
          </p>
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
