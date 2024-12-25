import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FormSteps } from "./head-neck-examination/FormSteps";
import { useFormSteps } from "./head-neck-examination/useFormSteps";
import { FormContent } from "./head-neck-examination/FormContent";

interface HeadNeckExaminationFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export const HeadNeckExaminationForm = ({ patientId, onSuccess }: HeadNeckExaminationFormProps) => {
  const { currentStep, handleNext, handlePrevious, totalSteps } = useFormSteps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patient_id: patientId,
    vital_signs: {},
    medical_history: {},
    chief_complaints: {},
    extra_oral_examination: {},
    intra_oral_examination: {},
    dental_classification: {},
    skeletal_presentation: {},
    functional_presentation: {},
    clinical_observation: {},
    tactile_observation: {},
    radiographic_presentation: {},
    tomography_data: {},
    evaluation_notes: "",
    maxillary_sinuses_evaluation: "",
    airway_evaluation: "",
    guideline_questions: {},
    status: "draft"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission triggered");
    
    if (currentStep !== totalSteps - 1) {
      console.log("Not on final step, preventing submission");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting head and neck examination form for patient:", patientId);
      
      // First check if an examination already exists for this patient
      const { data: existingExam, error: fetchError } = await supabase
        .from('head_neck_examinations')
        .select('id')
        .eq('patient_id', patientId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let result;
      
      if (existingExam) {
        console.log("Updating existing examination:", existingExam.id);
        result = await supabase
          .from('head_neck_examinations')
          .update(formData)
          .eq('id', existingExam.id)
          .select()
          .single();
      } else {
        console.log("Creating new examination");
        result = await supabase
          .from('head_neck_examinations')
          .insert([formData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Examination form has been ${existingExam ? 'updated' : 'saved'} successfully.`,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving examination form:", error);
      toast({
        title: "Error",
        description: "Failed to save examination form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNext();
  };

  const handlePreviousStep = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePrevious();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-end px-4 py-3 border-b border-gray-100 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
          size="sm"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep === totalSteps - 1 ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="flex items-center gap-1"
          >
            {isSubmitting ? "Saving..." : "Save Examination"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNextStep}
            size="sm"
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        <FormSteps currentStep={currentStep} totalSteps={totalSteps} />
        
        <FormContent 
          currentStep={currentStep} 
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </form>
  );
};