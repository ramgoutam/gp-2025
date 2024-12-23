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
        className="bg-green-500/10 text-green-700 hover:bg-green-500/20 hover:text-green-800 
                 px-8 py-6 h-auto gap-3 text-lg font-semibold rounded-xl shadow-sm 
                 border-2 border-green-500/20 hover:border-green-500/30 
                 transition-all duration-300 transform hover:scale-[1.02]"
        disabled
      >
        <CheckCircle2 className="h-6 w-6" />
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
          ? "bg-primary text-white hover:bg-primary/90"
          : "bg-green-500 text-white hover:bg-green-600"
      } px-8 py-6 h-auto gap-3 text-lg font-semibold rounded-xl
        shadow-md hover:shadow-lg transform hover:scale-[1.02]
        transition-all duration-300`}
    >
      <PlayCircle className="h-6 w-6" />
      {isPending ? "Start Design" : "Complete Design"}
    </Button>
  );
};