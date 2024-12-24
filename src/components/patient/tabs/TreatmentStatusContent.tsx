import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Stethoscope, Calendar, Info } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { format } from "date-fns";

interface TreatmentStatusProps {
  labScripts: LabScript[];
}

export const TreatmentStatusContent = ({ labScripts }: TreatmentStatusProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (labScripts.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 space-y-3">
          <Info className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="text-gray-500">No treatments available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Treatment Status</h2>
          <Badge variant="outline" className="px-3 py-1">
            {labScripts.length} Treatment{labScripts.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <Separator />

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-6 pr-4">
            {labScripts.map((script) => (
              <Card key={script.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{script.applianceType || 'Treatment'}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(script.status)} px-2`}
                        >
                          {script.status?.replace('_', ' ') || 'pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {format(new Date(script.requestDate), "MMM dd, yyyy")}</span>
                        <span>•</span>
                        <span>Due: {format(new Date(script.dueDate), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                    {getStatusIcon(script.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Upper Treatment</p>
                      <p>{script.upperTreatment || 'None specified'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Lower Treatment</p>
                      <p>{script.lowerTreatment || 'None specified'}</p>
                    </div>
                  </div>

                  {script.specificInstructions && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                      <p className="text-sm text-gray-600">{script.specificInstructions}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};