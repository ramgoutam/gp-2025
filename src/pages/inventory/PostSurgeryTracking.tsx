
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ProgressBar } from "@/components/patient/ProgressBar";
import { PostSurgeryForm } from "@/components/inventory/post-surgery/PostSurgeryForm";
import { columns } from "@/components/inventory/post-surgery/columns";
import { formSteps } from "@/types/postSurgeryTracking";

const PostSurgeryTracking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    patient: "",
    itemName: "",
    category: "",
    quantity: "",
    surgeryDate: "",
    notes: "",
    treatments: [] as string[]
  });

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleTreatment = (treatment: string) => {
    const newSelectedTreatments = selectedTreatments.includes(treatment)
      ? selectedTreatments.filter(t => t !== treatment)
      : [...selectedTreatments, treatment];
    
    setSelectedTreatments(newSelectedTreatments);
    handleInputChange('treatments', newSelectedTreatments);
  };

  const canProceed = () => {
    const currentFields = formSteps[currentStep].fields;
    return currentFields.every(field => {
      if (field === 'treatments') {
        return selectedTreatments.length > 0;
      }
      return formData[field as keyof typeof formData];
    });
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed" as const;
    if (index === currentStep) return "current" as const;
    return "upcoming" as const;
  };

  const progressSteps = formSteps.map((step, index) => ({
    label: step.title,
    status: getStepStatus(index)
  }));

  // Temporary empty data array for demo purposes
  const data: any[] = [];

  return (
    <main className="container h-[calc(100vh-4rem)] overflow-hidden py-0 my-0 mx-0 px-[4px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="aspect-square max-sm:p-0 text-right py-px my-[18px] text-base px-[19px] mx-[25px]">
            <Plus className="opacity-60 sm:-ms-1 sm:me-2" size={16} strokeWidth={2} aria-hidden="true" />
            <span className="max-sm:sr-only">Add new</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[800px] h-[calc(100vh-2rem)] overflow-hidden p-0 flex flex-col">
          <div className="p-6 flex-1 overflow-hidden">
            <DialogHeader className="px-0 pb-6">
              <DialogTitle>Add Post Surgery Item</DialogTitle>
            </DialogHeader>
            <ProgressBar steps={progressSteps} activeStep={currentStep} />
            <div className="text-sm text-muted-foreground mb-4">
              Step {currentStep + 1} of {formSteps.length}: {formSteps[currentStep].title}
            </div>
            <PostSurgeryForm
              currentStep={currentStep}
              formData={formData}
              selectedTreatments={selectedTreatments}
              handleInputChange={handleInputChange}
              toggleTreatment={toggleTreatment}
            />
          </div>
          <div className="border-t p-6 flex justify-between py-[10px]">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-white flex flex-row-reverse gap-2 bg-blue-800 hover:bg-blue-700"
            >
              <span>Previous</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {currentStep === formSteps.length - 1 ? (
              <Button
                type="submit"
                disabled={!canProceed()}
                className="bg-black text-white hover:bg-black/90"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="text-white flex gap-2 bg-blue-800 hover:bg-blue-700"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Card className="mx-6">
        <div className="p-6">
          <DataTable columns={columns} data={data} />
        </div>
      </Card>
    </main>
  );
};

export default PostSurgeryTracking;
