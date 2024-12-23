import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle } from "lucide-react";
import { LabScript } from "../LabScriptsTab";
import { useToast } from "@/hooks/use-toast";

interface StatusButtonProps {
  status: LabScript['status'];
  onStatusChange: () => void;
}

export const StatusButton = ({ status, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    onStatusChange();
    const message = status === 'pending' ? 'Design started' : 'Design completed';
    toast({
      title: "Status Updated",
      description: message
    });
  };

  if (status === 'completed') return null;

  return status === 'pending' ? (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="flex items-center gap-2 hover:bg-primary/5"
    >
      <PlayCircle className="h-4 w-4 text-primary" />
      Start Design
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
    >
      <CheckCircle className="h-4 w-4" />
      Complete Design
    </Button>
  );
};