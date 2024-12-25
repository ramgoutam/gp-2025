import { Button } from "@/components/ui/button";
import { LabScript } from "@/types/labScript";
import { useStatusUpdater } from "./StatusUpdater";

interface StatusButtonProps {
  script: LabScript;
  status: LabScript['status'];
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, status, onStatusChange }: StatusButtonProps) => {
  const { updateStatus } = useStatusUpdater();

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    console.log("Handling status change in StatusButton:", script.id, newStatus);
    try {
      await updateStatus(script, newStatus);
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getNextStatus = () => {
    switch (status) {
      case 'pending':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <Button
      variant="outline"
      className={`${getStatusColor()} border-none font-medium`}
      onClick={() => handleStatusChange(getNextStatus())}
    >
      {getStatusText()}
    </Button>
  );
};