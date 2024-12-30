import { LabScriptsCards } from "./cards/LabScriptsCards";
import { ReportStatusCards } from "./cards/ReportStatusCards";
import { ManufacturingCards } from "./cards/ManufacturingCards";

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <LabScriptsCards />
      </div>
      <div className="space-y-4">
        <ReportStatusCards />
        <ManufacturingCards />
      </div>
    </div>
  );
};