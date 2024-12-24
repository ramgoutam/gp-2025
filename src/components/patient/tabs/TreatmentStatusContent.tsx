import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TreatmentPreviewCards } from "./treatment-status/TreatmentPreviewCards";

interface TreatmentStatusProps {
  labScripts: LabScript[];
  patientData?: {
    id?: string;
    treatment_type?: string;
    upper_treatment?: string;
    lower_treatment?: string;
    surgery_date?: string;
  };
}

export const TreatmentStatusContent = ({ patientData, labScripts }: TreatmentStatusProps) => {
  const { toast } = useToast();
  const [localPatientData, setLocalPatientData] = React.useState(patientData);

  console.log("Initial treatment status data:", patientData);

  useEffect(() => {
    if (!patientData?.id) return;

    const channel = supabase
      .channel('patient-treatment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
          filter: `id=eq.${patientData.id}`
        },
        (payload) => {
          console.log("Received real-time update:", payload);
          const updatedPatient = payload.new;
          setLocalPatientData(updatedPatient);
          
          toast({
            title: "Treatment Status Updated",
            description: "The treatment information has been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientData?.id]);

  if (!localPatientData?.treatment_type) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-inner">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium text-gray-500">No treatment data available</p>
          <p className="text-sm text-gray-400">Please add treatment information to see status</p>
        </div>
      </Card>
    );
  }

  // Get the latest lab script for preview data
  const latestScript = labScripts[0];

  // Find the latest completed lab script with a completed report card
  const latestCompletedScript = labScripts
    ?.filter(script => 
      script.status === 'completed' && 
      script.reportCard?.status === 'completed' &&
      script.reportCard?.design_info &&
      script.reportCard?.clinical_info
    )
    .sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    )[0];

  console.log("Latest completed script with report card:", latestCompletedScript);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-blue-50">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Treatment Status
                </h2>
                <p className="text-sm text-gray-500 mt-1">Current treatment progress and details</p>
              </div>
            </div>
          </div>

          <TreatmentPreviewCards
            surgeryDate={localPatientData.surgery_date}
            deliveryDate={latestScript?.dueDate}
            status={latestScript?.status}
            upperAppliance={localPatientData.upper_treatment}
            lowerAppliance={localPatientData.lower_treatment}
            nightguard={latestScript?.applianceType === "Nightguard" ? "Yes" : "No"}
            patientId={localPatientData.id}
            labScripts={labScripts}
            onUpdate={() => {
              // Refresh the patient data
              if (patientData?.id) {
                supabase
                  .from('patients')
                  .select('*')
                  .eq('id', patientData.id)
                  .single()
                  .then(({ data, error }) => {
                    if (!error && data) {
                      setLocalPatientData(data);
                    }
                  });
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
};