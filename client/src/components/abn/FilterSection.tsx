import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterData } from "@/types/abnRecord.types";

interface FilterSectionProps {
  filterData: FilterData | null;
  selectedStatus: string;
  selectedState: string;
  selectedEntityType: string;
  selectedGstStatus: string;
  selectedSort: string;
  onStatusChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  onGstStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const FilterSection = ({
  filterData,
  selectedStatus,
  selectedState,
  selectedEntityType,
  selectedGstStatus,
  selectedSort,
  onStatusChange,
  onStateChange,
  onEntityTypeChange,
  onGstStatusChange,
  onSortChange,
}: FilterSectionProps) => {
  const filters = [
    {
      value: selectedStatus || "all",
      onChange: (value: string) => onStatusChange(value === "all" ? "" : value),
      placeholder: "All Statuses",
      options: filterData?.statuses || [],
      label: "Statuses",
    },
    {
      value: selectedState || "all",
      onChange: (value: string) => onStateChange(value === "all" ? "" : value),
      placeholder: "All States",
      options: filterData?.states || [],
      label: "States",
    },
    {
      value: selectedEntityType || "all",
      onChange: (value: string) =>
        onEntityTypeChange(value === "all" ? "" : value),
      placeholder: "All Entity Types",
      options: filterData?.entityTypes || [],
      label: "Entity Types",
      isEntityType: true,
    },
    {
      value: selectedGstStatus || "all",
      onChange: (value: string) =>
        onGstStatusChange(value === "all" ? "" : value),
      placeholder: "All GST Status",
      options: filterData?.gstStatuses || [],
      label: "GST Status",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {filters.map((filter, index) => (
        <Select
          key={index}
          value={filter.value}
          onValueChange={filter.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{filter.placeholder}</SelectItem>
            {filter.isEntityType
              ? (filter.options as { code: string; text: string }[]).map(
                  (type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.text}
                    </SelectItem>
                  )
                )
              : (filter.options as string[]).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      ))}

      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {filterData?.sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
