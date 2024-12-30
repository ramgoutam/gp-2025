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

  return (
    <div className="container mx-auto p-6 space-y-4">
      <StatsCards
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        scripts={manufacturingData.scripts}
      />
      
      {/* Filter Buttons Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">
        {/* Printing Filters */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-700">Printing Filters</h3>
          
          {/* Inhouse Printing Filters */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Inhouse Printing</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Printing', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
                <Button
                  key={`inhouse-printing-${filter}`}
                  variant="outline"
                  size="sm"
                  className="bg-white"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Outsource Printing Filters */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Outsource Printing</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Printing', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
                <Button
                  key={`outsource-printing-${filter}`}
                  variant="outline"
                  size="sm"
                  className="bg-white"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Milling Filters */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-700">Milling Filters</h3>
          
          {/* Inhouse Milling Filters */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Inhouse Milling</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Milling', 'Sintering', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
                <Button
                  key={`inhouse-milling-${filter}`}
                  variant="outline"
                  size="sm"
                  className="bg-white"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Outsource Milling Filters */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Outsource Milling</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Milling', 'Sintering', 'Miyo', 'Inspection', 'Rejected', 'Completed'].map((filter) => (
                <Button
                  key={`outsource-milling-${filter}`}
                  variant="outline"
                  size="sm"
                  className="bg-white"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ManufacturingQueue scripts={filteredScripts} />
    </div>
  );
};

export default Manufacturing;