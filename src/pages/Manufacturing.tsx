import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { StatsCards } from "@/components/manufacturing/StatsCards";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  const renderFilters = () => {
    if (selectedType === 'inhouse_printing') {
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Printing Filters</h4>
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Printing', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
              <Button
                key={`printing-${filter}`}
                variant="outline"
                size="sm"
                className="bg-white"
              >
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
          <h4 className="text-sm font-medium text-gray-500">Milling Filters</h4>
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Milling', 'Sintering', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
              <Button
                key={`milling-${filter}`}
                variant="outline"
                size="sm"
                className="bg-white"
              >
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