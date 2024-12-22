import React from "react";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { LabScriptsTab, type LabScript } from "@/components/patient/LabScriptsTab";
import { useToast } from "@/components/ui/use-toast";

const PatientProfile = () => {
  const { id } = useParams();
  const [showLabScriptDialog, setShowLabScriptDialog] = React.useState(false);
  const [labScripts, setLabScripts] = React.useState<LabScript[]>([]);
  const { toast } = useToast();
  
  // This would typically fetch patient data from an API
  const patientData = {
    id,
    firstName: "Willie",
    lastName: "Jennie",
    avatar: "/placeholder.svg",
    note: "Have uneven jawline",
  };

  const handleLabScriptSubmit = (formData: any) => {
    console.log("Creating new lab script with data:", formData);
    
    // Create a new lab script object
    const newLabScript: LabScript = {
      id: Date.now().toString(), // In a real app, this would come from the backend
      doctorName: formData.doctorName,
      clinicName: formData.clinicName,
      requestDate: formData.requestDate,
      dueDate: formData.dueDate,
      status: "pending",
      treatments: {
        upper: [], // You would populate these based on the checkboxes
        lower: [],
      },
      specificInstructions: formData.specificInstructions,
    };

    // Add the new lab script to the list
    setLabScripts(prev => [...prev, newLabScript]);
    
    // Close the dialog
    setShowLabScriptDialog(false);
    
    // Show success toast
    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Patient list / Patient detail
        </div>

        {/* Patient Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <PatientHeader 
            patientData={patientData}
            onCreateLabScript={() => setShowLabScriptDialog(true)}
          />

          {/* Tabs */}
          <Tabs defaultValue="medical-record" className="w-full">
            <TabsList className="w-full justify-start border-b mb-6 bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger 
                value="patient-information"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
              >
                Patient Information
              </TabsTrigger>
              <TabsTrigger 
                value="appointment-history"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
              >
                Appointment History
              </TabsTrigger>
              <TabsTrigger 
                value="lab-scripts"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
              >
                Lab Scripts
              </TabsTrigger>
              <TabsTrigger 
                value="next-treatment"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
              >
                Next Treatment
              </TabsTrigger>
              <TabsTrigger 
                value="medical-record"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
              >
                Medical Record
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient-information">
              <div className="text-gray-600">Patient information content will go here</div>
            </TabsContent>
            
            <TabsContent value="appointment-history">
              <div className="text-gray-600">Appointment history will go here</div>
            </TabsContent>

            <TabsContent value="lab-scripts">
              <LabScriptsTab labScripts={labScripts} />
            </TabsContent>
            
            <TabsContent value="next-treatment">
              <div className="text-gray-600">Next treatment details will go here</div>
            </TabsContent>
            
            <TabsContent value="medical-record">
              <div className="space-y-6">
                {/* Service Toggle */}
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white">Medical</Button>
                  <Button variant="ghost">Cosmetic</Button>
                </div>

                {/* Medical Records Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Odontogram */}
                  <div className="bg-white rounded-lg p-6 border">
                    <h3 className="font-semibold mb-4">Odontogram</h3>
                    {/* Placeholder for odontogram visualization */}
                    <div className="aspect-square bg-gray-100 rounded-lg"></div>
                  </div>

                  {/* Treatment Records */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-6 border">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm text-gray-500">MAR 03</div>
                          <h4 className="font-semibold">Maxillary Left Lateral Incisor</h4>
                        </div>
                        <span className="text-green-500 text-sm">Done</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">CONDITION</div>
                          <div>Caries</div>
                        </div>
                        <div>
                          <div className="text-gray-500">TREATMENT</div>
                          <div>Tooth filling</div>
                        </div>
                        <div>
                          <div className="text-gray-500">DENTIST</div>
                          <div>Drg.Sopi Mactavish</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Lab Script Dialog */}
      <Dialog open={showLabScriptDialog} onOpenChange={setShowLabScriptDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Lab Script</DialogTitle>
            <DialogDescription>
              Create a new lab script for {patientData.firstName} {patientData.lastName}
            </DialogDescription>
          </DialogHeader>
          <LabScriptForm onSubmit={handleLabScriptSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientProfile;