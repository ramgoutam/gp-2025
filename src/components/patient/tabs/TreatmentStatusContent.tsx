import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "@/types/labScript";
import { Database } from "lucide-react";

interface TreatmentStatusProps {
  labScripts: LabScript[];
}

export const TreatmentStatusContent = ({ labScripts }: TreatmentStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const sortedScripts = [...labScripts].sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Treatment Status Overview</h3>
            <p className="text-sm text-gray-500">Comprehensive view of all treatments and their details</p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-6 pr-4">
            {sortedScripts.map((script) => (
              <div 
                key={script.id}
                className="bg-white rounded-lg border p-6 space-y-4 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium">
                      Request #{script.requestNumber || script.id.slice(0, 8)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Requested: {new Date(script.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(script.status)}`}
                  >
                    {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Treatment Type</p>
                      <p className="mt-1">{script.applianceType || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Latest Design Names</p>
                      <div className="mt-1 space-y-1">
                        <p>Upper: {script.upperDesignName || 'Not specified'}</p>
                        <p>Lower: {script.lowerDesignName || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {script.clinicalInfo && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Latest Material & Shade</p>
                          <div className="mt-1 space-y-1">
                            <p>Material: {script.clinicalInfo.material || 'Not specified'}</p>
                            <p>Shade: {script.clinicalInfo.shade || 'Not specified'}</p>
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Latest Screw Type</p>
                      <p className="mt-1">{script.screwType || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};