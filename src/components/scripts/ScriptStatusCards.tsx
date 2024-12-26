import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScriptStatusCardsProps {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
}

export const ScriptStatusCards = ({ onFilterChange, activeFilter }: ScriptStatusCardsProps) => {
  const statuses = [
    { label: "All", value: null },
    { label: "Incomplete", value: "incomplete" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "On Hold", value: "hold" },
    { label: "Paused", value: "paused" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      {statuses.map((status) => (
        <Card
          key={status.label}
          className={cn(
            "p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200",
            activeFilter === status.value && "bg-blue-50 border-blue-200"
          )}
          onClick={() => onFilterChange(status.value)}
        >
          <p className="text-sm font-medium text-center">{status.label}</p>
        </Card>
      ))}
    </div>
  );
};