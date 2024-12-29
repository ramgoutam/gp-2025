import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface BaseButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export const BaseButton = ({ onClick, icon: Icon, label, className }: BaseButtonProps) => {
  const buttonClass = "transition-all duration-300 transform hover:scale-105";
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`${buttonClass} ${className}`}
    >
      <Icon className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
      {label}
    </Button>
  );
};