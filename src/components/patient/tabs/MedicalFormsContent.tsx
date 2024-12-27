import React from "react";

interface MedicalFormsContentProps {
  patientId: string;
}

export const MedicalFormsContent: React.FC<MedicalFormsContentProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Medical Forms</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">No medical forms available for this patient.</p>
        {/* Future implementation: Add medical forms list and form management */}
        <div className="mt-4">
          <ul className="space-y-2 text-sm text-gray-500">
            <li>• Medical History Form</li>
            <li>• Dental History Form</li>
            <li>• Treatment Consent Form</li>
            <li>• Insurance Information Form</li>
          </ul>
        </div>
      </div>
    </div>
  );
};