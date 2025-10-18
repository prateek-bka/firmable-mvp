import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FilterData } from "@/types/abnRecord.types";
import { useAbnRecords } from "@/hooks/useAbnRecords";
import { useClientSort } from "@/hooks/useClientSort";
import { SearchBar } from "./abn/SearchBar";
import { FilterSection } from "./abn/FilterSection";
import { ResultsInfo } from "./abn/ResultsInfo";
import { SortableTableHeader } from "./abn/SortableTableHeader";
import { AbnTableRow } from "./abn/AbnTableRow";
import { PaginationControls } from "./abn/PaginationControls";

interface AbnRecordsTableProps {
  filterData: FilterData | null;
}

const AbnRecordsTable = ({ filterData }: AbnRecordsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("");
  const [selectedGstStatus, setSelectedGstStatus] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("abn_asc");

  const {
    records,
    loading,
    totalPages,
    totalRecords,
    currentPage: serverCurrentPage,
    fetchRecords,
  } = useAbnRecords({
    currentPage,
    pageSize,
    searchQuery,
    selectedStatus,
    selectedState,
    selectedEntityType,
    selectedGstStatus,
    selectedSort,
  });

  const {
    sortedRecords,
    sortColumn,
    sortDirection,
    handleColumnSort,
    resetSort,
  } = useClientSort(records);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords();
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedState("");
    setSelectedEntityType("");
    setSelectedGstStatus("");
    setSelectedSort("abn_asc");
    setCurrentPage(1);
    resetSort();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ABN Records Database</CardTitle>
        <CardDescription>
          Search and filter through Australian Business Number records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          <FilterSection
            filterData={filterData}
            selectedStatus={selectedStatus}
            selectedState={selectedState}
            selectedEntityType={selectedEntityType}
            selectedGstStatus={selectedGstStatus}
            selectedSort={selectedSort}
            onStatusChange={setSelectedStatus}
            onStateChange={setSelectedState}
            onEntityTypeChange={setSelectedEntityType}
            onGstStatusChange={setSelectedGstStatus}
            onSortChange={setSelectedSort}
          />

          <ResultsInfo
            currentPage={serverCurrentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            displayedCount={sortedRecords.length}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="relative">
            <div className="md:hidden text-xs text-muted-foreground text-center py-2 bg-gray-50 border-b">
              ← Swipe to scroll → | Click headers to sort
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <SortableTableHeader
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleColumnSort}
                />
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          <span className="ml-3">Loading records...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="text-muted-foreground">
                          No records found matching your criteria
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRecords.map((record) => (
                      <AbnTableRow key={record._id} record={record} />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {!loading && records.length > 0 && (
          <PaginationControls
            currentPage={serverCurrentPage}
            totalPages={totalPages}
            loading={loading}
            onPageChange={setCurrentPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AbnRecordsTable;
