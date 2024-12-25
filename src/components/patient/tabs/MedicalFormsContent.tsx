import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MedicalFormCard } from "../forms/medical-forms/MedicalFormCard";
import { FormContent } from "../forms/head-neck-examination/FormContent";
import { FormSteps } from "../forms/head-neck-examination/FormSteps";
import jsPDF from "jspdf";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();
  const [showHeadNeckForm, setShowHeadNeckForm] = useState(false);
  const [showExaminationSummary, setShowExaminationSummary] = useState(false);
  const [existingExamination, setExistingExamination] = useState(null);
  const [currentViewStep, setCurrentViewStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const fetchExistingExamination = async () => {
    if (!patientId) return;

    try {
      console.log("Fetching existing examination for patient:", patientId);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        console.log("No active session found");
        return;
      }

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
      
      // If there's existing data, determine completed steps
      if (data) {
        const completed: number[] = [];
        if (Object.keys(data.vital_signs || {}).length > 0) completed.push(0);
        if (Object.keys(data.medical_history || {}).length > 0) completed.push(1);
        if (Object.keys(data.chief_complaints || {}).length > 0) completed.push(2);
        if (Object.keys(data.extra_oral_examination || {}).length > 0) completed.push(3);
        if (Object.keys(data.intra_oral_examination || {}).length > 0) completed.push(4);
        if (Object.keys(data.dental_classification || {}).length > 0) completed.push(5);
        if (Object.keys(data.functional_presentation || {}).length > 0) completed.push(6);
        if (Object.keys(data.tactile_observation || {}) || 
            Object.keys(data.radiographic_presentation || {}).length > 0) completed.push(7);
        if (data.evaluation_notes || data.maxillary_sinuses_evaluation || 
            data.airway_evaluation) completed.push(8);
        if (Object.keys(data.guideline_questions || {}).length > 0) completed.push(9);
        setCompletedSteps(completed);
      }
    } catch (error) {
      console.error("Error fetching examination:", error);
      toast({
        title: "Error",
        description: "Failed to fetch examination data. Please try again.",
        variant: "destructive",
      });
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
      setCompletedSteps([]);
    } catch (error) {
      console.error("Error deleting examination:", error);
      toast({
        title: "Error",
        description: "Failed to delete examination. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExamination = () => {
    if (!existingExamination) return;
    
    const pdf = new jsPDF();
    let yPosition = 20;
    const lineHeight = 10;
    
    // Add title
    pdf.setFontSize(16);
    pdf.text("Head and Neck Examination Summary", 20, yPosition);
    yPosition += lineHeight * 2;

    // Helper function to add a section
    const addSection = (title: string, content: any) => {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(title, 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      if (typeof content === 'string') {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        const lines = pdf.splitTextToSize(content, 170);
        pdf.text(lines, 20, yPosition);
        yPosition += lineHeight * (lines.length + 1);
      } else if (typeof content === 'object' && content !== null) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        Object.entries(content).forEach(([key, value]) => {
          if (value) {
            const formattedKey = key.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            const text = `${formattedKey}: ${value}`;
            const lines = pdf.splitTextToSize(text, 170);
            pdf.text(lines, 25, yPosition);
            yPosition += lineHeight * lines.length;
          }
        });
        yPosition += lineHeight;
      }

      // Add new page if needed
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Add all examination sections
    if (existingExamination.vital_signs) {
      addSection("Vital Signs", existingExamination.vital_signs);
    }

    if (existingExamination.medical_history) {
      addSection("Medical History", existingExamination.medical_history);
    }

    if (existingExamination.chief_complaints) {
      addSection("Chief Complaints", existingExamination.chief_complaints);
    }

    if (existingExamination.extra_oral_examination) {
      addSection("Extra Oral Examination", existingExamination.extra_oral_examination);
    }

    if (existingExamination.intra_oral_examination) {
      addSection("Intra Oral Examination", existingExamination.intra_oral_examination);
    }

    if (existingExamination.dental_classification) {
      addSection("Dental Classification", existingExamination.dental_classification);
    }

    if (existingExamination.functional_presentation) {
      addSection("Functional Presentation", existingExamination.functional_presentation);
    }

    if (existingExamination.tactile_observation || existingExamination.radiographic_presentation) {
      addSection("Tactile & Radiographic Observations", {
        ...existingExamination.tactile_observation,
        ...existingExamination.radiographic_presentation
      });
    }

    if (existingExamination.evaluation_notes) {
      addSection("Evaluation Notes", existingExamination.evaluation_notes);
    }

    if (existingExamination.maxillary_sinuses_evaluation) {
      addSection("Maxillary Sinuses Evaluation", existingExamination.maxillary_sinuses_evaluation);
    }

    if (existingExamination.airway_evaluation) {
      addSection("Airway Evaluation", existingExamination.airway_evaluation);
    }

    if (existingExamination.guideline_questions) {
      addSection("Guideline Questions", existingExamination.guideline_questions);
    }

    // Add date at the bottom
    const date = new Date(existingExamination.created_at).toLocaleDateString();
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${date}`, 20, 280);

    // Save the PDF
    pdf.save(`head-neck-examination-${patientId}.pdf`);

    toast({
      title: "Success",
      description: "Complete examination summary PDF downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Medical Forms</h2>
        </div>
        
        <div className="grid gap-4">
          <MedicalFormCard
            title="Head and Neck Examination"
            description="Comprehensive examination form"
            lastUpdated={existingExamination ? new Date(existingExamination.updated_at).toLocaleDateString() : undefined}
            onAction={() => setShowHeadNeckForm(true)}
            actionLabel={existingExamination ? "Edit" : "Fill Form"}
            showDelete={!!existingExamination}
            showView={!!existingExamination}
            showDownload={!!existingExamination}
            onDelete={handleDeleteExamination}
            onView={() => setShowExaminationSummary(true)}
            onDownload={handleDownloadExamination}
          />

          <MedicalFormCard
            title="Medical History"
            description="Patient medical history form"
            actionLabel="Coming Soon"
            onAction={() => {}}
            isDisabled={true}
          />

          <MedicalFormCard
            title="Consent Form"
            description="Treatment consent documentation"
            actionLabel="Coming Soon"
            onAction={() => {}}
            isDisabled={true}
          />
        </div>
      </div>

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
                  totalSteps={10}
                  formData={existingExamination}
                  onStepChange={setCurrentViewStep}
                  completedSteps={completedSteps}
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
