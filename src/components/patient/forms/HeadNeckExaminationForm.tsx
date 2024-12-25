import React, { useState, useEffect } from "react";
import { FormContent } from "./head-neck-examination/FormContent";
import { FormSteps } from "./head-neck-examination/FormSteps";
import { Button } from "@/components/ui/button";
import { useFormSteps } from "./head-neck-examination/useFormSteps";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useExaminationData } from "./head-neck-examination/useExaminationData";

interface HeadNeckExaminationFormProps {
  patientId: string;
  onSuccess: () => void;
}

export const HeadNeckExaminationForm = ({ 
  patientId,
  onSuccess 
}: HeadNeckExaminationFormProps) => {
  const { toast } = useToast();
  const { currentStep, handleNext, handlePrevious, totalSteps } = useFormSteps();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const { existingData, isLoading } = useExaminationData(patientId);

  useEffect(() => {
    if (existingData) {
      console.log("Setting existing data:", existingData);
      setFormData(existingData);
      
      // Calculate completed steps based on existing data
      const completed: { [key: number]: boolean } = {};
      if (existingData.vital_signs) completed[0] = true;
      if (existingData.medical_history) completed[1] = true;
      if (existingData.chief_complaints) completed[2] = true;
      if (existingData.extra_oral_examination) completed[3] = true;
      if (existingData.intra_oral_examination) completed[4] = true;
      if (existingData.dental_classification) completed[5] = true;
      if (existingData.functional_presentation) completed[6] = true;
      if (existingData.tactile_observation || existingData.radiographic_presentation) completed[7] = true;
      if (existingData.evaluation_notes) completed[8] = true;
      if (existingData.guideline_questions) completed[9] = true;
      
      setCompletedSteps(completed);
    }
  }, [existingData]);

  const saveFormData = async () => {
    setIsSaving(true);
    try {
      console.log("Saving form data:", formData);
      const { error } = await supabase
        .from('head_neck_examinations')
        .upsert({
          ...formData,
          patient_id: patientId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mark current step as completed
      setCompletedSteps(prev => ({
        ...prev,
        [currentStep]: true
      }));

      toast({
        title: "Success",
        description: "Form data saved successfully",
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Error",
        description: "Failed to save form data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStep = async () => {
    await saveFormData();
    handleNext();
  };

  const handleSubmit = async () => {
    await saveFormData();
    onSuccess();
  };

  return (
    <div className="space-y-6 py-4">
      <FormSteps 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        completedSteps={completedSteps}
      />
      
      <FormContent 
        currentStep={currentStep} 
        formData={formData} 
        setFormData={setFormData}
        isLoading={isLoading}
      />

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isSaving}
        >
          Previous
        </Button>

        {currentStep === totalSteps - 1 ? (
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save & Submit"}
          </Button>
        ) : (
          <Button 
            onClick={handleNextStep}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save & Next"}
          </Button>
        )}
      </div>
    </div>
  );
};