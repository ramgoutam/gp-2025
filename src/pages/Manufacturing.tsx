import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";
import { StatsCards } from "@/components/manufacturing/StatsCards";
import { ManufacturingQueue } from "@/components/manufacturing/ManufacturingQueue";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Manufacturing = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0
    },
    scripts: []
  }, refetch } = useManufacturingData();

  const {
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus,
  } = useManufacturingLogs(manufacturingData.scripts);

  // Set up periodic refetching
  useEffect(() => {
    console.log("Setting up manufacturing data refresh interval");
    const interval = setInterval(() => {
      console.log("Refetching manufacturing data");
      refetch();
      // Also invalidate the manufacturing logs query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['manufacturingLogs'] });
    }, 1000);

    return () => {
      console.log("Cleaning up manufacturing data refresh interval");
      clearInterval(interval);
    };
  }, [refetch, queryClient]);

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
      <ManufacturingQueue
        scripts={filteredScripts}
        manufacturingStatus={manufacturingStatus}
        sinteringStatus={sinteringStatus}
        miyoStatus={miyoStatus}
        inspectionStatus={inspectionStatus}
      />
    </div>
  );
};

export default Manufacturing;