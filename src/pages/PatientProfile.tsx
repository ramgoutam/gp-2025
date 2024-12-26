import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { getLabScripts, updateLabScript, deleteLabScript } from "@/utils/databaseUtils";
import { supabase } from "@/integrations/supabase/client";
import { AuthWrapper } from "@/components/patient/profile/AuthWrapper";
import { LoadingPatient } from "@/components/patient/profile/LoadingPatient";
import { PatientContent } from "@/components/patient/profile/PatientContent";

const PatientProfile = () => {
  const [showLabScriptDialog, setShowLabScriptDialog] = useState(false);
  const [labScripts, setLabScripts] = useState<LabScript[]>([]);
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
          navigate("/login");
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
        navigate("/login");
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
      await loadScripts();
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

  return (
    <AuthWrapper loading={loading} session={session}>
      {!patientData ? (
        <LoadingPatient />
      ) : (
        <PatientContent
          patientData={patientData}
          labScripts={labScripts}
          showLabScriptDialog={showLabScriptDialog}
          setShowLabScriptDialog={setShowLabScriptDialog}
          onLabScriptSubmit={handleLabScriptSubmit}
          onEditLabScript={handleEditLabScript}
          onDeleteLabScript={handleDeleteLabScript}
          onUpdatePatient={handleUpdatePatient}
          id={id}
        />
      )}
    </AuthWrapper>
  );
};

export default PatientProfile;