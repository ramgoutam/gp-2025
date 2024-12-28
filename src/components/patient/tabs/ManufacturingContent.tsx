import React, { useState, useEffect } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmptyManufacturingState } from "./manufacturing/ManufacturingCard";
import { ManufacturingSteps } from "./manufacturing/ManufacturingSteps";
import { ScriptInfo } from "./manufacturing/ScriptInfo";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
  const [manufacturingStatus, setManufacturingStatus] = useState<{ [key: string]: string }>({});
  const [sinteringStatus, setSinteringStatus] = useState<{ [key: string]: string }>({});
  const [miyoStatus, setMiyoStatus] = useState<{ [key: string]: string }>({});
  const [inspectionStatus, setInspectionStatus] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const manufacturingScripts = labScripts.filter(script => 
    script.manufacturingSource && script.manufacturingType
  );

  useEffect(() => {
    const fetchManufacturingLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('manufacturing_logs')
          .select('*')
          .in('lab_script_id', manufacturingScripts.map(script => script.id));

        if (error) throw error;

        const statusMap = data.reduce((acc, log) => {
          acc[log.lab_script_id] = {
            manufacturing: log.manufacturing_status,
            sintering: log.sintering_status,
            miyo: log.miyo_status,
            inspection: log.inspection_status,
          };
          return acc;
        }, {});

        // Update all statuses
        setManufacturingStatus(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(statusMap).map(([id, status]) => [id, status.manufacturing])
          ),
        }));
        setSinteringStatus(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(statusMap).map(([id, status]) => [id, status.sintering])
          ),
        }));
        setMiyoStatus(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(statusMap).map(([id, status]) => [id, status.miyo])
          ),
        }));
        setInspectionStatus(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(statusMap).map(([id, status]) => [id, status.inspection])
          ),
        }));
      } catch (error) {
        console.error("Error fetching manufacturing logs:", error);
      }
    };

    if (manufacturingScripts.length > 0) {
      fetchManufacturingLogs();
    }
  }, [manufacturingScripts]);

  const handleStartManufacturing = (scriptId: string) => {
    console.log('Starting manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteManufacturing = (scriptId: string) => {
    console.log('Completing manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleStartSintering = (scriptId: string) => {
    console.log('Starting sintering process for script:', scriptId);
    setSinteringStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteSintering = (scriptId: string) => {
    console.log('Completing sintering process for script:', scriptId);
    setSinteringStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleStartMiyo = (scriptId: string) => {
    console.log('Starting Miyo process for script:', scriptId);
    setMiyoStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteMiyo = (scriptId: string) => {
    console.log('Completing Miyo process for script:', scriptId);
    setMiyoStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
    toast({
      title: "Miyo Process Completed",
      description: "You can now start the inspection process",
    });
  };

  const handleStartInspection = (scriptId: string) => {
    console.log('Starting inspection process for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleRejectInspection = (scriptId: string) => {
    console.log('Rejecting inspection for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'rejected' }));
    toast({
      title: "Inspection Rejected",
      description: "The appliance needs to be revised",
      variant: "destructive"
    });
  };

  const handleApproveInspection = (scriptId: string) => {
    console.log('Approving inspection for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'approved' }));
    toast({
      title: "Inspection Approved",
      description: "The appliance is ready to insert",
    });
  };

  if (manufacturingScripts.length === 0) {
    return <EmptyManufacturingState firstName={patientData.firstName} lastName={patientData.lastName} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {manufacturingScripts.map((script) => (
          <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ScriptInfo
                  applianceType={script.applianceType}
                  upperDesignName={script.upperDesignName}
                  lowerDesignName={script.lowerDesignName}
                  manufacturingSource={script.manufacturingSource}
                  manufacturingType={script.manufacturingType}
                  material={script.material}
                  shade={script.shade}
                />
                {script.manufacturingSource === 'Inhouse' && (
                  <ManufacturingSteps
                    scriptId={script.id}
                    manufacturingStatus={manufacturingStatus}
                    sinteringStatus={sinteringStatus}
                    miyoStatus={miyoStatus}
                    inspectionStatus={inspectionStatus}
                    onStartManufacturing={handleStartManufacturing}
                    onCompleteManufacturing={handleCompleteManufacturing}
                    onStartSintering={handleStartSintering}
                    onCompleteSintering={handleCompleteSintering}
                    onStartMiyo={handleStartMiyo}
                    onCompleteMiyo={handleCompleteMiyo}
                    onStartInspection={handleStartInspection}
                    onRejectInspection={handleRejectInspection}
                    onApproveInspection={handleApproveInspection}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
