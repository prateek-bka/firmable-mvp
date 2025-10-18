import { useState, useCallback, useEffect } from "react";
import { getAllAbnRecords } from "@/http/api";
import { toast } from "@/lib/toast";
import type { AbnRecord, FetchParams } from "@/types/abnRecord.types";

interface UseAbnRecordsReturn {
  records: AbnRecord[];
  loading: boolean;
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  fetchRecords: () => Promise<void>;
}

interface UseAbnRecordsParams {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  selectedStatus: string;
  selectedState: string;
  selectedEntityType: string;
  selectedGstStatus: string;
  selectedSort: string;
}

export const useAbnRecords = (
  params: UseAbnRecordsParams
): UseAbnRecordsReturn => {
  const [records, setRecords] = useState<AbnRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const fetchParams: FetchParams = {
        page: params.currentPage,
        limit: params.pageSize,
        sort: params.selectedSort,
      };

      if (params.searchQuery.trim()) {
        fetchParams.q = params.searchQuery.trim();
      }
      if (params.selectedStatus) {
        fetchParams.status = params.selectedStatus;
      }
      if (params.selectedState) {
        fetchParams.state = params.selectedState;
      }
      if (params.selectedEntityType) {
        fetchParams.entityType = params.selectedEntityType;
      }
      if (params.selectedGstStatus) {
        fetchParams.gst = params.selectedGstStatus;
      }

      const response = await getAllAbnRecords(fetchParams);
      const { businesses, pagination } = response.data.data;

      setRecords(businesses);
      setTotalPages(pagination.pages);
      setTotalRecords(pagination.total);
      setCurrentPage(pagination.page);
    } catch (error) {
      toast.error(
        "Failed to fetch ABN records",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [
    params.currentPage,
    params.pageSize,
    params.searchQuery,
    params.selectedStatus,
    params.selectedState,
    params.selectedEntityType,
    params.selectedGstStatus,
    params.selectedSort,
  ]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    totalPages,
    totalRecords,
    currentPage,
    fetchRecords,
  };
};

