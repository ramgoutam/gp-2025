import React, { useState } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory, Play, CheckCircle, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
  const [manufacturingStatus, setManufacturingStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'completed' }>({});
  const [sinteringStatus, setSinteringStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'completed' }>({});
  const [miyoStatus, setMiyoStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'completed' }>({});
  const [inspectionStatus, setInspectionStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'rejected' | 'approved' }>({});
  const { toast } = useToast();
  
  const manufacturingScripts = labScripts.filter(script => 
    script.manufacturingSource && script.manufacturingType
  );

  const handleStartClick = (scriptId: string) => {
    console.log('Starting manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteManufacturing = (scriptId: string) => {
    console.log('Completing manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleStartSintering = (scriptId: string) => {
    console.log('Starting sintering process for script:', scriptId);
    setSinteringStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteSintering = (scriptId: string) => {
    console.log('Completing sintering process for script:', scriptId);
    setSinteringStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleStartMiyo = (scriptId: string) => {
    console.log('Starting Miyo process for script:', scriptId);
    setMiyoStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteMiyo = (scriptId: string) => {
    console.log('Completing Miyo process for script:', scriptId);
    setMiyoStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
    toast({
      title: "Miyo Process Completed",
      description: "You can now start the inspection process",
    });
  };

  const handleStartInspection = (scriptId: string) => {
    console.log('Starting inspection process for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleRejectInspection = (scriptId: string) => {
    console.log('Rejecting inspection for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'rejected' }));
    toast({
      title: "Inspection Rejected",
      description: "The appliance needs to be revised",
      variant: "destructive"
    });
  };

  const handleApproveInspection = (scriptId: string) => {
    console.log('Approving inspection for script:', scriptId);
    setInspectionStatus(prev => ({ ...prev, [scriptId]: 'approved' }));
    toast({
      title: "Inspection Approved",
      description: "The appliance is ready to insert",
      variant: "success"
    });
  };

  if (manufacturingScripts.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center gap-3">
          <Factory className="w-10 h-10 text-gray-400" />
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">No Manufacturing Data</h3>
            <p className="text-sm text-gray-500">
              There are no lab scripts with manufacturing information for {patientData.firstName} {patientData.lastName}.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {manufacturingScripts.map((script) => (
          <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                </h3>
                {script.manufacturingSource === 'Inhouse' && (
                  <div className="flex gap-2">
                    {!manufacturingStatus[script.id] && (
                      <Button 
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleStartClick(script.id)}
                      >
                        <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
                        Start {script.manufacturingType}
                      </Button>
                    )}
                    {manufacturingStatus[script.id] === 'in_progress' && (
                      <Button 
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleCompleteManufacturing(script.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
                        Complete {script.manufacturingType}
                      </Button>
                    )}
                    {manufacturingStatus[script.id] === 'completed' && !sinteringStatus[script.id] && (
                      <Button 
                        variant="outline"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleStartSintering(script.id)}
                      >
                        <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
                        Start Sintering
                      </Button>
                    )}
                    {sinteringStatus[script.id] === 'in_progress' && (
                      <Button 
                        variant="outline"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleCompleteSintering(script.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
                        Complete Sintering
                      </Button>
                    )}
                    {sinteringStatus[script.id] === 'completed' && !miyoStatus[script.id] && (
                      <Button 
                        variant="outline"
                        className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleStartMiyo(script.id)}
                      >
                        <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
                        Start Miyo
                      </Button>
                    )}
                    {miyoStatus[script.id] === 'in_progress' && (
                      <Button 
                        variant="outline"
                        className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleCompleteMiyo(script.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
                        Complete Miyo
                      </Button>
                    )}
                    {miyoStatus[script.id] === 'completed' && !inspectionStatus[script.id] && (
                      <Button 
                        variant="outline"
                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-105 transition-all duration-300 group"
                        onClick={() => handleStartInspection(script.id)}
                      >
                        <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
                        Start Inspection
                      </Button>
                    )}
                    {inspectionStatus[script.id] === 'in_progress' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transform hover:scale-105 transition-all duration-300 group"
                          onClick={() => handleRejectInspection(script.id)}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
                          Rejected
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transform hover:scale-105 transition-all duration-300 group"
                          onClick={() => handleApproveInspection(script.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
                          Approved
                        </Button>
                      </div>
                    )}
                    {inspectionStatus[script.id] === 'approved' && (
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
                        Ready to Insert
                      </div>
                    )}
                    {inspectionStatus[script.id] === 'rejected' && (
                      <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
                        Inspection Failed
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Manufacturing Source</p>
                  <p className="font-medium">{script.manufacturingSource}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Manufacturing Type</p>
                  <p className="font-medium">{script.manufacturingType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Material</p>
                  <p className="font-medium">{script.material || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Shade</p>
                  <p className="font-medium">{script.shade || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};