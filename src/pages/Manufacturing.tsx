import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";
import { useState } from "react";

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

  const {
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus,
  } = useManufacturingLogs(manufacturingData.scripts);

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
      <div className="text-2xl font-bold">Manufacturing Queue</div>
    </div>
  );
};

export default Manufacturing;