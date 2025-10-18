import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsInfoProps {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  displayedCount: number;
  onPageSizeChange: (size: number) => void;
}

export const ResultsInfo = ({
  currentPage,
  pageSize,
  totalRecords,
  displayedCount,
  onPageSizeChange,
}: ResultsInfoProps) => {
  const startRecord = displayedCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        Showing {startRecord} to {endRecord} of {totalRecords} records
      </div>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
          <SelectItem value="100">100 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
