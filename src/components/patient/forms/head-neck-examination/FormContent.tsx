import React from "react";
import { ChiefComplaintsSection } from "./ChiefComplaintsSection";
import { VitalSignsSection } from "./VitalSignsSection";
import { MedicalHistorySection } from "./MedicalHistorySection";
import { ExtraOralSection } from "./ExtraOralSection";
import { IntraOralSection } from "./IntraOralSection";
import { DentalClassificationSection } from "./DentalClassificationSection";
import { FunctionalPresentationSection } from "./FunctionalPresentationSection";
import { TactileRadiographicSection } from "./TactileRadiographicSection";
import { EvaluationSection } from "./EvaluationSection";
import { GuidelineQuestionsSection } from "./GuidelineQuestionsSection";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateExaminationPDF } from "@/utils/pdfUtils";
import { useToast } from "@/hooks/use-toast";

interface FormContentProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

export const FormContent = ({ currentStep, formData, setFormData }: FormContentProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      console.log("Initiating PDF download for form data:", formData);
      await generateExaminationPDF(formData);
      toast({
        title: "Success",
        description: "Examination report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download examination report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <VitalSignsSection formData={formData} setFormData={setFormData} />;
      case 1:
        return <MedicalHistorySection formData={formData} setFormData={setFormData} />;
      case 2:
        return <ChiefComplaintsSection formData={formData} setFormData={setFormData} />;
      case 3:
        return <ExtraOralSection formData={formData} setFormData={setFormData} />;
      case 4:
        return <IntraOralSection formData={formData} setFormData={setFormData} />;
      case 5:
        return <DentalClassificationSection formData={formData} setFormData={setFormData} />;
      case 6:
        return <FunctionalPresentationSection formData={formData} setFormData={setFormData} />;
      case 7:
        return <TactileRadiographicSection formData={formData} setFormData={setFormData} />;
      case 8:
        return <EvaluationSection formData={formData} setFormData={setFormData} />;
      case 9:
        return <GuidelineQuestionsSection formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[400px] relative">
      <div className="absolute top-0 right-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>
      <div className="pt-12">
        {renderStepContent()}
      </div>
    </div>
  );
};