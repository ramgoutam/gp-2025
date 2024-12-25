import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();
  const [showHeadNeckForm, setShowHeadNeckForm] = useState(false);
  const [existingExamination, setExistingExamination] = useState(null);
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
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Head and Neck Examination</h3>
                <p className="text-sm text-gray-500">
                  {existingExamination 
                    ? `Last updated: ${new Date(existingExamination.updated_at).toLocaleDateString()}`
                    : "Comprehensive examination form"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {existingExamination && (
                <Button
                  variant="outline"
                  onClick={handleDeleteExamination}
                  className="text-sm gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
              <Button 
                variant={existingExamination ? "outline" : "default"}
                onClick={() => setShowHeadNeckForm(true)}
                className="text-sm gap-2"
              >
                <FileText className="w-4 h-4" />
                {existingExamination ? "Continue" : "Fill Form"}
              </Button>
            </div>
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
    </div>
  );
};