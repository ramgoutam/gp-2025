import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { StatusMap } from "@/types/manufacturing";

interface ManufacturingQueueProps {
  scripts: LabScript[];
  manufacturingStatus: StatusMap;
  sinteringStatus: StatusMap;
  miyoStatus: StatusMap;
  inspectionStatus: StatusMap;
}

export const ManufacturingQueue = () => {
  return (
    <Card className="p-4">
      <div className="text-center text-gray-500">
        No manufacturing items available
      </div>
    </Card>
  );
};