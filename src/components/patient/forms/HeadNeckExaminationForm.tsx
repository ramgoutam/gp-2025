import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeadNeckExaminationFormProps {
  patientId: string;
  onSuccess?: () => void;
}

type FormStep = {
  title: string;
  description: string;
};

const FORM_STEPS: FormStep[] = [
  {
    title: "Patient Information & Vital Signs",
    description: "Basic patient details and vital measurements",
  },
  {
    title: "Medical History",
    description: "Past medical conditions and current medications",
  },
  {
    title: "Clinical Examination",
    description: "Extra-oral and intra-oral examination details",
  },
  {
    title: "Observations & Analysis",
    description: "Clinical observations and diagnostic findings",
  },
];

export const HeadNeckExaminationForm = ({ patientId, onSuccess }: HeadNeckExaminationFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientData: {},
    vitalSigns: {},
    medicalHistory: {},
    chiefComplaints: {},
    extraOralExamination: {},
    intraOralExamination: {},
    dentalClassification: {},
    skeletalPresentation: {},
    functionalPresentation: {},
    clinicalObservation: {},
    tactileObservation: {},
    radiographicPresentation: {},
    tomographyData: {},
    evaluationNotes: "",
    maxillarySinusesEvaluation: "",
    airwayEvaluation: "",
    guidelineQuestions: {},
  });

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Submitting head and neck examination form for patient:", patientId);
      const { error } = await supabase
        .from('head_neck_examinations')
        .insert([
          {
            patient_id: patientId,
            ...formData,
            status: 'completed'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Examination form has been saved successfully.",
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for patient information and vital signs
            </h4>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for medical history
            </h4>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for clinical examination
            </h4>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for observations and analysis
            </h4>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {FORM_STEPS[currentStep].title}
          </h3>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {FORM_STEPS.length}
          </span>
        </div>
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">{FORM_STEPS[currentStep].description}</p>
      </div>

      {/* Form content */}
      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep === FORM_STEPS.length - 1 ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Saving..." : "Save Examination"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
};