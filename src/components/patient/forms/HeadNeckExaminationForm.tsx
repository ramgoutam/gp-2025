import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { FormSteps } from "./head-neck-examination/FormSteps";
import { useFormSteps } from "./head-neck-examination/useFormSteps";
import { FormContent } from "./head-neck-examination/FormContent";

interface HeadNeckExaminationFormProps {
  patientId: string;
  onSuccess?: () => void;
  existingData?: any;
}

export const HeadNeckExaminationForm = ({ 
  patientId, 
  onSuccess,
  existingData 
}: HeadNeckExaminationFormProps) => {
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

  const { currentStep, handleNext, handlePrevious, totalSteps, stepsStatus } = useFormSteps(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (existingData) {
      console.log("Loading existing examination data:", existingData);
      setFormData(prevData => ({
        ...prevData,
        ...existingData,
        patient_id: patientId
      }));
    }
  }, [existingData, patientId]);

  const handleSubmit = async (e: React.FormEvent, shouldClose: boolean = false) => {
    e.preventDefault();
    console.log("Form submission triggered");
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting head and neck examination form for patient:", patientId);
      
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

      // Only close and reset if explicitly saving and submitting
      if (shouldClose && onSuccess) {
        onSuccess();
      } else {
        // If not closing, proceed to next step
        handleNext();
      }
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
    handleSubmit(e as any, false);
  };

  const handlePreviousStep = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePrevious();
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
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

        <Button
          type="button"
          onClick={handleNextStep}
          disabled={currentStep === totalSteps - 1 || isSubmitting}
          size="sm"
          className="flex items-center gap-1"
        >
          Save & Next
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="sm"
          className="flex items-center gap-1"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save & Submit"}
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        <FormSteps 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          stepsStatus={stepsStatus}
        />
        
        <FormContent 
          currentStep={currentStep} 
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </form>
  );
};