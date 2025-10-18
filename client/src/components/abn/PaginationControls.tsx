import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}: PaginationControlsProps) => {
  const getVisiblePages = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (page) => {
        return (
          page === currentPage ||
          page === currentPage - 1 ||
          page === currentPage + 1 ||
          (currentPage <= 2 && page <= 3) ||
          (currentPage >= totalPages - 1 && page >= totalPages - 2)
        );
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {/* First Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
          className="px-3"
        >
          &laquo; First
        </Button>

        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || loading}
          className="px-3"
        >
          <ArrowLeft /> Prev
        </Button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {currentPage > 3 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="w-10"
              >
                1
              </Button>
              {currentPage > 4 && (
                <span className="flex items-center px-2">...</span>
              )}
            </>
          )}

          {getVisiblePages().map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
              className="w-10"
            >
              {page}
            </Button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="flex items-center px-2">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-10"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || loading}
          className="px-3"
        >
          Next <ArrowRight />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="px-3"
        >
          Last &raquo;
        </Button>
      </div>
    </div>
  );
};
