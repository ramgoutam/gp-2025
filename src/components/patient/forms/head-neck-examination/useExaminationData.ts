import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useExaminationData = (patientId: string) => {
  const [existingData, setExistingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        console.log("Fetching examination data for patient:", patientId);
        const { data, error } = await supabase
          .from('head_neck_examinations')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        console.log("Fetched examination data:", data);
        setExistingData(data);
      } catch (error) {
        console.error("Error fetching examination data:", error);
        toast({
          title: "Error",
          description: "Failed to load existing examination data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchExistingData();
    }
  }, [patientId]);

  return { existingData, isLoading };
};