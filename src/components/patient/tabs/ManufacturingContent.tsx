import React, { useState, useEffect } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmptyManufacturingState } from "./manufacturing/ManufacturingCard";
import { ManufacturingSteps } from "./manufacturing/ManufacturingSteps";
import { ScriptInfo } from "./manufacturing/ScriptInfo";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

interface ManufacturingLog {
  lab_script_id: string;
  manufacturing_status: string;
  sintering_status: string;
  miyo_status: string;
  inspection_status: string;
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
        const { data: logs, error } = await supabase
          .from('manufacturing_logs')
          .select('*')
          .in('lab_script_id', manufacturingScripts.map(s => s.id));

        if (error) throw error;

        const newManufacturingStatus: { [key: string]: string } = {};
        const newSinteringStatus: { [key: string]: string } = {};
        const newMiyoStatus: { [key: string]: string } = {};
        const newInspectionStatus: { [key: string]: string } = {};

        logs.forEach(log => {
          newManufacturingStatus[log.lab_script_id] = log.manufacturing_status;
          newSinteringStatus[log.lab_script_id] = log.sintering_status;
          newMiyoStatus[log.lab_script_id] = log.miyo_status;
          newInspectionStatus[log.lab_script_id] = log.inspection_status;
        });

        setManufacturingStatus(newManufacturingStatus);
        setSinteringStatus(newSinteringStatus);
        setMiyoStatus(newMiyoStatus);
        setInspectionStatus(newInspectionStatus);
      } catch (error) {
        console.error('Error fetching manufacturing logs:', error);
      }
    };

    fetchManufacturingLogs();

    const channel = supabase
      .channel('manufacturing-updates')
      .on<ManufacturingLog>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturing_logs',
          filter: `lab_script_id=in.(${manufacturingScripts.map(s => `'${s.id}'`).join(',')})`
        },
        (payload: RealtimePostgresChangesPayload<ManufacturingLog>) => {
          console.log('Real-time update received:', payload);
          if (payload.new && 'lab_script_id' in payload.new) {
            const newData = payload.new as ManufacturingLog;
            
            setManufacturingStatus(prev => ({
              ...prev,
              [newData.lab_script_id]: newData.manufacturing_status
            }));
            setSinteringStatus(prev => ({
              ...prev,
              [newData.lab_script_id]: newData.sintering_status
            }));
            setMiyoStatus(prev => ({
              ...prev,
              [newData.lab_script_id]: newData.miyo_status
            }));
            setInspectionStatus(prev => ({
              ...prev,
              [newData.lab_script_id]: newData.inspection_status
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

  const handleStartInspection = async (scriptId: string) => {
    console.log('Starting inspection process for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteInspection = async (scriptId: string) => {
    console.log('Completing inspection process for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleHoldInspection = async (scriptId: string) => {
    console.log('Holding inspection process for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'on_hold' }));
  };

  const handleResumeInspection = async (scriptId: string) => {
    console.log('Resuming inspection process for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
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
                    onStartInspection={handleStartInspection}
                    onCompleteInspection={handleCompleteInspection}
                    onHoldInspection={handleHoldInspection}
                    onResumeInspection={handleResumeInspection}
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