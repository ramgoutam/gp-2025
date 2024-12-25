import { FileText, PenSquare, Trash2 } from "lucide-react";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();
  const [showHeadNeckForm, setShowHeadNeckForm] = useState(false);
  const [existingExamination, setExistingExamination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchExistingExamination = async () => {
    if (!patientId) return;

    try {
      console.log("Fetching existing examination for patient:", patientId);
      const { data, error } = await supabase
        .from('head_neck_examinations')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      console.log("Existing examination data:", data);
      setExistingExamination(data?.[0] || null);
    } catch (error) {
      console.error("Error fetching examination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingExamination();
  }, [patientId]);

  const handleFormSuccess = () => {
    console.log("Form submitted successfully");
    setShowHeadNeckForm(false);
    // Refresh the examination data
    fetchExistingExamination();
  };

  const handleDelete = async () => {
    if (!existingExamination?.id) return;

    try {
      const { error } = await supabase
        .from('head_neck_examinations')
        .delete()
        .eq('id', existingExamination.id);

      if (error) throw error;

      toast.success("Examination deleted successfully");
      setShowDeleteDialog(false);
      setExistingExamination(null);
    } catch (error) {
      console.error("Error deleting examination:", error);
      toast.error("Failed to delete examination");
    }
  };

  if (!patientId) {
    return <div>Error: Patient ID not found</div>;
  }

  const getExaminationStatus = () => {
    if (!existingExamination) return null;
    return {
      status: existingExamination.status || 'draft',
      lastUpdated: new Date(existingExamination.updated_at).toLocaleDateString()
    };
  };

  const examinationStatus = getExaminationStatus();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Medical Forms</h2>
        </div>
        
        <div className="grid gap-4">
          {/* Head and Neck Examination Form */}
          <div className={cn(
            "flex items-center justify-between p-4 rounded-lg transition-colors",
            existingExamination ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
          )}>
            <div className="flex items-center gap-3">
              <FileText className={cn(
                "w-5 h-5",
                existingExamination ? "text-green-600" : "text-primary"
              )} />
              <div>
                <h3 className="font-medium">Head and Neck Examination</h3>
                {examinationStatus ? (
                  <p className="text-sm text-gray-500">
                    Status: {examinationStatus.status.charAt(0).toUpperCase() + examinationStatus.status.slice(1)} | 
                    Last updated: {examinationStatus.lastUpdated}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Comprehensive examination form
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={existingExamination ? "outline" : "default"}
                onClick={() => setShowHeadNeckForm(true)}
                className={cn(
                  "text-sm gap-2",
                  existingExamination ? "text-green-600 border-green-200 hover:border-green-300 hover:bg-green-50" : ""
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    {existingExamination ? (
                      <>
                        <PenSquare className="w-4 h-4" />
                        Edit
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Fill Form
                      </>
                    )}
                  </>
                )}
              </Button>
              {existingExamination && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-sm gap-2 text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
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
              {existingExamination ? "Edit Head and Neck Examination" : "Head and Neck Examination Form"}
            </DialogTitle>
          </DialogHeader>
          <HeadNeckExaminationForm 
            patientId={patientId} 
            onSuccess={handleFormSuccess}
            onClose={() => setShowHeadNeckForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the examination record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};