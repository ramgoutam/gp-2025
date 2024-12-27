import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useManufacturingData = () => {
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
      console.log('Fetching manufacturing data');
      
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select('id, request_number, doctor_name, manufacturing_source, manufacturing_type, due_date, status');

      if (error) {
        console.error("Error fetching manufacturing data:", error);
        throw error;
      }

      const inhousePrinting = scripts.filter(s => 
        s.manufacturing_source === 'inhouse' && s.manufacturing_type === 'printing'
      );

      const inhouseMilling = scripts.filter(s => 
        s.manufacturing_source === 'inhouse' && s.manufacturing_type === 'milling'
      );

      const outsourcePrinting = scripts.filter(s => 
        s.manufacturing_source === 'outsource' && s.manufacturing_type === 'printing'
      );

      const outsourceMilling = scripts.filter(s => 
        s.manufacturing_source === 'outsource' && s.manufacturing_type === 'milling'
      );

      return {
        counts: {
          inhousePrinting: inhousePrinting.length,
          inhouseMilling: inhouseMilling.length,
          outsourcePrinting: outsourcePrinting.length,
          outsourceMilling: outsourceMilling.length,
          total: scripts.length
        },
        scripts
      };
    },
    refetchInterval: 1000
  });
};