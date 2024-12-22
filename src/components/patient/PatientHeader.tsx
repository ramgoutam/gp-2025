import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type PatientHeaderProps = {
  patientData: {
    firstName: string;
    lastName: string;
    avatar: string;
    note: string;
  };
  onCreateLabScript: () => void;
};

export const PatientHeader = ({ patientData }: PatientHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <img
          src={patientData.avatar}
          alt={`${patientData.firstName} ${patientData.lastName}`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {patientData.firstName} {patientData.lastName}
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            {patientData.note}
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};