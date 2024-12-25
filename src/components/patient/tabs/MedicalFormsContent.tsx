import { FileText, PenSquare } from "lucide-react";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();
  const [showHeadNeckForm, setShowHeadNeckForm] = useState(false);
  const [existingExamination, setExistingExamination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExistingExamination = async () => {
    if (!patientId) return;

    try {
      console.log("Fetching existing examination for patient:", patientId);
      const { data, error } = await supabase
        .from('head_neck_examinations')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      console.log("Existing examination data:", data);
      setExistingExamination(data?.[0] || null);
    } catch (error) {
      console.error("Error fetching examination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingExamination();
  }, [patientId]);

  if (!patientId) {
    return <div>Error: Patient ID not found</div>;
  }

  const handleFormSuccess = () => {
    console.log("Form submitted successfully");
    setShowHeadNeckForm(false);
    // Refresh the examination data
    fetchExistingExamination();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Medical Forms</h2>
        </div>
        
        <div className="grid gap-4">
          {/* Head and Neck Examination Form */}
          <div className={cn(
            "flex items-center justify-between p-4 rounded-lg transition-colors",
            existingExamination ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
          )}>
            <div className="flex items-center gap-3">
              <FileText className={cn(
                "w-5 h-5",
                existingExamination ? "text-green-600" : "text-primary"
              )} />
              <div>
                <h3 className="font-medium">Head and Neck Examination</h3>
                <p className="text-sm text-gray-500">
                  {existingExamination 
                    ? `Last updated: ${new Date(existingExamination.updated_at).toLocaleDateString()}`
                    : "Comprehensive examination form"}
                </p>
              </div>
            </div>
            <Button 
              variant={existingExamination ? "outline" : "default"}
              onClick={() => setShowHeadNeckForm(true)}
              className={cn(
                "text-sm gap-2",
                existingExamination ? "text-green-600 border-green-200 hover:border-green-300 hover:bg-green-50" : ""
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {existingExamination ? (
                    <>
                      <PenSquare className="w-4 h-4" />
                      Edit Examination
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Fill Form
                    </>
                  )}
                </>
              )}
            </Button>
          </div>

          {/* Medical History Form - Placeholder */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Medical History</h3>
                <p className="text-sm text-gray-500">Patient medical history form</p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="text-sm"
              disabled
            >
              Coming Soon
            </Button>
          </div>

          {/* Consent Form - Placeholder */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Consent Form</h3>
                <p className="text-sm text-gray-500">Treatment consent documentation</p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="text-sm"
              disabled
            >
              Coming Soon
            </Button>
          </div>
        </div>
      </div>

      {/* Head and Neck Examination Form Dialog */}
      <Dialog 
        open={showHeadNeckForm} 
        onOpenChange={setShowHeadNeckForm}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {existingExamination ? "Edit Head and Neck Examination" : "Head and Neck Examination Form"}
            </DialogTitle>
          </DialogHeader>
          <HeadNeckExaminationForm 
            patientId={patientId} 
            onSuccess={handleFormSuccess}
            existingData={existingExamination}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};