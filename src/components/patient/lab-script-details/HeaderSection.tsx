import { format, isValid } from "date-fns";
import { LabScript } from "@/types/labScript";

interface HeaderSectionProps {
  script: LabScript;
}

export const HeaderSection = ({ script }: HeaderSectionProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-500">Doctor Name</h4>
        <p className="text-lg">{script.doctorName}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-500">Clinic Name</h4>
        <p className="text-lg">{script.clinicName}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-500">Request Date</h4>
        <p className="text-lg">{formatDate(script.requestDate)}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-500">Due Date</h4>
        <p className="text-lg">{formatDate(script.dueDate)}</p>
      </div>
    </div>
  );
};