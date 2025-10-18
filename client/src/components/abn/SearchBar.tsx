import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
  loading: boolean;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onReset,
  loading,
}: SearchBarProps) => {
  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <Input
        placeholder="Search by ABN or business name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={loading}>
        Search
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={loading}
      >
        Reset All
      </Button>
    </form>
  );
};
