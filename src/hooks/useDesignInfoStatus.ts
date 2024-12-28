import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDesignInfoStatus = (labScriptId: string) => {
  const [isDesignInfoCompleted, setIsDesignInfoCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDesignInfoStatus = async () => {
      try {
        const { data: reportCard, error } = await supabase
          .from('report_cards')
          .select('design_info_status')
          .eq('lab_script_id', labScriptId)
          .maybeSingle();

        if (error) {
          console.error('Error checking design info status:', error);
          return;
        }

        setIsDesignInfoCompleted(reportCard?.design_info_status === 'completed');
      } catch (error) {
        console.error('Error in checkDesignInfoStatus:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDesignInfoStatus();
  }, [labScriptId]);

  return { isDesignInfoCompleted, isLoading };
};