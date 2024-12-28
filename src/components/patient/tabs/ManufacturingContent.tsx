import React, { useState, useEffect } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmptyManufacturingState } from "./manufacturing/ManufacturingCard";
import { ManufacturingSteps } from "./manufacturing/ManufacturingSteps";
import { ScriptInfo } from "./manufacturing/ScriptInfo";
import { supabase } from "@/integrations/supabase/client";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

// Define types for the manufacturing log payload
interface ManufacturingLogPayload {
  lab_script_id: string;
  manufacturing_status: string;
  sintering_status: string;
  miyo_status: string;
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
    // Initial fetch of manufacturing logs
    const fetchManufacturingLogs = async () => {
      try {
        const { data: logs, error } = await supabase
          .from('manufacturing_logs')
          .select('*')
          .in('lab_script_id', manufacturingScripts.map(s => s.id));

        if (error) throw error;

        const newManufacturingStatus: { [key: string]: string } = {};
        const newSinteringStatus: { [key: string]: string } = {};
        const newMiyoStatus: { [key: string]: string } = {};

        logs.forEach(log => {
          newManufacturingStatus[log.lab_script_id] = log.manufacturing_status;
          newSinteringStatus[log.lab_script_id] = log.sintering_status;
          newMiyoStatus[log.lab_script_id] = log.miyo_status;
        });

        setManufacturingStatus(newManufacturingStatus);
        setSinteringStatus(newSinteringStatus);
        setMiyoStatus(newMiyoStatus);
      } catch (error) {
        console.error('Error fetching manufacturing logs:', error);
      }
    };

    fetchManufacturingLogs();

    // Set up real-time subscription
    const channel = supabase
      .channel('manufacturing-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturing_logs',
          filter: `lab_script_id=in.(${manufacturingScripts.map(s => `'${s.id}'`).join(',')})`
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          const { new: newData } = payload;
          
          if (newData) {
            const data = newData as ManufacturingLogPayload;
            setManufacturingStatus(prev => ({
              ...prev,
              [data.lab_script_id]: data.manufacturing_status
            }));
            setSinteringStatus(prev => ({
              ...prev,
              [data.lab_script_id]: data.sintering_status
            }));
            setMiyoStatus(prev => ({
              ...prev,
              [data.lab_script_id]: data.miyo_status
            }));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [manufacturingScripts]);

  const handleStartManufacturing = async (scriptId: string) => {
    console.log('Starting manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    console.log('Completing manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleHoldManufacturing = async (scriptId: string) => {
    console.log('Holding manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'on_hold' }));
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    console.log('Resuming manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
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
                    manufacturingStatus={manufacturingStatus[script.id] || 'pending'}
                    sinteringStatus={sinteringStatus[script.id] || 'pending'}
                    miyoStatus={miyoStatus[script.id] || 'pending'}
                    inspectionStatus={inspectionStatus[script.id] || 'pending'}
                    onStartManufacturing={handleStartManufacturing}
                    onCompleteManufacturing={handleCompleteManufacturing}
                    onHoldManufacturing={handleHoldManufacturing}
                    onResumeManufacturing={handleResumeManufacturing}
                    manufacturingType={script.manufacturingType}
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