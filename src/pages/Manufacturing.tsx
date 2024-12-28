import { useState } from "react";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { ManufacturingCards } from "@/components/manufacturing/ManufacturingCards";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";

const Manufacturing = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
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

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  const getFilteredScripts = () => {
    if (!activeFilter) return manufacturingData.scripts;
    
    const filterMap = {
      'inhouse-printing': (s: any) => s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Printing',
      'inhouse-milling': (s: any) => s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Milling',
      'outsource-printing': (s: any) => s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Printing',
      'outsource-milling': (s: any) => s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Milling'
    };

    const filterFn = filterMap[activeFilter as keyof typeof filterMap];
    return filterFn ? manufacturingData.scripts.filter(filterFn) : manufacturingData.scripts;
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <ManufacturingHeader />
      
      <ManufacturingCards 
        manufacturingData={manufacturingData}
        activeFilter={activeFilter}
        onCardClick={handleCardClick}
      />
      
      <div className="mt-8">
        <ManufacturingQueue scripts={getFilteredScripts()} />
      </div>
    </div>
  );
};

export default Manufacturing;