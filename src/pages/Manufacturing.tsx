import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { StatsCards } from "@/components/manufacturing/StatsCards";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  CircleDot, 
  Printer, 
  Paintbrush, 
  CheckCircle2, 
  XCircle,
  Microscope,
  Wrench,
  Clock 
} from "lucide-react";

const Manufacturing = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      inhouseMiyo: 0,
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

  const getFilteredScripts = () => {
    if (activeFilter === 'all') return filteredScripts;

    return filteredScripts.filter(script => {
      const manufacturingLog = script.manufacturingLogs?.[0];
      if (!manufacturingLog) return activeFilter === 'ready for printing';

      const { 
        manufacturing_status,
        miyo_status,
        inspection_status,
        inspection_hold_reason 
      } = manufacturingLog;

      switch (activeFilter) {
        case 'ready for printing':
          return manufacturing_status === 'pending';
        case 'in_progress':
          // Only show items that are in active stages and not completed or rejected
          return (
            (manufacturing_status === 'in_progress') || // In printing
            (manufacturing_status === 'completed' && miyo_status === 'in_progress') || // In miyo
            (miyo_status === 'completed' && inspection_status === 'in_progress') // In inspection
          );
        case 'printing':
          return manufacturing_status === 'in_progress' && script.manufacturingType === 'Printing';
        case 'milling':
          return manufacturing_status === 'in_progress' && script.manufacturingType === 'Milling';
        case 'miyo':
          return manufacturing_status === 'completed' && miyo_status !== 'completed';
        case 'inspection':
          return miyo_status === 'completed' && inspection_status !== 'completed' && inspection_status !== 'on_hold';
        case 'completed':
          return inspection_status === 'completed';
        case 'rejected':
          return inspection_status === 'on_hold' && !!inspection_hold_reason;
        default:
          return true;
      }
    });
  };

  const getFilterCount = (filterName: string) => {
    return filteredScripts.filter(script => {
      const manufacturingLog = script.manufacturingLogs?.[0];
      if (!manufacturingLog) return filterName.toLowerCase() === 'ready for printing';

      const { 
        manufacturing_status,
        miyo_status,
        inspection_status,
        inspection_hold_reason 
      } = manufacturingLog;

      switch (filterName.toLowerCase()) {
        case 'ready for printing':
          return manufacturing_status === 'pending';
        case 'in progress':
          return (
            (manufacturing_status === 'in_progress') || // In printing
            (manufacturing_status === 'completed' && miyo_status === 'in_progress') || // In miyo
            (miyo_status === 'completed' && inspection_status === 'in_progress') // In inspection
          );
        case 'printing':
          return manufacturing_status === 'in_progress' && script.manufacturingType === 'Printing';
        case 'miyo':
          return manufacturing_status === 'completed' && miyo_status !== 'completed';
        case 'inspection':
          return miyo_status === 'completed' && inspection_status !== 'completed' && inspection_status !== 'on_hold';
        default:
          return false;
      }
    }).length;
  };

  const renderFilters = () => {
    if (selectedType === 'inhouse_printing') {
      return ['All', 'Ready for Printing', 'In Progress', 'Printing', 'Miyo', 'Inspection', 'Rejected', 'Completed'];
    }

    if (selectedType === 'inhouse_milling') {
      return ['All', 'Pending', 'Milling', 'Miyo', 'Inspection', 'Rejected', 'Completed'];
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
      
      {selectedType && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2">
            {renderFilters()?.map((filter) => {
              const shouldShowCount = ['Ready for Printing', 'In Progress', 'Printing', 'Miyo', 'Inspection'].includes(filter);
              const count = shouldShowCount ? getFilterCount(filter) : null;
              
              return (
                <Button
                  key={`filter-${filter}`}
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveFilter(filter.toLowerCase())}
                  className={`flex items-center gap-2 bg-transparent hover:bg-transparent ${getFilterColor(filter)} 
                    ${activeFilter === filter.toLowerCase() ? 'ring-2 ring-primary' : ''}`}
                >
                  {getFilterIcon(filter)}
                  {filter}
                  {count !== null && (
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <ManufacturingQueue scripts={getFilteredScripts()} />
    </div>
  );
};

export default Manufacturing;
