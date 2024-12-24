import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { LabScript } from "@/types/labScript";

interface BasicInformationProps {
  script: LabScript;
}

export const BasicInformation = ({ script }: BasicInformationProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };

    return (
      <Badge variant="secondary" className={styles[status] || styles.pending}>
        {status?.replace("_", " ") || "pending"}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Request Number</p>
          <p className="font-medium">{script.requestNumber || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Status</p>
          {getStatusBadge(script.status)}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Doctor Name</p>
          <p className="font-medium">{script.doctorName}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Clinic Name</p>
          <p className="font-medium">{script.clinicName}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Request Date</p>
          <p className="font-medium">{format(new Date(script.requestDate), 'MMM dd, yyyy')}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Due Date</p>
          <p className="font-medium">{format(new Date(script.dueDate), 'MMM dd, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};