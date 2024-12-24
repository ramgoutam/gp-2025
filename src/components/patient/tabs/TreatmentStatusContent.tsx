import React from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";

interface TreatmentStatusProps {
  labScripts: LabScript[];
}

export const TreatmentStatusContent = ({ labScripts }: TreatmentStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'hold':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold">Treatment Progress</h3>
          <p className="text-sm text-gray-500">Overview of all treatment statuses</p>
        </div>
        
        <div className="space-y-4">
          {labScripts.map((script) => (
            <div 
              key={script.id} 
              className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-all"
            >
              <div className="space-y-1">
                <p className="font-medium">Request #{script.request_number || script.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  Requested: {new Date(script.request_date).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(script.status)}`}>
                {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};