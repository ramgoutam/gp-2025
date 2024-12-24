import { FileText } from "lucide-react";
import { HeadNeckExaminationForm } from "../forms/HeadNeckExaminationForm";
import { useParams } from "react-router-dom";

export const MedicalFormsContent = () => {
  const { id: patientId } = useParams();

  if (!patientId) {
    return <div>Error: Patient ID not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Medical Forms</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <FileText className="w-4 h-4" />
            Upload Form
          </button>
        </div>
        
        <div className="grid gap-6">
          <HeadNeckExaminationForm patientId={patientId} />

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium">Medical History Form</h3>
                  <p className="text-sm text-gray-500">Last updated: March 15, 2024</p>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-primary/80">
                View
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium">Consent Form</h3>
                  <p className="text-sm text-gray-500">Last updated: March 10, 2024</p>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-primary/80">
                View
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium">Insurance Information</h3>
                  <p className="text-sm text-gray-500">Last updated: March 5, 2024</p>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-primary/80">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};