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
          // Show items that are in printing, miyo, or inspection stages, excluding completed/rejected items
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
          // Show in Miyo tab if manufacturing is completed and miyo is not completed
          return manufacturing_status === 'completed' && miyo_status !== 'completed';
        case 'inspection':
          // Show in Inspection tab if miyo is completed and inspection is not completed or rejected
          return miyo_status === 'completed' && inspection_status !== 'completed' && inspection_status !== 'on_hold';
        case 'completed':
          return inspection_status === 'completed';
        case 'rejected':
          // Show in Rejected tab if inspection is on hold (rejected) and has a reason
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
            (manufacturing_status === 'in_progress') ||
            (manufacturing_status === 'completed' && miyo_status !== 'completed') ||
            (miyo_status === 'completed' && inspection_status !== 'completed' && inspection_status !== 'on_hold')
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

  const getFilterIcon = (filter: string) => {
    switch (filter.toLowerCase()) {
      case 'all':
        return <Filter className="h-4 w-4" />;
      case 'ready for printing':
        return <CircleDot className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'printing':
        return <Printer className="h-4 w-4" />;
      case 'milling':
        return <Wrench className="h-4 w-4" />;
      case 'miyo':
        return <Paintbrush className="h-4 w-4" />;
      case 'inspection':
        return <Microscope className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <CircleDot className="h-4 w-4" />;
    }
  };

  const getFilterColor = (filter: string) => {
    switch (filter.toLowerCase()) {
      case 'all':
        return 'text-primary hover:text-primary/80 border-primary/20';
      case 'ready for printing':
        return 'text-yellow-600 hover:text-yellow-500 border-yellow-200';
      case 'in_progress':
        return 'text-blue-600 hover:text-blue-500 border-blue-200';
      case 'printing':
        return 'text-blue-600 hover:text-blue-500 border-blue-200';
      case 'milling':
        return 'text-purple-600 hover:text-purple-500 border-purple-200';
      case 'miyo':
        return 'text-orange-600 hover:text-orange-500 border-orange-200';
      case 'inspection':
        return 'text-cyan-600 hover:text-cyan-500 border-cyan-200';
      case 'completed':
        return 'text-green-600 hover:text-green-500 border-green-200';
      case 'rejected':
        return 'text-red-600 hover:text-red-500 border-red-200';
      default:
        return 'text-gray-600 hover:text-gray-500 border-gray-200';
    }
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