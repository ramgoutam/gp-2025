import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { getLabScripts, updateLabScript, deleteLabScript } from "@/utils/databaseUtils";
import { Loader } from "lucide-react";
import { Login } from "@/components/auth/Login";
import { supabase } from "@/integrations/supabase/client";

const PatientProfile = () => {
  const [showLabScriptDialog, setShowLabScriptDialog] = React.useState(false);
  const [labScripts, setLabScripts] = React.useState<LabScript[]>([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(() => {
    if (state?.patientData) {
      return state.patientData;
    }
    return null;
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Current session:", currentSession);
        setSession(currentSession);
        
        if (!currentSession) {
          console.log("No active session, redirecting to login");
          navigate("/");
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadScripts = async () => {
    try {
      console.log("Loading scripts for patient:", id);
      const allScripts = await getLabScripts();
      const patientScripts = allScripts.filter(script => script.patientId === id);
      console.log("Filtered scripts for patient:", patientScripts.length);
      setLabScripts(patientScripts);
    } catch (error) {
      console.error("Error loading scripts:", error);
      toast({
        title: "Error",
        description: "Failed to load lab scripts. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (id && session) {
      loadScripts();
    }
  }, [id, session]);

  const handleLabScriptSubmit = async (formData: any) => {
    try {
      console.log("Lab script submitted successfully:", formData);
      await loadScripts(); // Reload scripts after submission
      setShowLabScriptDialog(false);
      
      toast({
        title: "Lab Script Created",
        description: "The lab script has been successfully created.",
      });
    } catch (error) {
      console.error("Error handling lab script submission:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditLabScript = async (updatedScript: LabScript) => {
    try {
      console.log("Updating lab script:", updatedScript);
      const savedScript = await updateLabScript(updatedScript);
      
      // Update local state directly instead of reloading
      setLabScripts(prev => 
        prev.map(script => script.id === savedScript.id ? savedScript : script)
      );
      
      toast({
        title: "Lab Script Updated",
        description: "The lab script has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to update lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLabScript = async (scriptToDelete: LabScript) => {
    try {
      console.log("Deleting script:", scriptToDelete);
      await deleteLabScript(scriptToDelete.id);
      
      // Update local state directly instead of reloading
      setLabScripts(prev => prev.filter(script => script.id !== scriptToDelete.id));
      
      toast({
        title: "Lab Script Deleted",
        description: "The lab script has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting lab script:", error);
      toast({
        title: "Error",
        description: "Failed to delete lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePatient = (updatedData: typeof patientData) => {
    console.log("Updating patient data:", updatedData);
    setPatientData(updatedData);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  if (!patientData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 animate-fade-in">
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto py-8 px-4 h-full flex flex-col">
          <div className="text-sm text-gray-500 mb-6 hover:text-primary transition-colors duration-300">
            Patient list / Patient detail
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col overflow-hidden border">
            <PatientHeader 
              patientData={patientData}
              onCreateLabScript={() => setShowLabScriptDialog(true)}
              onUpdatePatient={handleUpdatePatient}
            />

            <div className="flex-1 overflow-hidden">
              <PatientTabs
                labScripts={labScripts}
                onCreateLabScript={() => setShowLabScriptDialog(true)}
                onEditLabScript={handleEditLabScript}
                onDeleteLabScript={handleDeleteLabScript}
                patientData={patientData}
              />
            </div>
          </div>
        </div>
      </main>

      <Dialog 
        open={showLabScriptDialog} 
        onOpenChange={setShowLabScriptDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Create Lab Script
            </DialogTitle>
            <DialogDescription>
              Create a new lab script for {patientData.firstName} {patientData.lastName}
            </DialogDescription>
          </DialogHeader>
          <LabScriptForm 
            onSubmit={handleLabScriptSubmit} 
            patientData={patientData}
            patientId={id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientProfile;
