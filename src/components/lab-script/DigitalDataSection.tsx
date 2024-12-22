import React from "react";
import { DigitalDataUpload } from "./DigitalDataUpload";

const DIGITAL_DATA_SECTIONS = {
  surgical: {
    title: "Surgical Day Appliance",
    items: [
      "Pictures",
      "Initial Jaw records (STL)*",
      "Pre-Surgical Markers (STL)*",
      "Post-Surgery Tissue with Refs*"
    ]
  },
  printed: {
    title: "Printed Tryin / Nightguard / Final PMMA or Zr",
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
}

export const DigitalDataSection = ({ uploads, onFileChange }: DigitalDataSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Digital Data</h3>
      <div className="grid grid-cols-2 gap-8">
        {Object.entries(DIGITAL_DATA_SECTIONS).map(([key, section]) => (
          <DigitalDataUpload
            key={key}
            section={section}
            sectionKey={key}
            uploads={uploads}
            onFileChange={onFileChange}
          />
        ))}
      </div>
    </div>
  );
};