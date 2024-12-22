import React, { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation } from "react-router-dom";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { useToast } from "@/hooks/use-toast";

const Scripts = () => {
  const location = useLocation();
  const [showDetails, setShowDetails] = React.useState(false);
  const [scriptData, setScriptData] = React.useState(null);
  const [showNewScriptDialog, setShowNewScriptDialog] = React.useState(false);
  const { toast } = useToast();
  
  // Get scripts from localStorage
  const [labScripts, setLabScripts] = React.useState(() => {
    const savedScripts = localStorage.getItem('labScripts');
    return savedScripts ? JSON.parse(savedScripts) : [];
  });

  useEffect(() => {
    if (location.state?.openScript) {
      console.log("Opening script details:", location.state.openScript);
      setScriptData(location.state.openScript);
      setShowDetails(true);
    }
  }, [location.state]);

  const handleNewScriptSubmit = (formData: any) => {
    console.log("Creating new lab script:", formData);
    const newScripts = [...labScripts, formData];
    setLabScripts(newScripts);
    localStorage.setItem('labScripts', JSON.stringify(newScripts));
    setShowNewScriptDialog(false);
    
    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lab Scripts</h1>
          <Button 
            onClick={() => setShowNewScriptDialog(true)}
            className="flex items-center gap-2"
          >
            <FilePlus className="h-4 w-4" />
            New Script
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {labScripts.map((script: any) => (
              <Card
                key={script.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setScriptData(script);
                  setShowDetails(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">
                        {script.patientFirstName} {script.patientLastName}
                      </h3>
                      <Badge
                        className={`${getStatusColor(script.status)} border-none`}
                      >
                        {script.status?.replace("_", " ") || "pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {script.applianceType}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dr. {script.doctorName} - {script.clinicName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      Due: {new Date(script.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {labScripts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No lab scripts found. Create a new script to get started.
              </div>
            )}
          </div>
        </div>

        <LabScriptDetails
          script={scriptData}
          open={showDetails}
          onOpenChange={setShowDetails}
          onEdit={() => {}}
        />

        <Dialog 
          open={showNewScriptDialog} 
          onOpenChange={setShowNewScriptDialog}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Lab Script</DialogTitle>
              <DialogDescription>
                Create a new lab script
              </DialogDescription>
            </DialogHeader>
            <LabScriptForm onSubmit={handleNewScriptSubmit} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Scripts;