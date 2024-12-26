import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useScriptQuery = (statusFilter: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['labScripts', statusFilter],
    queryFn: async () => {
      console.log("Fetching lab scripts with filter:", statusFilter);
      try {
        let query = supabase
          .from('lab_scripts')
          .select(`
            *,
            patient:patients(first_name, last_name)
          `);

        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }

        const { data: scripts, error } = await query
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase error fetching lab scripts:", error);
          toast({
            title: "Error fetching scripts",
            description: "Please check your connection and try again",
            variant: "destructive"
          });
          throw error;
        }

        console.log("Successfully fetched scripts:", scripts?.length || 0);
        return scripts || [];
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });
};