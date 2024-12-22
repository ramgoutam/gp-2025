import React from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, MoreVertical, Calendar, FileText, FileBarChart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showLabScriptDialog, setShowLabScriptDialog] = React.useState(false);
  
  // This would typically fetch patient data from an API
  const patientData = {
    id,
    firstName: "Willie",
    lastName: "Jennie",
    avatar: "/placeholder.svg", // Using placeholder for now
    note: "Have uneven jawline",
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
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={patientData.avatar}
                alt={`${patientData.firstName} ${patientData.lastName}`}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {patientData.firstName} {patientData.lastName}
                </h1>
                <p className="text-gray-500 flex items-center gap-2">
                  {patientData.note}
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => console.log("Create appointment clicked")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Appointment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLabScriptDialog(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Lab Script
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/reports")}>
                    <FileBarChart className="mr-2 h-4 w-4" />
                    Create Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Lab Script</DialogTitle>
            <DialogDescription>
              Create a new lab script for {patientData.firstName} {patientData.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Add your lab script form here */}
            <p className="text-sm text-gray-500">Lab script form will be implemented here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientProfile;