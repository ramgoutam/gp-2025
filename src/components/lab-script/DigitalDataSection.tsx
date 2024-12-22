import React from "react";
import { DigitalDataUpload } from "./DigitalDataUpload";

const DIGITAL_DATA_SECTIONS = {
  surgical: {
    items: [
      "Pictures",
      "Initial Jaw records (STL)*",
      "Pre-Surgical Markers (STL)*",
      "Post-Surgery Tissue with Refs*"
    ]
  },
  printed: {
    items: [
      "Pictures",
      "Follow-up Jaw Records (STL)*",
      "Follow-up Tissue with Ref*"
    ]
  }
};

type FileUpload = {
  id: string;
  file: File | null;
};

interface DigitalDataSectionProps {
  uploads: Record<string, FileUpload>;
  onFileChange: (itemId: string, file: File | null) => void;
  applianceType: string;
}

export const DigitalDataSection = ({ uploads, onFileChange, applianceType }: DigitalDataSectionProps) => {
  console.log("Current appliance type:", applianceType);

  if (!applianceType) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Digital Data</h3>
      <div className="grid grid-cols-2 gap-8">
        {applianceType === "Surgical Day appliance" ? (
          <DigitalDataUpload
            key="surgical"
            section={DIGITAL_DATA_SECTIONS.surgical}
            sectionKey="surgical"
            uploads={uploads}
            onFileChange={onFileChange}
          />
        ) : (
          <DigitalDataUpload
            key="printed"
            section={DIGITAL_DATA_SECTIONS.printed}
            sectionKey="printed"
            uploads={uploads}
            onFileChange={onFileChange}
          />
        )}
      </div>
    </div>
  );
};