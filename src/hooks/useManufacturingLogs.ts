import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManufacturingLog, StatusMap } from "@/types/manufacturing";
import { LabScript } from "@/types/labScript";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useManufacturingLogs = (manufacturingScripts: LabScript[]) => {
  const [manufacturingStatus, setManufacturingStatus] = useState<StatusMap>({});
  const [sinteringStatus, setSinteringStatus] = useState<StatusMap>({});
  const [miyoStatus, setMiyoStatus] = useState<StatusMap>({});
  const [inspectionStatus, setInspectionStatus] = useState<StatusMap>({});

  useEffect(() => {
    const fetchManufacturingLogs = async () => {
      try {
        const { data: logs, error } = await supabase
          .from('manufacturing_logs')
          .select('*')
          .in('lab_script_id', manufacturingScripts.map(s => s.id));

        if (error) throw error;

        const newManufacturingStatus: StatusMap = {};
        const newSinteringStatus: StatusMap = {};
        const newMiyoStatus: StatusMap = {};
        const newInspectionStatus: StatusMap = {};

        logs?.forEach(log => {
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
      supabase.removeChannel(channel);
    };
  }, [manufacturingScripts]);

  return {
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus,
    setManufacturingStatus,
    setSinteringStatus,
    setMiyoStatus,
    setInspectionStatus
  };
};