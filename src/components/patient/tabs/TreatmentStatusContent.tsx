import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Stethoscope, Activity } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TreatmentStatusProps {
  labScripts: LabScript[];
  patientData?: {
    id?: string;
    treatment_type?: string;
    upper_treatment?: string;
    lower_treatment?: string;
  };
}

export const TreatmentStatusContent = ({ patientData }: TreatmentStatusProps) => {
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
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-500">No treatment data available</p>
          <p className="text-sm text-gray-400">Please add treatment information to see status</p>
        </div>
      </Card>
    );
  }

  const getStatusIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'upper':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'lower':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'dual':
        return <Stethoscope className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'upper':
      case 'lower':
        return 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100';
      case 'dual':
        return 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Treatment Status</h2>
            </div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(localPatientData.treatment_type)} px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200`}
            >
              {localPatientData.treatment_type?.toUpperCase().replace('_', ' ')}
            </Badge>
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-6">
            <Card className="overflow-hidden border border-gray-100 hover:border-primary/20 transition-all duration-200">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">Current Treatment Plan</h3>
                    </div>
                    <p className="text-sm text-gray-500">Active treatment details and progress</p>
                  </div>
                  {getStatusIcon(localPatientData.treatment_type)}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3 hover:bg-gray-50 transition-colors duration-200">
                    <p className="text-sm font-medium text-gray-500">Upper Treatment</p>
                    <p className="font-medium text-gray-900">
                      {localPatientData.upper_treatment || 'None specified'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3 hover:bg-gray-50 transition-colors duration-200">
                    <p className="text-sm font-medium text-gray-500">Lower Treatment</p>
                    <p className="font-medium text-gray-900">
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