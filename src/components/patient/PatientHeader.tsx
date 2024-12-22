import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Calendar, FileText, FileBarChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PatientHeaderProps = {
  patientData: {
    firstName: string;
    lastName: string;
    avatar: string;
    note: string;
  };
  onCreateLabScript: () => void;
};

export const PatientHeader = ({ patientData, onCreateLabScript }: PatientHeaderProps) => {
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
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log("Create appointment clicked")}>
              <Calendar className="mr-2 h-4 w-4" />
              Create Appointment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateLabScript}>
              <FileText className="mr-2 h-4 w-4" />
              Create Lab Script
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileBarChart className="mr-2 h-4 w-4" />
              Create Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};