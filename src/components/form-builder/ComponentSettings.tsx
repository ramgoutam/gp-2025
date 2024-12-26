import React from 'react';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FormComponent } from "@/types/formBuilder";

interface ComponentSettingsProps {
  component: FormComponent;
  onUpdateComponent: (updatedComponent: FormComponent) => void;
}

export const ComponentSettings = ({ component, onUpdateComponent }: ComponentSettingsProps) => {
  const handleRequiredToggle = () => {
    onUpdateComponent({
      ...component,
      required: !component.required,
    });
  };

  const handlePlaceholderEdit = () => {
    const newPlaceholder = prompt("Enter new placeholder text:", component.placeholder);
    if (newPlaceholder !== null) {
      onUpdateComponent({
        ...component,
        placeholder: newPlaceholder,
      });
    }
  };

  const handleLabelEdit = () => {
    const newLabel = prompt("Enter new label:", component.label);
    if (newLabel !== null) {
      onUpdateComponent({
        ...component,
        label: newLabel,
      });
    }
  };

  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLabelEdit}>
            Edit Label
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePlaceholderEdit}>
            Edit Placeholder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRequiredToggle}>
            {component.required ? "Make Optional" : "Make Required"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};