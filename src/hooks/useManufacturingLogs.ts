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

  const fetchManufacturingLogs = async () => {
    try {
      if (manufacturingScripts.length === 0) return;

      console.log("Fetching manufacturing logs for scripts:", manufacturingScripts.map(s => s.id));

      const { data: logs, error } = await supabase
        .from('manufacturing_logs')
        .select('*')
        .in('lab_script_id', manufacturingScripts.map(s => s.id));

      if (error) throw error;

      console.log("Retrieved manufacturing logs:", logs);

      const newManufacturingStatus: StatusMap = {};
      const newSinteringStatus: StatusMap = {};
      const newMiyoStatus: StatusMap = {};
      const newInspectionStatus: StatusMap = {};

      logs?.forEach(log => {
        newManufacturingStatus[log.lab_script_id] = log.manufacturing_status || 'pending';
        newSinteringStatus[log.lab_script_id] = log.sintering_status || 'pending';
        newMiyoStatus[log.lab_script_id] = log.miyo_status || 'pending';
        newInspectionStatus[log.lab_script_id] = log.inspection_status || 'pending';
      });

      setManufacturingStatus(newManufacturingStatus);
      setSinteringStatus(newSinteringStatus);
      setMiyoStatus(newMiyoStatus);
      setInspectionStatus(newInspectionStatus);
    } catch (error) {
      console.error('Error fetching manufacturing logs:', error);
    }
  };

  useEffect(() => {
    fetchManufacturingLogs();

    // Set up real-time subscription
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
          console.log("Received real-time update for manufacturing log:", payload);
          
          if (payload.new && 'lab_script_id' in payload.new) {
            const newData = payload.new;
            const scriptId = newData.lab_script_id;
            
            setManufacturingStatus(prev => ({
              ...prev,
              [scriptId]: newData.manufacturing_status || 'pending'
            }));
            setSinteringStatus(prev => ({
              ...prev,
              [scriptId]: newData.sintering_status || 'pending'
            }));
            setMiyoStatus(prev => ({
              ...prev,
              [scriptId]: newData.miyo_status || 'pending'
            }));
            setInspectionStatus(prev => ({
              ...prev,
              [scriptId]: newData.inspection_status || 'pending'
            }));
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up manufacturing logs subscription");
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