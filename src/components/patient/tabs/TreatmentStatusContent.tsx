import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-inner">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-500">No treatment data available</p>
          <p className="text-sm text-gray-400">Please add treatment information to see status</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'upper':
      case 'lower':
        return 'bg-primary/5 text-primary border-primary/20 shadow-sm shadow-primary/5';
      case 'dual':
        return 'bg-secondary/10 text-secondary border-secondary/20 shadow-sm shadow-secondary/5';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100';
    }
  };

  // Get the latest lab script for preview data
  const latestScript = labScripts[0];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-gray-50">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary/5 text-primary">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Treatment Status
                </h2>
                <p className="text-sm text-gray-500 mt-1">Current treatment progress and details</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(localPatientData.treatment_type)} 
                px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 
                hover:scale-105 uppercase tracking-wide`}
            >
              {localPatientData.treatment_type?.replace('_', ' ')}
            </Badge>
          </div>

          <Separator className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

          <TreatmentPreviewCards
            surgeryDate={latestScript?.request_date}
            deliveryDate={latestScript?.due_date}
            status={latestScript?.status}
            upperAppliance={localPatientData.upper_treatment}
            lowerAppliance={localPatientData.lower_treatment}
            nightguard={latestScript?.appliance_type === "Nightguard" ? "Yes" : "No"}
            shade={latestScript?.screw_type}
            screw={latestScript?.screw_type}
          />

          <div className="grid gap-6">
            <Card className="overflow-hidden border border-gray-100/50 hover:border-primary/20 transition-all duration-300 group">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">Active Treatment Plan</h3>
                    <p className="text-sm text-gray-500">Detailed treatment information and progress</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-3 
                    hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      Upper Treatment
                      <span className="h-1 w-1 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors duration-300" />
                    </p>
                    <p className="font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {localPatientData.upper_treatment || 'None specified'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-3 
                    hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      Lower Treatment
                      <span className="h-1 w-1 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors duration-300" />
                    </p>
                    <p className="font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {localPatientData.lower_treatment || 'None specified'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};