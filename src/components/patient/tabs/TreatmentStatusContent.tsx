import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Stethoscope } from "lucide-react";

interface TreatmentStatusProps {
  labScripts: LabScript[];
  patientData?: {
    treatment_type?: string;
    upper_treatment?: string;
    lower_treatment?: string;
  };
}

export const TreatmentStatusContent = ({ patientData }: TreatmentStatusProps) => {
  if (!patientData?.treatment_type) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No treatment data available</p>
        </div>
      </Card>
    );
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'upper':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'lower':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'dual':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'upper':
      case 'lower':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dual':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Treatment Status</h2>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(patientData.treatment_type)} px-3 py-1`}
          >
            {patientData.treatment_type?.replace('_', ' ')}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-6">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Current Treatment</h3>
                  </div>
                </div>
                {getStatusIcon(patientData.treatment_type)}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Upper Treatment</p>
                  <p>{patientData.upper_treatment || 'None specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Lower Treatment</p>
                  <p>{patientData.lower_treatment || 'None specified'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};