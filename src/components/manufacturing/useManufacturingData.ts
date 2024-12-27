import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";

export const useManufacturingData = () => {
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
      console.log('Fetching manufacturing data');
      
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select(`
          id,
          request_number,
          doctor_name,
          clinic_name,
          request_date,
          due_date,
          status,
          manufacturing_source,
          manufacturing_type,
          created_at,
          updated_at
        `);

      if (error) {
        console.error("Error fetching manufacturing data:", error);
        throw error;
      }

      // Map database fields to LabScript type
      const mappedScripts = scripts.map(script => mapDatabaseLabScript(script));

      const inhousePrinting = mappedScripts.filter(s => 
        s.manufacturingSource === 'inhouse' && s.manufacturingType === 'printing'
      );

      const inhouseMilling = mappedScripts.filter(s => 
        s.manufacturingSource === 'inhouse' && s.manufacturingType === 'milling'
      );

      const outsourcePrinting = mappedScripts.filter(s => 
        s.manufacturingSource === 'outsource' && s.manufacturingType === 'printing'
      );

      const outsourceMilling = mappedScripts.filter(s => 
        s.manufacturingSource === 'outsource' && s.manufacturingType === 'milling'
      );

      return {
        counts: {
          inhousePrinting: inhousePrinting.length,
          inhouseMilling: inhouseMilling.length,
          outsourcePrinting: outsourcePrinting.length,
          outsourceMilling: outsourceMilling.length,
          total: mappedScripts.length
        },
        scripts: mappedScripts
      };
    },
    refetchInterval: 1000
  });
};