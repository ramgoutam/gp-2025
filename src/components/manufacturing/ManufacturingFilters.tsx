import { Button } from "@/components/ui/button";
import { Filter, CheckCircle2, XCircle, Printer, Paintbrush, ClipboardCheck, AlertCircle } from "lucide-react";

interface ManufacturingFiltersProps {
  selectedFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export const ManufacturingFilters = ({
  selectedFilter,
  onFilterChange,
}: ManufacturingFiltersProps) => {
  const filters = [
    { id: null, label: "All", icon: Filter },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
    { id: "incomplete", label: "Incomplete", icon: XCircle },
    { id: "printing", label: "Printing", icon: Printer },
    { id: "miyo", label: "Miyo", icon: Paintbrush },
    { id: "inspection", label: "Inspection", icon: ClipboardCheck },
    { id: "rejected", label: "Rejected", icon: AlertCircle },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.label}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};