import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabScript } from "@/types/labScript";

interface StatsCardsProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  scripts: LabScript[];
  printingFilter: string;
  millingFilter: string;
  onPrintingFilterChange: (value: string) => void;
  onMillingFilterChange: (value: string) => void;
}

const PRINTING_FILTERS = [
  "All",
  "Pending",
  "Printing",
  "Miyo",
  "Inspection",
  "Rejected",
  "Completed"
];

const MILLING_FILTERS = [
  "All",
  "Pending",
  "Milling",
  "Sintering",
  "Miyo",
  "Inspection",
  "Rejected",
  "Completed"
];

export const StatsCards = ({
  selectedType,
  setSelectedType,
  scripts,
  printingFilter,
  millingFilter,
  onPrintingFilterChange,
  onMillingFilterChange
}: StatsCardsProps) => {
  const inhousePrinting = scripts.filter(
    (script) =>
      script.manufacturingSource === "Inhouse" &&
      script.manufacturingType === "Printing"
  ).length;

  const inhouseMilling = scripts.filter(
    (script) =>
      script.manufacturingSource === "Inhouse" &&
      script.manufacturingType === "Milling"
  ).length;

  const outsourcePrinting = scripts.filter(
    (script) =>
      script.manufacturingSource === "Outsource" &&
      script.manufacturingType === "Printing"
  ).length;

  const outsourceMilling = scripts.filter(
    (script) =>
      script.manufacturingSource === "Outsource" &&
      script.manufacturingType === "Milling"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        className={`p-4 cursor-pointer transition-all ${
          selectedType === "inhouse_printing"
            ? "border-primary/50 shadow-lg"
            : "hover:border-gray-300"
        }`}
        onClick={() =>
          setSelectedType(
            selectedType === "inhouse_printing" ? null : "inhouse_printing"
          )
        }
      >
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-gray-500">Inhouse Printing</span>
          <span className="text-2xl font-bold">{inhousePrinting}</span>
          <Select value={printingFilter} onValueChange={onPrintingFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_FILTERS.map((filter) => (
                <SelectItem key={filter} value={filter.toLowerCase()}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card
        className={`p-4 cursor-pointer transition-all ${
          selectedType === "inhouse_milling"
            ? "border-primary/50 shadow-lg"
            : "hover:border-gray-300"
        }`}
        onClick={() =>
          setSelectedType(
            selectedType === "inhouse_milling" ? null : "inhouse_milling"
          )
        }
      >
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-gray-500">Inhouse Milling</span>
          <span className="text-2xl font-bold">{inhouseMilling}</span>
          <Select value={millingFilter} onValueChange={onMillingFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {MILLING_FILTERS.map((filter) => (
                <SelectItem key={filter} value={filter.toLowerCase()}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card
        className={`p-4 cursor-pointer transition-all ${
          selectedType === "outsource_printing"
            ? "border-primary/50 shadow-lg"
            : "hover:border-gray-300"
        }`}
        onClick={() =>
          setSelectedType(
            selectedType === "outsource_printing" ? null : "outsource_printing"
          )
        }
      >
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-gray-500">Outsource Printing</span>
          <span className="text-2xl font-bold">{outsourcePrinting}</span>
          <Select value={printingFilter} onValueChange={onPrintingFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_FILTERS.map((filter) => (
                <SelectItem key={filter} value={filter.toLowerCase()}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card
        className={`p-4 cursor-pointer transition-all ${
          selectedType === "outsource_milling"
            ? "border-primary/50 shadow-lg"
            : "hover:border-gray-300"
        }`}
        onClick={() =>
          setSelectedType(
            selectedType === "outsource_milling" ? null : "outsource_milling"
          )
        }
      >
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-gray-500">Outsource Milling</span>
          <span className="text-2xl font-bold">{outsourceMilling}</span>
          <Select value={millingFilter} onValueChange={onMillingFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {MILLING_FILTERS.map((filter) => (
                <SelectItem key={filter} value={filter.toLowerCase()}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
};