import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { LabScript } from "../LabScriptsTab";

interface StatusButtonProps {
  status: LabScript["status"];
  onStatusChange?: () => void;
}

export const StatusButton = ({ status, onStatusChange }: StatusButtonProps) => {
  if (status === "completed") {
    return (
      <Button
        variant="ghost"
        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 px-6 py-5 h-auto gap-2 text-base font-medium"
        disabled
      >
        <CheckCircle2 className="h-5 w-5" />
        Design Completed
      </Button>
    );
  }

  const isPending = status === "pending";

  return (
    <Button
      onClick={onStatusChange}
      variant="ghost"
      className={`${
        isPending
          ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
          : "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
      } px-6 py-5 h-auto gap-2 text-base font-medium transition-all duration-200`}
    >
      <PlayCircle className="h-5 w-5" />
      {isPending ? "Start Design" : "Complete Design"}
    </Button>
  );
};