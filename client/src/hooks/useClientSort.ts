import { useState, useMemo } from "react";
import type { SortColumn, SortDirection, AbnRecord } from "@/types/abnRecord.types";
import { sortRecords } from "@/utils/abnRecord.utils";

interface UseClientSortReturn {
  sortedRecords: AbnRecord[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  handleColumnSort: (column: SortColumn) => void;
  resetSort: () => void;
}

export const useClientSort = (records: AbnRecord[]): UseClientSortReturn => {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleColumnSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const resetSort = () => {
    setSortColumn(null);
    setSortDirection(null);
  };

  const sortedRecords = useMemo(
    () => sortRecords(records, sortColumn, sortDirection),
    [records, sortColumn, sortDirection]
  );

  return {
    sortedRecords,
    sortColumn,
    sortDirection,
    handleColumnSort,
    resetSort,
  };
};

