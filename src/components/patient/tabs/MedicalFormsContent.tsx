import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MedicalFormCard } from "../forms/medical-forms/MedicalFormCard";
import { FormContent } from "../forms/head-neck-examination/FormContent";
import { FormSteps } from "../forms/head-neck-examination/FormSteps";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();
  const [showHeadNeckForm, setShowHeadNeckForm] = useState(false);
  const [showExaminationSummary, setShowExaminationSummary] = useState(false);
  const [existingExamination, setExistingExamination] = useState(null);
  const [currentViewStep, setCurrentViewStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchExistingExamination = async () => {
    if (!patientId) return;

    try {
      console.log("Fetching existing examination for patient:", patientId);
      const { data, error } = await supabase
        .from('head_neck_examinations')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      console.log("Existing examination data:", data);
      setExistingExamination(data);
    } catch (error) {
      console.error("Error fetching examination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingExamination();
  }, [patientId, showHeadNeckForm]);

  const handleFormSuccess = () => {
    console.log("Form submitted successfully");
    setShowHeadNeckForm(false);
    fetchExistingExamination();
  };

  const handleDeleteExamination = async () => {
    if (!existingExamination?.id) return;

    try {
      console.log("Deleting examination:", existingExamination.id);
      const { error } = await supabase
        .from('head_neck_examinations')
        .delete()
        .eq('id', existingExamination.id);

      if (error) throw error;

      toast({
        title: "Examination Deleted",
        description: "The examination has been successfully deleted.",
      });

      setExistingExamination(null);
    } catch (error) {
      console.error("Error deleting examination:", error);
      toast({
        title: "Error",
        description: "Failed to delete examination. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Medical Forms</h2>
        </div>
        
        <div className="grid gap-4">
          {/* Head and Neck Examination Form */}
          <MedicalFormCard
            title="Head and Neck Examination"
            description="Comprehensive examination form"
            lastUpdated={existingExamination ? new Date(existingExamination.updated_at).toLocaleDateString() : undefined}
            onAction={() => setShowHeadNeckForm(true)}
            actionLabel={existingExamination ? "Edit" : "Fill Form"}
            showDelete={!!existingExamination}
            showView={!!existingExamination}
            onDelete={handleDeleteExamination}
            onView={() => setShowExaminationSummary(true)}
          />

          {/* Medical History Form - Placeholder */}
          <MedicalFormCard
            title="Medical History"
            description="Patient medical history form"
            actionLabel="Coming Soon"
            onAction={() => {}}
            isDisabled={true}
          />

          {/* Consent Form - Placeholder */}
          <MedicalFormCard
            title="Consent Form"
            description="Treatment consent documentation"
            actionLabel="Coming Soon"
            onAction={() => {}}
            isDisabled={true}
          />
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
              {existingExamination ? "Continue Head and Neck Examination" : "Head and Neck Examination Form"}
            </DialogTitle>
          </DialogHeader>
          <HeadNeckExaminationForm 
            patientId={patientId!} 
            onSuccess={handleFormSuccess}
            existingData={existingExamination}
          />
        </DialogContent>
      </Dialog>

      {/* Examination Summary Dialog */}
      <Dialog
        open={showExaminationSummary}
        onOpenChange={setShowExaminationSummary}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Head and Neck Examination Summary</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            {existingExamination && (
              <>
                <FormSteps 
                  currentStep={currentViewStep} 
                  totalSteps={8}
                  formData={existingExamination}
                  onStepChange={setCurrentViewStep}
                />
                
                <div className="pointer-events-none opacity-90">
                  <FormContent 
                    currentStep={currentViewStep} 
                    formData={existingExamination}
                    setFormData={() => {}} // Empty function since it's read-only
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};