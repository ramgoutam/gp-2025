import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDesignInfoStatus = (scriptId: string) => {
  const [isDesignInfoCompleted, setIsDesignInfoCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkDesignInfoStatus = async () => {
      try {
        const { data: reportCard, error } = await supabase
          .from('report_cards')
          .select('design_info_status')
          .eq('lab_script_id', scriptId)
          .maybeSingle();

        if (error) throw error;

        setIsDesignInfoCompleted(reportCard?.design_info_status === 'completed');
      } catch (error) {
        console.error('Error checking design info status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDesignInfoStatus();
  }, [scriptId]);

  const validateDesignInfoStatus = () => {
    if (!isDesignInfoCompleted) {
      toast({
        title: "Cannot Start Manufacturing",
        description: "Please complete the design information first.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    isDesignInfoCompleted,
    isLoading,
    validateDesignInfoStatus
  };
};