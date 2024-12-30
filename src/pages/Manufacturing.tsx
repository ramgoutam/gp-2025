import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { StatsCards } from "@/components/manufacturing/StatsCards";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";
import { ManufacturingFilters } from "@/components/manufacturing/ManufacturingFilters";
import { useState } from "react";

const Manufacturing = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
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

  const filteredScripts = manufacturingData.scripts.filter(script => {
    // First apply the type filter (if any)
    if (selectedType) {
      const manufacturingSource = script.manufacturingSource?.toLowerCase();
      const manufacturingType = script.manufacturingType?.toLowerCase();
      const type = `${manufacturingSource}_${manufacturingType}`;
      if (type !== selectedType) return false;
    }

    // Then apply the stage filter (if any)
    if (selectedFilter) {
      const log = script.manufacturingLog;
      switch (selectedFilter) {
        case 'completed':
          return log?.manufacturing_status === 'completed' &&
                 log?.miyo_status === 'completed' &&
                 log?.inspection_status === 'completed';
        case 'incomplete':
          return log?.manufacturing_status !== 'completed' ||
                 log?.miyo_status !== 'completed' ||
                 log?.inspection_status !== 'completed';
        case 'printing':
          return log?.manufacturing_status === 'in_progress';
        case 'miyo':
          return log?.miyo_status === 'in_progress';
        case 'inspection':
          return log?.inspection_status === 'in_progress';
        case 'rejected':
          return log?.manufacturing_status === 'rejected' ||
                 log?.miyo_status === 'rejected' ||
                 log?.inspection_status === 'rejected';
        default:
          return true;
      }
    }
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-4">
      <StatsCards
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        scripts={manufacturingData.scripts}
      />
      <ManufacturingFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <ManufacturingQueue scripts={filteredScripts} />
    </div>
  );
};

export default Manufacturing;