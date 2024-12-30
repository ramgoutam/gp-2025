import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { StatsCards } from "@/components/manufacturing/StatsCards";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Circle, CheckCircle2, AlertCircle, Pause, Play, XCircle } from "lucide-react";

const Manufacturing = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0
    },
    scripts: []
  }} = useManufacturingData();

  const filteredScripts = selectedType
    ? manufacturingData.scripts.filter(script => {
        const manufacturingSource = script.manufacturingSource?.toLowerCase();
        const manufacturingType = script.manufacturingType?.toLowerCase();
        const type = `${manufacturingSource}_${manufacturingType}`;
        return type === selectedType;
      })
    : manufacturingData.scripts;

  const getFilterIcon = (filter: string) => {
    switch (filter.toLowerCase()) {
      case 'all':
        return <Filter className="h-4 w-4" />;
      case 'pending':
        return <Circle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'on hold':
        return <Pause className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const getFilterColor = (filter: string) => {
    switch (filter.toLowerCase()) {
      case 'all':
        return 'text-primary hover:text-primary/80 border-primary/20';
      case 'pending':
        return 'text-yellow-600 hover:text-yellow-500 border-yellow-200';
      case 'completed':
        return 'text-green-600 hover:text-green-500 border-green-200';
      case 'rejected':
        return 'text-red-600 hover:text-red-500 border-red-200';
      default:
        return 'text-blue-600 hover:text-blue-500 border-blue-200';
    }
  };

  const renderFilters = () => {
    if (selectedType === 'inhouse_printing') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Printing', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
              <Button
                key={`printing-${filter}`}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 bg-transparent hover:bg-transparent ${getFilterColor(filter)}`}
              >
                {getFilterIcon(filter)}
                {filter}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    if (selectedType === 'inhouse_milling') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Milling', 'Sintering', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
              <Button
                key={`milling-${filter}`}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 bg-transparent hover:bg-transparent ${getFilterColor(filter)}`}
              >
                {getFilterIcon(filter)}
                {filter}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <StatsCards
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        scripts={manufacturingData.scripts}
      />
      
      {/* Filter Buttons Section */}
      {selectedType && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {renderFilters()}
        </div>
      )}

      <ManufacturingQueue scripts={filteredScripts} />
    </div>
  );
};

export default Manufacturing;