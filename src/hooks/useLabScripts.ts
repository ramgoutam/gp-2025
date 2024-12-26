import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const fetchLabScripts = async (statusFilter: string | null) => {
  console.log("Fetching lab scripts with filter:", statusFilter);
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error("No valid session found:", sessionError);
    throw new Error("Authentication required");
  }

  let query = supabase
    .from('lab_scripts')
    .select(`
      *,
      patient:patients(first_name, last_name)
    `);

  if (statusFilter === 'incomplete') {
    query = query.in('status', ['pending', 'in_progress', 'paused', 'hold']);
  } else if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: scripts, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching lab scripts:", error);
    throw error;
  }

  return scripts.map(script => ({
    id: script.id,
    requestNumber: script.request_number,
    patientId: script.patient_id,
    patientFirstName: script.patient?.first_name,
    patientLastName: script.patient?.last_name,
    doctorName: script.doctor_name,
    clinicName: script.clinic_name,
    requestDate: script.request_date,
    dueDate: script.due_date,
    status: script.status as LabScript["status"],
    upperTreatment: script.upper_treatment,
    lowerTreatment: script.lower_treatment,
    upperDesignName: script.upper_design_name,
    lowerDesignName: script.lower_design_name,
    applianceType: script.appliance_type,
    screwType: script.screw_type,
    vdoOption: script.vdo_option,
    specificInstructions: script.specific_instructions,
  } as LabScript));
};

export const useLabScripts = (statusFilter: string | null) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['labScripts', statusFilter],
    queryFn: () => fetchLabScripts(statusFilter),
    refetchInterval: 1000,
    retry: 1,
    meta: {
      errorMessage: "Failed to load lab scripts",
    },
    onSuccess: (data: LabScript[]) => {
      console.log("Successfully fetched lab scripts:", data);
    },
    onError: (error: Error) => {
      console.error("Error fetching lab scripts:", error);
      if (error.message === "Authentication required") {
        navigate("/login");
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please sign in again to continue.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load lab scripts. Please try again.",
        });
      }
    }
  });
};