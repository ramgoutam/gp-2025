import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormSteps } from "./head-neck-examination/FormSteps";
import { useFormSteps } from "./head-neck-examination/useFormSteps";
import { FormContent } from "./head-neck-examination/FormContent";
import { FormHeader } from "./head-neck-examination/FormHeader";

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
  const { currentStep, handleNext, handlePrevious, totalSteps, setCurrentStep } = useFormSteps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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

  const saveFormData = async () => {
    console.log("Saving form data...");
    try {
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
        description: "Progress saved successfully.",
      });

      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }

      return true;
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission triggered");
    
    if (currentStep !== totalSteps - 1) {
      console.log("Not on final step, preventing submission");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await saveFormData();
      if (success && onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await saveFormData();
      if (success) {
        handleNext();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePrevious();
  };

  const handleStepChange = async (step: number) => {
    const success = await saveFormData();
    if (success) {
      setCurrentStep(step);
    }
  };

  const handleDownload = () => {
    // Convert formData to a formatted string
    const formattedData = JSON.stringify(formData, null, 2);
    
    // Create a blob with the data
    const blob = new Blob([formattedData], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `head-neck-examination-${patientId}.json`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Examination data downloaded successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <FormHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
        onSubmit={handleSubmit}
        onDownload={handleDownload}
      />
      
      <div className="p-6 space-y-6">
        <FormSteps 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          formData={formData}
          onStepChange={handleStepChange}
          completedSteps={completedSteps}
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