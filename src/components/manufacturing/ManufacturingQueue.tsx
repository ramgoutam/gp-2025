import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ManufacturingStatus } from "@/components/manufacturing/ManufacturingStatus";
import { LabScript } from "@/types/labScript";

interface ManufacturingQueueProps {
  scripts: LabScript[];
}

export const ManufacturingQueue = ({ scripts }: ManufacturingQueueProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
      <div className="space-y-4">
        {scripts.map((script) => (
          <div 
            key={script.id} 
            className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-2 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">
                      {script.patientFirstName} {script.patientLastName}
                    </span>
                    <Badge variant="outline" className="bg-white">
                      {script.manufacturingSource} - {script.manufacturingType}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Appliance Numbers: </span>
                    {script.upperDesignName || 'No upper'} | {script.lowerDesignName || 'No lower'}
                  </div>
                  <div>
                    <span className="font-medium">Material: </span>
                    {script.material || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Shade: </span>
                    {script.shade || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {script.manufacturingSource === 'Inhouse' && (
              <div className="border-t pt-4">
                <ManufacturingSteps
                  scriptId={script.id}
                  manufacturingStatus={script.manufacturing_logs?.manufacturing_status || 'pending'}
                  sinteringStatus={script.manufacturing_logs?.sintering_status || 'pending'}
                  miyoStatus={script.manufacturing_logs?.miyo_status || 'pending'}
                  inspectionStatus={script.manufacturing_logs?.inspection_status || 'pending'}
                  manufacturingType={script.manufacturingType}
                />
              </div>
            )}

            <div className="text-sm">
              <ManufacturingStatus 
                manufacturingType={script.manufacturingType}
                manufacturingLogs={script.manufacturing_logs || {
                  manufacturing_status: 'pending',
                  sintering_status: 'pending',
                  miyo_status: 'pending',
                  inspection_status: 'pending'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};