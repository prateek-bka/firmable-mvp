import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SortColumn, SortDirection } from "@/types/abnRecord.types";

interface SortableTableHeaderProps {
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

const getSortIcon = (
  column: SortColumn,
  sortColumn: SortColumn,
  sortDirection: SortDirection
) => {
  if (sortColumn !== column) {
    return <span className="ml-2 opacity-50 text-xs">⇅</span>;
  }
  if (sortDirection === "asc") {
    return <span className="ml-2 text-blue-600 text-sm">↑</span>;
  }
  return <span className="ml-2 text-blue-600 text-sm">↓</span>;
};

const headerConfig = [
  { column: "abn" as SortColumn, label: "ABN", minWidth: "140px" },
  {
    column: "mainName" as SortColumn,
    label: "Business Name",
    minWidth: "220px",
  },
  {
    column: "entityType" as SortColumn,
    label: "Entity Type",
    minWidth: "170px",
  },
  { column: "status" as SortColumn, label: "Status", minWidth: "120px" },
  { column: "state" as SortColumn, label: "State", minWidth: "100px" },
  { column: "gstStatus" as SortColumn, label: "GST", minWidth: "120px" },
  {
    column: "recordLastUpdated" as SortColumn,
    label: "Last Updated",
    minWidth: "150px",
  },
];

export const SortableTableHeader = ({
  sortColumn,
  sortDirection,
  onSort,
}: SortableTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {headerConfig.map(({ column, label, minWidth }) => (
          <TableHead
            key={column}
            className="cursor-pointer hover:bg-gray-50 select-none"
            style={{ minWidth }}
            onClick={() => onSort(column)}
          >
            <div className="flex items-center">
              {label}
              {getSortIcon(column, sortColumn, sortDirection)}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
