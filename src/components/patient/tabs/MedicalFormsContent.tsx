import { FileText } from "lucide-react";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();
  const [showHeadNeckForm, setShowHeadNeckForm] = useState(false);

  if (!patientId) {
    return <div>Error: Patient ID not found</div>;
  }

  const handleFormSuccess = () => {
    console.log("Form submitted successfully");
    setShowHeadNeckForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Medical Forms</h2>
        </div>
        
        <div className="grid gap-4">
          {/* Head and Neck Examination Form */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Head and Neck Examination</h3>
                <p className="text-sm text-gray-500">Comprehensive examination form</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowHeadNeckForm(true)}
              className="text-sm"
            >
              Fill Form
            </Button>
          </div>

          {/* Medical History Form - Placeholder */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
            <DialogTitle>Head and Neck Examination Form</DialogTitle>
          </DialogHeader>
          <HeadNeckExaminationForm 
            patientId={patientId} 
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};