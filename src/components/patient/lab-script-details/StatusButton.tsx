import { Button } from "@/components/ui/button";
import { LabScript } from "@/types/labScript";
import { useState } from "react";

interface StatusButtonProps {
  script: LabScript;
  status: LabScript["status"];
  onStatusChange: (newStatus: LabScript["status"]) => Promise<boolean>;
}

export const StatusButton = ({ script, status, onStatusChange }: StatusButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newStatus = status === "pending" ? "in_progress" : 
                       status === "in_progress" ? "completed" : 
                       "pending";
                       
      console.log("Changing status from", status, "to", newStatus);
      const success = await onStatusChange(newStatus);
      
      if (!success) {
        console.log("Status update failed");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "completed") return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleStatusChange}
      disabled={isUpdating}
      className="w-full mt-2"
    >
      {isUpdating ? "Updating..." : status === "pending" ? "Start" : "Complete"}
    </Button>
  );
};